import { useSubscriptionTypesQuery } from '@/services/subscriptionTypesApi';
import { currencyFormat, DataTable, Skeleton, Str, SubscriptionType } from '@nabcellent/sui-react';
import AlertError from '@/components/alerts/AlertError';

const SubscriptionTypes = () => {
    let { data: subTypes, isLoading, isSuccess, isError, error } = useSubscriptionTypesQuery();

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !subTypes) return <Skeleton className={'h-[300px]'} />;

    return (
        <DataTable
            title={'Subscription Types'}
            columns={[
                {
                    accessorKey: 'title',
                    header: 'Title',
                },
                {
                    accessorKey: 'price',
                    header: 'Price',
                    accessorFn: (row: SubscriptionType) => currencyFormat(row.price),
                },
                {
                    accessorKey: 'duration',
                    header: 'Duration',
                    accessorFn: (row: SubscriptionType) =>
                        `${row.duration} ${Str.toPlural(row.period, row.duration).toUpperCase()}`,
                },
                {
                    accessorKey: 'level_limit',
                    header: 'Level Limit',
                },
            ]}
            data={subTypes}
        />
    );
};

export default SubscriptionTypes;
