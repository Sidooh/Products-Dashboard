import { useGetVendorsSLOQuery } from '@/services/analyticsApi';
import { Card, CardContent, IconButton, Skeleton, Str, Tooltip } from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import CountUp from 'react-countup';
import { FaPercentage, FaSync } from 'react-icons/fa';
import { useState } from 'react';
import AlertError from '@/components/alerts/AlertError';
import { RxReload } from 'react-icons/rx';

const VendorsSLO = () => {
    const [bypassCache, setBypassCache] = useState(false);
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetVendorsSLOQuery(bypassCache);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[100px]'} />;

    return (
        <div className={'mb-3'}>
            <h5 className="text-primary text-center relative">
                <span className="bg-200 px-3">
                    Vendors Success Rate
                    <Tooltip title="Refresh SLOs" placement="left" asChild>
                        <IconButton
                            color={'secondary'}
                            className="btn ms-2 mb-1"
                            onClick={() => {
                                if (!bypassCache) setBypassCache(true);
                                refetch();
                            }}
                        >
                            {isFetching ? <RxReload className="animate-spin" /> : <FaSync />}
                        </IconButton>
                    </Tooltip>
                </span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>

            <Card className={'relative'}>
                <CardBgCorner corner={5} />
                <CardContent className={'bg-[rgb(11,23,39)] text-white pt-6'}>
                    <div className={'flex'}>
                        <h5 className={'text-white/80 border-b pe-lg-5'}>YTD</h5>
                    </div>
                    <div className={'flex gap-2'}>
                        {Object.keys(data).map((product) => {
                            let color = 'success',
                                slo = Number(data[product as keyof typeof data]);

                            if (slo < 70) color = 'danger';
                            else if (slo < 90) color = 'warning';

                            return (
                                <div key={product} className={`text-center w-full`}>
                                    <div className="bg-dark py-3">
                                        <div className={`icon-circle icon-circle-${color} fw-bold`}>
                                            <CountUp
                                                end={slo}
                                                decimals={Math.round(slo) === slo ? 0 : 1}
                                                className="me-1 fs-12"
                                            />
                                            <FaPercentage size={12} />
                                        </div>
                                        <h6 className={`mb-1 fw-bold text-${color}`}>{Str.headline(product)}</h6>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorsSLO;
