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
import { useGetRevenueQuery } from 'features/analytics/analyticsApi';
import { defaultLineChartOptions } from "../../../utils/helpers";
import LineChart from "../../../components/charts/LineChart";
import { AnalyticsChartData } from "../../../utils/types";

const Revenue = () => {
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetRevenueQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [dataset, setDataset] = useState<number[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt, 'amount')
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
            let groupedData: { [key: string]: AnalyticsChartData[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status')

            if (txStatus === 'ALL') {
                const set = Object.keys(groupedData).map(date => {
                    return groupedData[date].reduce((prev, curr) => ({
                        date,
                        amount: prev.amount,
                        count: prev.amount + Number(curr.amount)
                    }), { date: '', amount: 0, count: 0 })
                })

                drawChart(set as unknown as RawAnalytics[])
            } else {
                drawChart(groupedData[txStatus].map(x => ({ ...x, count: x.amount })))
            }
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const options: ChartOptions<'line'> = defaultLineChartOptions({
        scales: {
            y: {
                title: {
                    color: '#191',
                    display: true,
                    text: '(KSH)'
                }
            }
        },
        plugins: {
            title: {
                text: 'Revenue',
            },
            tooltip: {
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `KES ${item.formattedValue}`
                }
            },
        }
    });

    const chartData: ChartData<'line'> = {
        labels,
        datasets: [{
            data: dataset,
            backgroundColor: chartGradient([31, 117, 3]),
        }],
    };

    return (
        <Col xxl={6} className={'mb-3'}>
            <LineChart
                data={chartData}
                options={options}
                refetch={refetch}
                isFetching={isFetching}
                txStatus={txStatus} setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt} setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt} setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt} setChartFreqOpt={setChartFreqOpt}
            />
        </Col>
    );
};

export default Revenue;
