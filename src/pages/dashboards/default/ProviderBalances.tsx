import { useGetProvidersBalancesQuery } from '@/services/dashboardApi';
import CountUp from 'react-countup';
import { Card, CardContent, CardHeader, IconButton, Skeleton, Tooltip } from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import { useState } from 'react';
import { TbRefresh } from 'react-icons/tb';
import { CacheKey } from '@/utils/enums';
import AlertError from '@/components/alerts/AlertError';

const ProviderBalances = () => {
    const [bypassCache, setBypassCache] = useState('');
    const { data, isError, error, isLoading, isSuccess, isFetching, refetch } =
        useGetProvidersBalancesQuery(bypassCache);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[100px]'} />;

    const handleRefetch = (cacheKey: CacheKey) => {
        if (cacheKey !== bypassCache) setBypassCache(cacheKey);

        refetch();
    };

    return (
        <div className="grid grid-cols-12 gap-3 h-full">
            <div className={'col-span-4 2xl:mb-2'}>
                <Card className={'relative bg-[linear-gradient(-45deg,#414ba7,#4a2613)] bg-center'}>
                    <CardBgCorner />
                    <CardHeader className="md:mb-0 lg:mb-2 text-muted-foreground !pb-0 text-sm">
                        Tanda Float Balance
                    </CardHeader>
                    <Tooltip title={'Refresh'} asChild>
                        <IconButton
                            variant={'ghost'}
                            className={'absolute top-0 end-0 m-2 w-7 h-7'}
                            onClick={() => handleRefetch(CacheKey.TANDA_FLOAT_BALANCE)}
                            icon={TbRefresh}
                            isLoading={isFetching && bypassCache === CacheKey.TANDA_FLOAT_BALANCE}
                        />
                    </Tooltip>
                    <CardContent className={'relative'}>
                        <h4 className="m-0 text-white">
                            <CountUp end={data.tanda_float_balance} separator="," prefix={'KES '} decimals={2} />
                        </h4>
                    </CardContent>
                </Card>
            </div>
            <div className={'col-span-4 2xl:mb-2'}>
                <Card className={'relative bg-[rgba(20,20,20,.8)]'}>
                    <CardBgCorner corner={2} />
                    <CardHeader className="md:mb-0 lg:mb-2 text-muted-foreground !pb-0 text-sm">
                        Kyanda Float Balance
                    </CardHeader>
                    <Tooltip title={'Refresh'} asChild>
                        <IconButton
                            disabled
                            variant={'ghost'}
                            className={'absolute top-0 end-0 m-2 w-7 h-7'}
                            onClick={() => handleRefetch(CacheKey.KYANDA_FLOAT_BALANCE)}
                            icon={TbRefresh}
                            isLoading={isFetching && bypassCache === CacheKey.KYANDA_FLOAT_BALANCE}
                        />
                    </Tooltip>
                    <CardContent className={'relative'}>
                        <h4 className="m-0 fs-1 fw-bold text-white">
                            <CountUp end={data.kyanda_float_balance} separator="," prefix={'KES '} decimals={2} />
                        </h4>
                    </CardContent>
                </Card>
            </div>
            <div className={'col-span-4 2xl:mb-2'}>
                <Card className={'relative bg-[rgba(20,20,20,.8)]'}>
                    <CardBgCorner corner={3} />
                    <CardHeader className="md:mb-0 lg:mb-2 text-muted-foreground !pb-0 text-sm">
                        AT Airtime Balance
                    </CardHeader>
                    <Tooltip title={'Refresh'} asChild>
                        <IconButton
                            disabled
                            variant={'ghost'}
                            className={'absolute top-0 end-0 m-2 w-7 h-7'}
                            onClick={() => handleRefetch(CacheKey.AT_AIRTIME_BALANCE)}
                            icon={TbRefresh}
                            isLoading={isFetching && bypassCache === CacheKey.AT_AIRTIME_BALANCE}
                        />
                    </Tooltip>
                    <CardContent className={'relative'}>
                        <h4 className="m-0 fs-1 fw-bold text-white">
                            <CountUp end={data.at_airtime_balance} separator="," prefix={'KES '} decimals={2} />
                        </h4>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProviderBalances;
