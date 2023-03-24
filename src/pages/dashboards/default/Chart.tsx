import { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { DashboardChartData, useGetDashboardChartDataQuery } from 'features/products/productsAPI';
import CountUp from 'react-countup';
import {
    ChartAid,
    chartSelectOptions,
    ComponentLoader,
    Frequency,
    groupBy,
    Period,
    RawAnalytics,
    SectionError,
    Status,
    Str
} from '@nabcellent/sui-react';
import moment from "moment";
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
    Tooltip as ChartTooltip
} from "chart.js";
import CardBgCorner from "../../../components/CardBgCorner";

Chart.register(Title, ChartTooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
Chart.defaults.color = '#fff'
Chart.defaults.font.weight = '700'
Chart.defaults.font.family = "'Avenir', sans-serif"

const DashboardChart = () => {
    const { data, isError, error, isLoading, isSuccess } = useGetDashboardChartDataQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.HOURLY)
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_24_HOURS)
    const [labels, setLabels] = useState<string[]>([])
    const [dataset, setDataset] = useState<number[]>([])

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt, true)
        let { labels, dataset } = aid.getDataset(data)

        setLabels(labels)

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => i === 0 ? [b] : [...a, b + a[i - 1]], [])
        }
        setDataset(dataset)
    }

    useEffect(() => {
        if (data?.length) {
            let groupedData: { [key: string]: DashboardChartData[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status')

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

    const total_today = data.filter(d => {
        return moment(d.date, 'YYYYMMDDHH').isAfter(moment().startOf('d')) && d.status === txStatus
    }).reduce((prev, curr) => prev += curr.amount, 0)
    const total_yesterday = data.filter(d => {
        const startOfYesterday = moment().subtract(1, 'd').startOf('d')
        const endOfYesterday = moment().subtract(1, 'd').endOf('d')

        return moment(d.date, 'YYYYMMDDHH').isBetween(startOfYesterday, endOfYesterday) && d.status === txStatus
    }).reduce((prev, curr) => prev += curr.amount, 0)

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
            }
        },
    };

    const chartData: ChartData<'line'> = {
        labels,
        datasets: [{
            label: 'Notifications',
            data: dataset,
            borderColor: ['rgba(255, 255, 255, 1)'],
            backgroundColor: '#0F1B4C',
            borderWidth: 2,
            tension: 0.3,
        }],
    };

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
                        <CountUp end={total_today} prefix={'KES '} decimals={2} separator={','} className={'fw-bold'}/>
                    </h6>
                    <h6 className="text-light fs-8 opacity-50 mb-0">
                        Yesterday {' '}
                        <CountUp end={total_yesterday} prefix={'KES '} decimals={2} separator={','}
                                 className={'fw-bold'}/>
                    </h6>
                </div>
                <div className="position-absolute d-flex right-0 me-3">
                    <button className="btn btn-sm btn-outline-light me-2 refresh-chart" type="button"
                            title="Update LineChart">
                        <FontAwesomeIcon icon={faSync}/>
                    </button>
                    <Form.Select className="px-2 me-2" value={chartTypeOpt} size={'sm'} onChange={e => {
                        setChartTypeOpt(e.target.value as 'time-series' | 'cumulative')
                    }}>
                        <option value="time-series">Time Series</option>
                        <option value="cumulative">Cumulative</option>
                    </Form.Select>
                    <Form.Select className="px-2 me-2" size={'sm'} value={chartPeriodOpt}
                                 onChange={e => {
                                     setChartPeriodOpt(e.target.value as Period)
                                     setChartFreqOpt(chartSelectOptions[e.target.value as Period][0])
                                 }}>
                        {Object.values(Period).map(p => <option key={p} value={p}>{Str.headline(p)}</option>)}
                    </Form.Select>
                    <Form.Select className="px-2 me-2" value={chartFreqOpt} size={'sm'} onChange={e => {
                        setChartFreqOpt(e.target.value as Frequency)
                    }} disabled={chartSelectOptions[chartPeriodOpt].length < 2}>
                        {chartSelectOptions[chartPeriodOpt].map(f => (
                            <option key={f} value={f}>{Str.headline(f)}</option>
                        ))}
                    </Form.Select>
                    <Form.Select className="px-2" size="sm" value={txStatus}
                                 onChange={e => setTxStatus(e.target.value as Status)}>
                        <option value="ALL">All</option>
                        {[Status.COMPLETED, Status.FAILED, Status.PENDING, Status.REFUNDED].map((status, i) => (
                            <option key={`status-${i}`} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                </div>

                <Line options={options} data={chartData}/>
            </Card.Body>
        </Card>
    );
};

export default DashboardChart;
