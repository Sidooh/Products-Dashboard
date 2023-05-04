import { Card } from 'react-bootstrap';
import { useSubscriptionsQuery } from 'features/apis/subscriptionsAPI';
import SidoohAccount from 'components/SidoohAccount';
import {
    DataTable,
    getRelativeDateAndTime,
    SectionError,
    SectionLoader,
    StatusChip,
    TableDate
} from '@nabcellent/sui-react';
import { Subscription } from 'utils/types';
import { logger } from 'utils/logger';

const Subscriptions = () => {
    let { data: subscriptions, isLoading, isSuccess, isError, error } = useSubscriptionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !subscriptions) return <SectionLoader/>;

    logger.log(subscriptions);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Subscriptions'} columns={[
                    {
                        accessorKey: 'account',
                        accessorFn: (row: Subscription) => `${row.account?.phone}: ${row.account?.user?.name ?? ''}`,
                        header: 'Account',
                        cell: ({ row }: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                        accessorFn: (row: Subscription) => row.subscription_type.title
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({ row }: any) => <StatusChip status={row.original.status}/>
                    },
                    {
                        accessorKey: 'start_date',
                        accessorFn: (row: Subscription) => getRelativeDateAndTime(row.start_date).toString(),
                        header: 'Start Date',
                        cell: ({ row }: any) => <TableDate date={row.original.start_date} dateOverTime/>,
                    },
                    {
                        accessorKey: 'end_date',
                        accessorFn: (row: Subscription) => getRelativeDateAndTime(row.end_date).toString(),
                        header: 'End Date',
                        cell: ({ row }: any) => <TableDate date={row.original.end_date} dateOverTime/>,
                    },
                    {
                        accessorKey: 'created_at',
                        accessorFn: (row: Subscription) => getRelativeDateAndTime(row.created_at).toString(),
                        header: 'Created',
                        cell: ({ row }: any) => <TableDate date={row.original.created_at} dateOverTime/>
                    }
                ]} data={subscriptions}/>
            </Card.Body>
        </Card>
    );
};

export default Subscriptions;
