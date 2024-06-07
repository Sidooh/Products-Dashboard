import { useEffect, useState } from 'react';
import {
    ChartAid,
    chartGradient,
    Checkbox,
    Frequency,
    groupBy,
    Period,
    RawAnalytics,
    Skeleton,
    Status,
} from '@nabcellent/sui-react';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { useGetProductRevenueQuery } from '@/services/analyticsApi';
import { defaultLineChartOptions, getProductColor } from '@/utils/helpers';
import LineChart from '@/components/charts/LineChart';
import { Product } from '@/utils/enums';
import AlertError from '@/components/alerts/AlertError';

type Dataset = { product: string; dataset: number[]; color: string | number[]; hidden: boolean };

const ProductRevenue = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetProductRevenueQuery(bypassCache);

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series');
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS);
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY);
    const [labels, setLabels] = useState<string[]>([]);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [checkedProducts, setCheckedProducts] = useState<(string | Product)[]>([]);

    const drawChart = (data: RawAnalytics[]) => {
        const aid = new ChartAid(chartPeriodOpt, chartFreqOpt, 'amount');
        aid.timeIsUTC = true;
        let { labels, dataset } = aid.getDataset(data);

        if (chartTypeOpt === 'cumulative') {
            dataset = dataset.reduce((a: number[], b, i) => (i === 0 ? [b] : [...a, b + a[i - 1]]), []);
        }

        return { labels, dataset };
    };

    useEffect(() => {
        if (data) {
            const someFn = (data: any) => {
                let groupedData: { [key: string]: RawAnalytics[] } = groupBy(
                        data,
                        txStatus === 'ALL' ? 'date' : 'status'
                    ),
                    rawData: RawAnalytics[];

                if (txStatus === 'ALL') {
                    rawData = Object.keys(groupedData).map((date) =>
                        groupedData[date].reduce(
                            (prev, curr) => ({
                                date: Number(date),
                                amount: Number(prev.amount) + Number(curr.amount),
                            }),
                            { date: 0, amount: 0 }
                        )
                    );
                } else {
                    rawData = groupedData[txStatus] ?? [];
                }

                return drawChart(rawData);
            };

            let l: string[] = [],
                datasets: Dataset[] = [];
            Object.keys(data).forEach((product, i) => {
                const { labels, dataset } = someFn(data[product as unknown as Product]);

                if (i === 0) l = labels;
                datasets.push({
                    dataset,
                    hidden: !checkedProducts.includes(product),
                    product: product,
                    color: getProductColor(product as Product, true) as number[],
                });
            });

            setLabels(l);
            setDatasets(datasets);
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus, checkedProducts]);

    useEffect(() => {
        if (data) setCheckedProducts(Object.keys(data));
    }, [data]);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[300px]'} />;

    const options: ChartOptions<'line'> = defaultLineChartOptions({
        scales: {
            y: {
                title: {
                    color: '#191',
                    display: true,
                    text: '(KSH)',
                },
            },
        },
        plugins: {
            title: {
                text: 'Revenue',
                padding: {
                    bottom: 50,
                },
            },
            tooltip: {
                callbacks: {
                    label: (item: TooltipItem<'line'>) => `${item.dataset.label}: KES ${item.formattedValue}`,
                },
            },
        },
    });

    const chartData: ChartData<'line'> = {
        labels,
        datasets: datasets.map((d) => ({
            label: d.product,
            data: d.dataset,
            hidden: d.hidden,
            backgroundColor: chartGradient(d.color as number[]),
        })),
    };

    const handleCheckedProducts = (checked: boolean | 'indeterminate', value: string) => {
        let updatedList = [...checkedProducts];

        if (checked) {
            updatedList = [...checkedProducts, value];
        } else {
            updatedList.splice(checkedProducts.indexOf(value), 1);
        }

        setCheckedProducts(updatedList);
    };

    return (
        <div className={'mb-3'}>
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
                extraModifiers={Object.keys(data)
                    .sort()
                    .map((product, i) => (
                        <div key={`product-${i}`} className="flex items-center space-x-2">
                            <Checkbox
                                className={`px-2 me-2 ms-3`}
                                id={`product-tx-${i}`}
                                value={product}
                                style={{ color: String(getProductColor(product as Product)) }}
                                checked={checkedProducts.includes(product)}
                                onCheckedChange={(c) => handleCheckedProducts(c, product)}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                <b>{product}</b>
                            </label>
                        </div>
                    ))}
            />
        </div>
    );
};

export default ProductRevenue;
