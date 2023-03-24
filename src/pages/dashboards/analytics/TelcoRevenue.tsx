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
import { useGetTelcoRevenueQuery } from 'features/analytics/analyticsApi';
import { defaultLineChartOptions } from "utils/helpers";
import LineChart from "../../../components/charts/LineChart";
import { TooltipItem } from "chart.js/dist/types";

type Dataset = { telco: Telco, dataset: number[], color: string | number[], hidden: boolean }

const TelcoRevenue = () => {
    const { data, isError, error, isLoading, isSuccess, refetch } = useGetTelcoRevenueQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [checkedTelcos, setCheckedTelcos] = useState<(string | Telco)[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt, 'amount')
        aid.timeIsUTC = true
        let { labels, dataset } = aid.getDataset(data)

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => i === 0 ? [b] : [...a, b + a[i - 1]], [])
        }

        return { labels, dataset }
    }

    useEffect(() => {
        if (data) {
            const someFn = (d: any) => {
                let groupedData: { [key: string]: (RawAnalytics & { amount: number })[] } = groupBy(d, txStatus === 'ALL' ? 'date' : 'status'),
                    rawData: RawAnalytics[]

                if (txStatus === 'ALL') {
                    rawData = Object.keys(groupedData).map((date) => groupedData[date].reduce((prev, curr) => ({
                        date: Number(date),
                        amount: prev.amount + Number(curr.amount),
                    }), { date: 0, amount: 0 }))
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
                    telco: telco as Telco,
                    hidden: !checkedTelcos.includes(telco),
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
        scales: {
            y: {
                title: {
                    color: '#191',
                    display: true,
                    text: '(KSH)'
                },
                ticks: {
                    callback: (val) => Number(val).toFixed(2)
                }
            }
        },
        plugins: {
            title: {
                text: 'Revenue',
                padding: {
                    bottom: 50
                },
            },
            tooltip: {
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `${item.dataset.label}: KES ${item.formattedValue}`
                }
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
        <Col xxl={6} className={'mb-3'}>
            <LineChart
                data={chartData}
                options={options}
                refetch={refetch}
                txStatus={txStatus} setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt} setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt} setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt} setChartFreqOpt={setChartFreqOpt}
                extraModifiers={Object.keys(data).sort().map((telco, i) => (
                    <Form.Check key={`telco-${i}`} className={`px-2 me-2 ms-3 fw-bold`} id={`telco-rev-${i}`} value={telco}
                                style={{ color: String(getTelcoColor(telco as Telco)) }}
                                type={'checkbox'} label={<b>{telco}</b>} checked={checkedTelcos.includes(telco)}
                                onChange={handleCheckedTelcos}/>
                ))}
            />
        </Col>
    );
};

export default TelcoRevenue;
