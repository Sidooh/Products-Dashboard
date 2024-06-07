import { TransactionsSLOResponse, useGetTransactionsSLOQuery } from '@/services/analyticsApi';
import { Card, CardContent, groupBy, IconButton, Skeleton, Status, Tooltip } from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import { Fragment, useState } from 'react';
import CountUp from 'react-countup';
import { FaPercentage, FaSync } from 'react-icons/fa';
import AlertError from '@/components/alerts/AlertError';
import { RxReload } from 'react-icons/rx';

const TransactionsSLOs = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetTransactionsSLOQuery(bypassCache);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[600px]'} />;

    const groupedSLOs: { [key: string]: TransactionsSLOResponse[] } = groupBy(data, 'year');
    const years = Object.keys(groupedSLOs);

    return (
        <div className={'mb-3'}>
            <h5 className="text-primary text-center relative">
                <span className="bg-200 px-3">
                    Transaction Success Rate
                    <Tooltip title="Refresh SLO" placement="left" asChild>
                        <IconButton
                            className="btn ms-2 mb-1"
                            onClick={() => {
                                if (!bypassCache) setBypassCache(true);
                                refetch();
                            }}
                        >
                            {isFetching ? <RxReload className="animate-spin" /> : <FaSync size={12} />}
                        </IconButton>
                    </Tooltip>
                </span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>

            <Card className={'relative'}>
                <CardBgCorner corner={5} />
                <CardContent className={'bg-[rgb(11,23,39)] text-white pt-6'}>
                    {years.map((year, i) => {
                        const total = groupedSLOs[year].reduce((p, c) => (p += c.count), 0);
                        const data = groupedSLOs[year]
                            .sort((a, b) => b.count - a.count)
                            .filter((s) => [Status.COMPLETED, Status.FAILED, Status.REFUNDED].includes(s.status));

                        return (
                            <Fragment key={`year-${year}`}>
                                <div className={'flex'}>
                                    <h5 className={'border-b pe-lg-5'}>{year}</h5>
                                </div>
                                <div className={`grid grid-cols-12 gap-2 ${i + 1 < years.length && 'mb-5'}`}>
                                    {data.map((d, i) => {
                                        const slo = (d.count / total) * 100;

                                        return (
                                            <div key={`slo-${year + i}`} className={`col-span-4 text-center`}>
                                                <div className="py-3">
                                                    <div
                                                        className={`icon-circle icon-circle-danger text-danger font-bold`}
                                                    >
                                                        <CountUp
                                                            end={slo}
                                                            decimals={Math.round(slo) === slo ? 0 : 1}
                                                            className="me-1 fs-12"
                                                        />
                                                        <FaPercentage size={12} />
                                                    </div>
                                                    <h6 className={`mb-1 font-bold text-danger`}>{d.status}</h6>
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

export default TransactionsSLOs;
