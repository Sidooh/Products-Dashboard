import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import {
    ChartAid,
    chartGradient,
    ComponentLoader,
    Frequency,
    groupBy,
    Period,
    RawAnalytics,
    SectionError,
    Status
} from '@nabcellent/sui-react';
import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { useGetTransactionsQuery } from 'features/apis/analyticsApi';
import { defaultLineChartOptions } from "../../../utils/helpers";
import LineChart from "../../../components/charts/LineChart";

const Transactions = () => {
    const [bypassCache, setBypassCache] = useState(false)
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetTransactionsQuery(bypassCache);

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [dataset, setDataset] = useState<number[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt)
        aid.timeIsUTC = true
        let { labels, dataset } = aid.getDataset(data)

        setLabels(labels)

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => i === 0 ? [b] : [...a, b + a[i - 1]], [])
        }
        setDataset(dataset)
    }

    useEffect(() => {
        if (data?.length) {
            let groupedData: { [key: string]: RawAnalytics[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status'),
                rawData: RawAnalytics[]

            if (txStatus === 'ALL') {
                rawData = Object.keys(groupedData).map(date => {
                    return groupedData[date].reduce((prev, curr) => ({
                        date,
                        count: Number(prev.count) + Number(curr.count)
                    }), { date: 0, count: 0 })
                })
            } else {
                rawData = groupedData[txStatus]
            }

            drawChart(rawData)
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const options: ChartOptions<'line'> = defaultLineChartOptions({
        plugins: {
            title: {
                text: 'Transactions',
            },
            tooltip: {
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `${item.formattedValue} Transactions`
                }
            },

        }
    });

    const chartData: ChartData<'line'> = {
        labels,
        datasets: [{
            data: dataset,
            backgroundColor: chartGradient([15, 27, 76]),
        }],
    };

    return (
        <Col xxl={6}>
            <LineChart
                data={chartData}
                options={options}
                refetch={() => {
                    if (!bypassCache) setBypassCache(true)
                    refetch()
                }}
                isFetching={isFetching}
                txStatus={txStatus} setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt} setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt} setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt} setChartFreqOpt={setChartFreqOpt}
            />
        </Col>
    );
};

export default Transactions;
