import { useGetDashboardSummariesQuery } from '@/services/dashboardApi';
import CountUp from 'react-countup';
import { Badge, Card, CardContent, CardHeader, IconButton, Skeleton, Tooltip } from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import { CacheKey } from '@/utils/enums';
import { useState } from 'react';
import { TbRefresh } from 'react-icons/tb';
import AlertError from '@/components/alerts/AlertError';

const TransactionSummaries = () => {
    const [bypassCache, setBypassCache] = useState('');
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } =
        useGetDashboardSummariesQuery(bypassCache);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[120px] 2xl:h-full'} />;

    const handleRefetch = (cacheKey: CacheKey) => {
        if (cacheKey !== bypassCache) setBypassCache(cacheKey);

        refetch();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-1 gap-3 h-full">
            <Card className={'relative'}>
                <CardBgCorner corner={2} />
                <CardHeader className={'!pb-0 2xl:mb-3'}>
                    <span className={'text-sm text-muted-foreground'}>Transactions</span>
                    <div className="absolute flex items-center top-3 right-6 gap-2">
                        <Tooltip title={'Refresh'} asChild>
                            <IconButton
                                variant={'outline'}
                                className={'w-6 h-6'}
                                isLoading={isFetching && bypassCache === CacheKey.TOTAL_TRANSACTIONS_COUNT}
                                onClick={() => handleRefetch(CacheKey.TOTAL_TRANSACTIONS_COUNT)}
                                icon={TbRefresh}
                            />
                        </Tooltip>
                        <Badge className={'rounded-full'}>
                            <CountUp end={data.total_transactions_today} separator="," />
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className={'relative flex flex-col justify-content-center'}>
                    <h5 className="text-xl font-semibold">
                        <CountUp end={data.total_transactions} separator="," />
                    </h5>
                </CardContent>
            </Card>

            <Card className={'relative'}>
                <CardBgCorner />
                <CardHeader className={'!pb-0 2xl:mb-3'}>
                    <span className={'text-sm text-muted-foreground'}>Revenue</span>
                    <div className="absolute flex items-center top-3 right-6 gap-2">
                        <IconButton
                            variant={'outline'}
                            className={'w-6 h-6'}
                            isLoading={isFetching && bypassCache === CacheKey.TOTAL_REVENUE}
                            onClick={() => handleRefetch(CacheKey.TOTAL_REVENUE)}
                            icon={TbRefresh}
                        />
                        <Badge className={'bg-green-500 rounded-full'}>
                            <CountUp end={data.total_revenue_today} prefix={'KES '} separator="," />
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className={'relative flex flex-col justify-content-center'}>
                    <h5 className="text-xl font-semibold">
                        <CountUp prefix={'KES '} end={data.total_revenue} separator="," />
                    </h5>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionSummaries;
