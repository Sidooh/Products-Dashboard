import { useEffect, useState } from 'react';
import {
    ChartAid,
    chartGradient,
    Frequency,
    groupBy,
    Period,
    RawAnalytics,
    Skeleton,
    Status,
} from '@nabcellent/sui-react';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { useGetTransactionsQuery } from '@/services/analyticsApi';
import { defaultLineChartOptions } from '@/utils/helpers';
import LineChart from '@/components/charts/LineChart';
import AlertError from '@/components/alerts/AlertError';

const Transactions = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetTransactionsQuery(bypassCache);

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series');
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS);
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY);
    const [labels, setLabels] = useState<string[]>([]);
    const [dataset, setDataset] = useState<number[]>([]);

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt);
        aid.timeIsUTC = true;
        let { labels, dataset } = aid.getDataset(data);

        setLabels(labels);

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => (i === 0 ? [b] : [...a, b + a[i - 1]]), []);
        }
        setDataset(dataset);
    };

    useEffect(() => {
        if (data?.length) {
            let groupedData: { [key: string]: RawAnalytics[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status');

            if (txStatus === 'ALL') {
                drawChart(
                    Object.keys(groupedData).map((date) => {
                        return groupedData[date].reduce(
                            (prev, curr) => ({
                                date,
                                count: Number(prev.count) + Number(curr.count),
                            }),
                            { date: 0, count: 0 }
                        );
                    })
                );
            } else {
                drawChart(groupedData[txStatus] ?? []);
            }
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus]);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[100px]'} />;

    const options: ChartOptions<'line'> = defaultLineChartOptions({
        plugins: {
            title: {
                text: 'Transactions',
            },
            tooltip: {
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `${item.formattedValue} Transactions`,
                },
            },
        },
    });

    const chartData: ChartData<'line'> = {
        labels,
        datasets: [
            {
                data: dataset,
                backgroundColor: chartGradient([15, 27, 76]),
            },
        ],
    };

    return (
        <div>
            <LineChart
                data={chartData}
                options={options}
                refetch={() => {
                    if (!bypassCache) setBypassCache(true);
                    refetch();
                }}
                isFetching={isFetching}
                txStatus={txStatus}
                setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt}
                setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt}
                setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt}
                setChartFreqOpt={setChartFreqOpt}
            />
        </div>
    );
};

export default Transactions;
