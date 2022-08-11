import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useSubscriptionTypesQuery } from 'features/subscriptions/subscriptionsAPI';
import { DataTable, SectionError, SectionLoader, currencyFormat } from '@nabcellent/sui-react';
import { SubscriptionType } from '../../utils/types';
import pluralize from 'pluralize';

const SubscriptionTypes = () => {
    let {data: subTypes, isLoading, isSuccess, isError, error} = useSubscriptionTypesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !subTypes) return <SectionLoader/>;

    console.log(subTypes);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Subscription Types'} columns={[
                    {
                        accessorKey: 'title',
                        header: 'Title',
                    },
                    {
                        accessorKey: 'price',
                        header: 'Price',
                        accessorFn: (row:SubscriptionType) => currencyFormat(row.price)
                    },
                    {
                        accessorKey: 'duration',
                        header: 'Duration',
                        accessorFn: (row:SubscriptionType) => `${row.duration} ${pluralize(row.period, row.duration).toUpperCase()}`,
                    },
                    {
                        accessorKey: 'level_limit',
                        header: 'Level Limit',
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'subscription-type'}/>
                    }
                ]} data={subTypes}/>
            </Card.Body>
        </Card>
    );
};

export default SubscriptionTypes;
