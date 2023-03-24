import { ChangeEvent, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import {
    ChartAid,
    chartGradient,
    ComponentLoader,
    Frequency,
    getTelcoColor,
    groupBy,
    Period,
    RawAnalytics,
    SectionError,
    Status,
    Telco
} from '@nabcellent/sui-react';
import { ChartData, ChartOptions } from "chart.js";
import { useGetTelcoTransactionsQuery } from 'features/analytics/analyticsApi';
import { defaultLineChartOptions } from "utils/helpers";
import LineChart from "../../../components/charts/LineChart";

type Dataset = { telco: Telco, dataset: number[], color: string | number[], hidden: boolean }

const TelcoTransactions = () => {
    const { data, isError, error, isLoading, isSuccess, refetch } = useGetTelcoTransactionsQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [checkedTelcos, setCheckedTelcos] = useState<(string | Telco)[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt)
        aid.timeIsUTC = true
        let { labels, dataset } = aid.getDataset(data)

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => i === 0 ? [b] : [...a, b + a[i - 1]], [])
        }

        return { labels, dataset }
    }

    useEffect(() => {
        if (data) {
            const someFn = (data: any) => {
                let groupedData: { [key: string]: RawAnalytics[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status'),
                    rawData: RawAnalytics[]

                if (txStatus === 'ALL') {
                    rawData = Object.keys(groupedData).map((date) => groupedData[date].reduce((prev, curr) => ({
                        date: Number(date),
                        count: Number(prev.count) + Number(curr.count)
                    }), { date: 0, count: 0 }))
                } else {
                    rawData = groupedData[txStatus] ?? []
                }

                return drawChart(rawData)
            }

            let l: string[] = [], datasets: Dataset[] = []
            Object.keys(data).forEach((telco, i) => {
                const { labels, dataset } = someFn(data[telco as Telco])

                if (i === 0) l = labels
                datasets.push({
                    dataset,
                    hidden: !checkedTelcos.includes(telco),
                    telco: telco as Telco,
                    color: getTelcoColor(telco as Telco, true) as number[]
                })
            })

            setLabels(l)
            setDatasets(datasets)
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus, checkedTelcos])

    useEffect(() => {
        if (data) setCheckedTelcos(Object.keys(data))
    }, [data])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const options: ChartOptions<'line'> = defaultLineChartOptions({
        plugins: {
            title: {
                text: 'Transactions',
                padding: {
                    bottom: 50
                },
            },
        }
    });

    const chartData: ChartData<'line'> = {
        labels,
        datasets: datasets.map(d => ({
            label: d.telco,
            data: d.dataset,
            hidden: d.hidden,
            backgroundColor: chartGradient(d.color as number[]),
        })),
    };

    const handleCheckedTelcos = (e: ChangeEvent<HTMLInputElement>) => {
        let updatedList = [...checkedTelcos];

        if (e.target.checked) {
            updatedList = [...checkedTelcos, e.target.value as Telco];
        } else {
            updatedList.splice(checkedTelcos.indexOf(e.target.value), 1);
        }

        setCheckedTelcos(updatedList);
    }

    return (
        <Col xxl={6}>
            <LineChart
                data={chartData}
                options={options}
                refetch={refetch}
                txStatus={txStatus} setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt} setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt} setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt} setChartFreqOpt={setChartFreqOpt}
                extraModifiers={Object.keys(data).sort().map((telco, i) => (
                    <Form.Check key={`telco-${i}`} className={`px-2 me-2 ms-3`} id={`telco-tx-${i}`} value={telco}
                                style={{ color: String(getTelcoColor(telco as Telco)) }}
                                type={'checkbox'} label={<b>{telco}</b>} checked={checkedTelcos.includes(telco)}
                                onChange={handleCheckedTelcos}/>
                ))}
            />
        </Col>
    );
};

export default TelcoTransactions;
