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
import { PaginationState, Subscription } from 'utils/types';
import { logger } from 'utils/logger';
import { useState } from "react";

const Subscriptions = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    })
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useSubscriptionsQuery(pagination);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !res) return <SectionLoader/>;

    logger.log(res);

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
                ]} data={res.data}
                           reFetching={isFetching}
                           serverTotal={res.total}
                           serverPageSize={res.per_page}
                           serverPageCount={res.last_page}
                           currentServerPage={res.current_page}
                           onNextServerPage={() => {
                               setPagination(pagination => ({ ...pagination, page: pagination.page + 1 }))
                           }}
                           onPreviousServerPage={() => {
                               setPagination(pagination => ({ ...pagination, page: pagination.page - 1 }))
                           }}
                           onGoToServerPage={page => {
                               setPagination(pagination => ({ ...pagination, page }))
                           }}
                           onSetServerPageSize={page_size => {
                               setPagination(pagination => ({ ...pagination, page_size }))
                           }}/>
            </Card.Body>
        </Card>
    );
};

export default Subscriptions;
