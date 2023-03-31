import { ChangeEvent, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import {
    ChartAid,
    chartGradient,
    ComponentLoader,
    Frequency,
    groupBy,
    Period,
    RawAnalytics,
    SectionError,
    Status,
} from '@nabcellent/sui-react';
import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { useGetProductRevenueQuery } from 'features/analytics/analyticsApi';
import { defaultLineChartOptions, getProductColor } from "utils/helpers";
import LineChart from "../../../components/charts/LineChart";
import { Product } from "../../../utils/enums";

type Dataset = { product: string, dataset: number[], color: string | number[], hidden: boolean }

const ProductRevenue = () => {
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetProductRevenueQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [checkedProducts, setCheckedProducts] = useState<(string | Product)[]>([])

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
            const someFn = (data: any) => {
                let groupedData: { [key: string]: RawAnalytics[] } = groupBy(data, txStatus === 'ALL' ? 'date' : 'status'),
                    rawData: RawAnalytics[]

                if (txStatus === 'ALL') {
                    rawData = Object.keys(groupedData).map((date) => groupedData[date].reduce((prev, curr) => ({
                        date: Number(date),
                        amount: Number(prev.amount) + Number(curr.amount),
                    }), { date: 0, amount: 0 }))
                } else {
                    rawData = groupedData[txStatus] ?? []
                }

                return drawChart(rawData)
            }

            let l: string[] = [], datasets: Dataset[] = []
            Object.keys(data).forEach((product, i) => {
                const { labels, dataset } = someFn(data[product as unknown as Product])

                if (i === 0) l = labels
                datasets.push({
                    dataset,
                    hidden: !checkedProducts.includes(product),
                    product: product,
                    color: getProductColor(product as Product, true) as number[]
                })
            })

            setLabels(l)
            setDatasets(datasets)
        }
    }, [data, chartPeriodOpt, chartFreqOpt, chartTypeOpt, txStatus, checkedProducts])

    useEffect(() => {
        if (data) setCheckedProducts(Object.keys(data))
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
            label: d.product,
            data: d.dataset,
            hidden: d.hidden,
            backgroundColor: chartGradient(d.color as number[]),
        })),
    };

    const handleCheckedTelcos = (e: ChangeEvent<HTMLInputElement>) => {
        let updatedList = [...checkedProducts];

        if (e.target.checked) {
            updatedList = [...checkedProducts, e.target.value];
        } else {
            updatedList.splice(checkedProducts.indexOf(e.target.value), 1);
        }

        setCheckedProducts(updatedList);
    }

    return (
        <Col xxl={12} className={'mb-3'}>
            <LineChart
                data={chartData}
                options={options}
                refetch={refetch}
                isFetching={isFetching}
                txStatus={txStatus} setTxStatus={setTxStatus}
                chartTypeOpt={chartTypeOpt} setChartTypeOpt={setChartTypeOpt}
                chartPeriodOpt={chartPeriodOpt} setChartPeriodOpt={setChartPeriodOpt}
                chartFreqOpt={chartFreqOpt} setChartFreqOpt={setChartFreqOpt}
                extraModifiers={Object.keys(data).sort().map((product, i) => (
                    <Form.Check key={`product-${i}`} className={`px-2 me-2 ms-3`} id={`product-tx-${i}`} value={product}
                                style={{ color: String(getProductColor(product as Product)) }}
                                type={'checkbox'} label={<b>{product}</b>} checked={checkedProducts.includes(product)}
                                onChange={handleCheckedTelcos}/>
                ))}
            />
        </Col>
    );
};

export default ProductRevenue;
