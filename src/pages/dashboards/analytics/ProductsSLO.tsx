import { ProductsSLOData, useGetProductsSLOQuery } from '@/services/analyticsApi';
import { Card, CardContent, groupBy, IconButton, Skeleton, Tooltip } from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import { Fragment, useState } from 'react';
import CountUp from 'react-countup';
import { FaPercentage, FaSync } from 'react-icons/fa';
import AlertError from '@/components/alerts/AlertError';

const ProductsSLO = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetProductsSLOQuery(bypassCache);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[100px]'} />;

    const groupedSLOs: { [key: string]: ProductsSLOData[] } = groupBy(data, 'year');
    const years = Object.keys(groupedSLOs);

    return (
        <div className={'mb-3'}>
            <h5 className="text-primary text-center relative">
                <span className="px-3">
                    Products Success Rate
                    <Tooltip title="Refresh SLO" placement="left" asChild>
                        <IconButton
                            icon={FaSync}
                            isLoading={isFetching}
                            className="mb-1"
                            onClick={() => {
                                if (!bypassCache) setBypassCache(true);
                                refetch();
                            }}
                        />
                    </Tooltip>
                </span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>

            <Card className={'relative'}>
                <CardBgCorner corner={5} />
                <CardContent className={'bg-[rgb(11,23,39)] text-white pt-6'}>
                    {years.map((year, i) => {
                        const data = groupedSLOs[year].sort((a, b) => {
                            return b.slo - a.slo || a.product.localeCompare(b.product);
                        });

                        return (
                            <Fragment key={`year-${year}`}>
                                <div className={'flex'}>
                                    <h5 className={'text-white/80 border-b pe-lg-5'}>{year}</h5>
                                </div>
                                <div className={`flex gap-2 ${i + 1 < years.length && 'mb-5'}`}>
                                    {data.map((d, i) => {
                                        let color = 'success';

                                        if (d.slo < 70) color = 'danger';
                                        else if (d.slo < 90) color = 'warning';

                                        return (
                                            <div key={`slo-${year + i}`} className={`w-full text-center`}>
                                                <div className="py-3">
                                                    <div className={`icon-circle icon-circle-${color} fw-bold`}>
                                                        <CountUp
                                                            end={d.slo}
                                                            decimals={Math.round(d.slo) == d.slo ? 0 : 1}
                                                            className="me-1 fs-12"
                                                        />
                                                        <FaPercentage size={12} />
                                                    </div>
                                                    <h6 className={`mb-1 fw-bold text-${color}`}>{d.product}</h6>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Fragment>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductsSLO;
