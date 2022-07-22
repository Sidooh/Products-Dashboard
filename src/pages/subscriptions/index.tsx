import { Card } from 'react-bootstrap';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useSubscriptionsQuery } from 'features/subscriptions/subscriptionsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { currencyFormat } from 'utils/helpers';
import moment from 'moment';
import PhoneChip from 'components/chips/PhoneChip';

const Subscriptions = () => {
    let {data, isLoading, isSuccess, isError, error} = useSubscriptionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: subscriptions} = data;
    console.log(subscriptions);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Subscriptions'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: row => row.account.phone,
                        header: 'Customer',
                        cell: ({row}: any) => <PhoneChip phone={row.original.account.phone}/>
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        accessorFn: row => currencyFormat(row.amount)
                    },
                    {
                        accessorKey: 'start_date',
                        header: 'Start Date',
                        accessorFn: row => moment(row.start_date).calendar(),
                    },
                    {
                        accessorKey: 'end_date',
                        header: 'End Date',
                        accessorFn: row => moment(row.end_date).calendar(),
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Date Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'subscription'}/>
                    }
                ]} data={subscriptions}/>
            </Card.Body>
        </Card>
    );
};

export default Subscriptions;
