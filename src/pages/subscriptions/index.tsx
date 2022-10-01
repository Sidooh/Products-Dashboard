import { Card } from 'react-bootstrap';
import { useSubscriptionsQuery } from 'features/subscriptions/subscriptionsAPI';
import SidoohAccount from 'components/common/SidoohAccount';
import { DataTable, SectionError, SectionLoader, StatusChip, TableDate } from '@nabcellent/sui-react';
import { Subscription } from 'utils/types';
import { logger } from 'utils/logger';

const Subscriptions = () => {
    let {data: subscriptions, isLoading, isSuccess, isError, error} = useSubscriptionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !subscriptions) return <SectionLoader/>;

    logger.log(subscriptions);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Subscriptions'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: Subscription) => `${row.account?.phone}: ${row.account?.user?.name}`,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                        accessorFn: (row: Subscription) => row.subscription_type.title
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({row}: any) => <StatusChip status={row.original.status}/>
                    },
                    {
                        accessorKey: 'start_date',
                        header: 'Start Date',
                        cell: ({row}: any) => <TableDate date={row.original.start_date}/>,
                    },
                    {
                        accessorKey: 'end_date',
                        header: 'End Date',
                        cell: ({row}: any) => <TableDate date={row.original.end_date}/>,
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    }
                ]} data={subscriptions}/>
            </Card.Body>
        </Card>
    );
};

export default Subscriptions;
