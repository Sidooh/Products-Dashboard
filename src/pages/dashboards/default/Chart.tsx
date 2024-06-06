import { useEffect, useState } from 'react';
import { useGetDashboardChartDataQuery } from '@/services/dashboardApi';
import CountUp from 'react-countup';
import {
    Card,
    CardContent,
    ChartAid,
    Checkbox,
    Frequency,
    groupBy,
    IconButton,
    Period,
    RawAnalytics,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Status,
    Str,
    Telco,
} from '@nabcellent/sui-react';
import { Line } from 'react-chartjs-2';
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
    TooltipItem,
} from 'chart.js';
import CardBgCorner from '@/components/CardBgCorner';
import { AnalyticsChartData } from '@/utils/types';
import { FaSync } from 'react-icons/fa';
import AlertError from '@/components/alerts/AlertError';

type Dataset = { label: string; dataset: number[]; color: string; hidden: boolean };

Chart.register(Title, ChartTooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);
Chart.defaults.color = '#fff';
Chart.defaults.font.weight = 700;
Chart.defaults.font.family = "'Avenir', sans-serif";

const DashboardChart = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } =
        useGetDashboardChartDataQuery(bypassCache);

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series');
    const [labels, setLabels] = useState<string[]>([]);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [totalToday, setTotalToday] = useState(0);
    const [totalYesterday, setTotalYesterday] = useState(0);
    const [checkedPeriods, setCheckedPeriods] = useState<string[]>([]);

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(Period.LAST_24_HOURS, Frequency.HOURLY, 'amount');
        let { labels, dataset } = aid.getDataset(data);

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => (i === 0 ? [b] : [...a, b + a[i - 1]]), []);
        }

        return { labels, dataset };
    };

    useEffect(() => {
        if (data) {
            const aggregate = (data: any) => {
                const property = txStatus === 'ALL' ? 'date' : 'status';
                let groupedData: { [key: string]: AnalyticsChartData[] } = groupBy(data, property);

                let rawAnalytics: RawAnalytics[];
                if (txStatus === 'ALL') {
                    rawAnalytics = Object.keys(groupedData).map((date) => {
                        return groupedData[date].reduce(
                            (prev, curr) => ({
                                date,
                                amount: prev.amount + Number(curr.amount),
                            }),
                            { date: '', amount: 0 }
                        );
                    }) as RawAnalytics[];
                } else {
                    rawAnalytics = groupedData[txStatus] ?? [];
                }

                return drawChart(rawAnalytics);
            };

            let l: string[] = [],
                datasets: Dataset[] = [];
            Object.keys(data).forEach((d, i) => {
                const { labels, dataset } = aggregate(data[d as 'TODAY' | 'YESTERDAY']);

                if (i === 0) l = labels;
                datasets.push({
                    dataset,
                    hidden: !checkedPeriods.includes(d),
                    label: d,
                    color: d === 'TODAY' ? '#fff' : '#911',
                });
            });

            setLabels(l);
            setDatasets(datasets);

            const totalToday = data.TODAY?.filter((d) => [d.status, 'ALL'].includes(txStatus)).reduce(
                (p, c) => (p += Number(c.amount)),
                0
            );
            const totalYesterday = data.YESTERDAY?.filter((d) => [d.status, 'ALL'].includes(txStatus)).reduce(
                (p, c) => (p += Number(c.amount)),
                0
            );

            setTotalToday(totalToday);
            setTotalYesterday(totalYesterday);
        }
    }, [data, chartTypeOpt, txStatus, checkedPeriods]);

    useEffect(() => {
        if (data) setCheckedPeriods(Object.keys(data));
    }, [data]);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[300px]'} />;

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
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
            x: {
                border: {
                    display: false,
                },
                grid: {
                    color: 'rgba(250, 250, 250, .1)',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                align: 'start',
                display: true,
                text: 'TRANSACTIONS',
                font: {
                    size: 17,
                },
                padding: {
                    bottom: 60,
                },
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (item: TooltipItem<'line'>) =>
                        `${Str.headline(String(item.dataset.label))}: KES ${item.formattedValue}`,
                },
            },
        },
    };

    const chartData: ChartData<'line'> = {
        labels,
        datasets: datasets.map((d) => ({
            label: d.label,
            data: d.dataset,
            hidden: d.hidden,
            borderColor: d.color,
            backgroundColor: '#0F1B4C',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            pointStyle: 'star',
        })),
    };

    const handleCheckedPeriods = (checked: boolean | 'indeterminate', value: string) => {
        let updatedList = [...checkedPeriods];

        if (checked) {
            updatedList = [...checkedPeriods, value as Telco];
        } else {
            updatedList.splice(checkedPeriods.indexOf(value), 1);
        }

        setCheckedPeriods(updatedList);
    };

    return (
        <Card className={'relative'}>
            <CardBgCorner />
            <CardContent
                className={'p-3 lg:p-6 relative pt-3 pb-2 rounded-xl'}
                style={{
                    height: 300,
                    backgroundImage: 'linear-gradient(-45deg, rgba(65, 75, 167, .5), #4a2613)',
                }}
            >
                <div className="absolute light border-t border-b py-1" style={{ top: 50 }}>
                    <h6 className="text-white mb-0 text-xs">
                        Today{' '}
                        <CountUp end={totalToday} prefix={'KES '} decimals={2} separator={','} className={'fw-bold'} />
                    </h6>
                    <h6 className="text-white/70 fs-8 opacity-50 mb-0 text-[7pt]">
                        Yesterday{' '}
                        <CountUp
                            end={totalYesterday}
                            prefix={'KES '}
                            decimals={2}
                            separator={','}
                            className={'fw-bold'}
                        />
                    </h6>
                </div>
                <div className="absolute right-0 me-3">
                    <div className="flex">
                        <IconButton
                            className="sm:shadow me-2 w-7 h-7"
                            onClick={() => {
                                if (!bypassCache) setBypassCache(true);

                                refetch();
                            }}
                            isLoading={isFetching}
                            icon={FaSync}
                            iconSize={12}
                        />
                        <Select
                            value={chartTypeOpt}
                            onValueChange={(e) => setChartTypeOpt(e as 'time-series' | 'cumulative')}
                        >
                            <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2 me-2">
                                <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Chart Type</SelectLabel>
                                    <SelectItem value="time-series">Time Series</SelectItem>
                                    <SelectItem value="cumulative">Cumulative</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select value={txStatus} onValueChange={(e) => setTxStatus(e as Status)}>
                            <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="ALL">ALL</SelectItem>
                                    {[Status.COMPLETED, Status.FAILED, Status.PENDING, Status.REFUNDED].map(
                                        (status, i) => (
                                            <SelectItem key={`status-${i}`} value={status}>
                                                {status}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={'flex justify-content-end mt-2'}>
                        {Object.keys(data)
                            .sort()
                            .map((d, i) => (
                                <div key={`period-${i}`} className="flex items-center space-x-2">
                                    <Checkbox
                                        className={`px-2 me-2 ms-3`}
                                        id={`period-rev-${i}`}
                                        value={d}
                                        style={{ color: d === 'TODAY' ? '#fff' : '#911' }}
                                        checked={checkedPeriods.includes(d)}
                                        onCheckedChange={(c) => handleCheckedPeriods(c, d)}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <b>{d}</b>
                                    </label>
                                </div>
                            ))}
                    </div>
                </div>

                <Line options={options} data={chartData} />
            </CardContent>
        </Card>
    );
};

export default DashboardChart;
