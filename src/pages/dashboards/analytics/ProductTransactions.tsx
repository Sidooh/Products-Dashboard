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
import { ChartData, ChartOptions } from "chart.js";
import { useGetProductTransactionsQuery } from 'features/analytics/analyticsApi';
import { defaultLineChartOptions, getProductColor } from "utils/helpers";
import LineChart from "../../../components/LineChart";
import { Product } from "../../../utils/enums";

type Dataset = { product: string, dataset: number[], color: string | number[], hidden: boolean }

const ProductTransactions = () => {
    const { data, isError, error, isLoading, isSuccess, refetch } = useGetProductTransactionsQuery();

    const [txStatus, setTxStatus] = useState<Status | 'ALL'>(Status.COMPLETED);
    const [chartTypeOpt, setChartTypeOpt] = useState<'time-series' | 'cumulative'>('time-series')
    const [chartPeriodOpt, setChartPeriodOpt] = useState(Period.LAST_SIX_MONTHS)
    const [chartFreqOpt, setChartFreqOpt] = useState(Frequency.MONTHLY)
    const [labels, setLabels] = useState<string[]>([])
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [checkedProducts, setCheckedProducts] = useState<(string | Product)[]>([])

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
        <Col xxl={12}>
            <LineChart
                data={chartData}
                options={options}
                refetch={refetch}
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

export default ProductTransactions;
