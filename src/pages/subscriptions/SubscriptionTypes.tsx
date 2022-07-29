import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useSubscriptionTypesQuery } from 'features/subscriptions/subscriptionsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { currencyFormat } from '../../utils/helpers';
import pluralize from 'pluralize';

const SubscriptionTypes = () => {
    let {data, isLoading, isSuccess, isError, error} = useSubscriptionTypesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: subTypes} = data;
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
                        accessorFn: row => currencyFormat(row.price)
                    },
                    {
                        accessorKey: 'duration',
                        header: 'Duration',
                        accessorFn: row => `${row.duration} ${pluralize(row.period, row.duration).toUpperCase()}`,
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
