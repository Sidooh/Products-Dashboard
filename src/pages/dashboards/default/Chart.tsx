import { ChangeEvent, useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useGetDashboardChartDataQuery } from 'features/products/productsAPI';
import CountUp from 'react-countup';
import {
    ChartAid,
    ComponentLoader,
    Frequency,
    groupBy,
    LoadingButton,
    Period,
    RawAnalytics,
    SectionError,
    Status,
    Str,
    Telco
} from '@nabcellent/sui-react';
import { Line } from "react-chartjs-2";
import {
    CategoryScale,
    Chart,
    ChartData,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip,
    TooltipItem
} from "chart.js";
import CardBgCorner from "../../../components/CardBgCorner";
import { AnalyticsChartData } from "../../../utils/types";

type Dataset = { label: string, dataset: number[], color: string, hidden: boolean }

Chart.register(Title, ChartTooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
Chart.defaults.color = '#fff'
Chart.defaults.font.weight = '700'
Chart.defaults.font.family = "'Avenir', sans-serif"

const DashboardChart = () => {
    const { data, isError, error, isLoading, isSuccess, refetch } = useGetDashboardChartDataQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [labels, setLabels] = useState<string[]>([])
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [totalToday, setTotalToday] = useState(0)
    const [totalYesterday, setTotalYesterday] = useState(0)
    const [checkedPeriods, setCheckedPeriods] = useState<(string)[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(Period.LAST_24_HOURS, Frequency.HOURLY, 'amount')
        let { labels, dataset } = aid.getDataset(data)

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => i === 0 ? [b] : [...a, b + a[i - 1]], [])
        }

        return { labels, dataset }
    }

    useEffect(() => {
        if (data) {
            const aggregate = (data: any) => {
                const property = txStatus === 'ALL' ? 'date' : 'status'
                let groupedData: { [key: string]: AnalyticsChartData[] } = groupBy(data, property)

                let rawAnalytics: RawAnalytics[];
                if (txStatus === 'ALL') {
                    rawAnalytics = Object.keys(groupedData).map(date => {
                        return groupedData[date].reduce((prev, curr) => ({
                            date,
                            amount: prev.amount + Number(curr.amount),
                        }), { date: '', amount: 0 })
                    }) as RawAnalytics[]
                } else {
                    rawAnalytics = groupedData[txStatus] ?? []
                }

                return drawChart(rawAnalytics)
            }

            let l: string[] = [], datasets: Dataset[] = []
            Object.keys(data).forEach((d, i) => {
                const { labels, dataset } = aggregate(data[d as 'TODAY' | 'YESTERDAY'])

                if (i === 0) l = labels
                datasets.push({
                    dataset,
                    hidden: !checkedPeriods.includes(d),
                    label: d,
                    color: d === 'TODAY' ? '#fff' : '#911'
                })
            })

            setLabels(l)
            setDatasets(datasets)

            const totalToday = data.TODAY?.filter(d => [d.status, 'ALL'].includes(txStatus)).reduce((p, c) => p += Number(c.amount), 0)
            const totalYesterday = data.YESTERDAY?.filter(d => [d.status, 'ALL'].includes(txStatus)).reduce((p, c) => p += Number(c.amount), 0)

            setTotalToday(totalToday)
            setTotalYesterday(totalYesterday)
        }
    }, [data, chartTypeOpt, txStatus, checkedPeriods])

    useEffect(() => {
        if (data) setCheckedPeriods(Object.keys(data))
    }, [data])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                }
            },
            x: {
                border: {
                    display: false
                },
                grid: {
                    color: 'rgba(250, 250, 250, .1)',
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                align: 'start',
                display: true,
                text: 'TRANSACTIONS',
                font: {
                    size: 17
                },
                padding: {
                    bottom: 60
                }
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `${Str.headline(String(item.dataset.label))}: KES ${item.formattedValue}`
                }
            }
        },
    };

    const chartData: ChartData<'line'> = {
        labels,
        datasets: datasets.map(d => ({
            label: d.label,
            data: d.dataset,
            hidden: d.hidden,
            borderColor: d.color,
            backgroundColor: '#0F1B4C',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            pointStyle: 'star'
        })),
    };

    const handleCheckedPeriods = (e: ChangeEvent<HTMLInputElement>) => {
        let updatedList = [...checkedPeriods];

        if (e.target.checked) {
            updatedList = [...checkedPeriods, e.target.value as Telco];
        } else {
            updatedList.splice(checkedPeriods.indexOf(e.target.value), 1);
        }

        setCheckedPeriods(updatedList);
    }

    return (
        <Card className="rounded-3 overflow-hidden h-100 shadow-none">
            <CardBgCorner/>
            <Card.Body className={'position-relative pb-2'} style={{
                height: 300,
                backgroundImage: 'linear-gradient(-45deg, rgba(65, 75, 167, .5), #4a2613)'
            }}>
                <div className="position-absolute light border-top border-bottom" style={{ top: 50 }}>
                    <h6 className="text-white mb-0">
                        Today {' '}
                        <CountUp end={totalToday} prefix={'KES '} decimals={2} separator={','} className={'fw-bold'}/>
                    </h6>
                    <h6 className="text-light fs-8 opacity-50 mb-0">
                        Yesterday {' '}
                        <CountUp end={totalYesterday} prefix={'KES '} decimals={2} separator={','}
                                 className={'fw-bold'}/>
                    </h6>
                </div>
                <div className="position-absolute right-0 me-3">
                    <div className="d-flex">
                        <LoadingButton className="btn btn-sm btn-light me-2 refresh-chart" type="button"
                                       title="Update LineChart" onClick={() => refetch()}>
                            <FontAwesomeIcon icon={faSync}/>
                        </LoadingButton>
                        <Form.Select className="px-2 me-2" value={chartTypeOpt} size={'sm'} onChange={e => {
                            setChartTypeOpt(e.target.value as 'time-series' | 'cumulative')
                        }}>
                            <option value="time-series">Time Series</option>
                            <option value="cumulative">Cumulative</option>
                        </Form.Select>
                        <Form.Select className="px-2" size="sm" value={txStatus}
                                     onChange={e => setTxStatus(e.target.value as Status)}>
                            <option value="ALL">All</option>
                            {[Status.COMPLETED, Status.FAILED, Status.PENDING, Status.REFUNDED].map((status, i) => (
                                <option key={`status-${i}`} value={status}>{status}</option>
                            ))}
                        </Form.Select>
                    </div>

                    <div className={'d-flex justify-content-end mt-2'}>
                        {Object.keys(data).sort().map((d, i) => (
                            <Form.Check key={`period-${i}`} className={`px-2 me-2 ms-3 fw-bold`} id={`period-rev-${i}`}
                                        value={d} type={'checkbox'} label={<b>{d}</b>}
                                        checked={checkedPeriods.includes(d)}
                                        style={{ color: d === 'TODAY' ? '#fff' : '#911' }}
                                        onChange={handleCheckedPeriods}/>
                        ))}
                    </div>
                </div>

                <Line options={options} data={chartData}/>
            </Card.Body>
        </Card>
    );
};

export default DashboardChart;
