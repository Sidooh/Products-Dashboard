import { useCashbacksQuery } from '@/services/cashbacksApi';
import {
    Cashback,
    currencyFormat,
    DataTable,
    getRelativeDateAndTime,
    PaginationState,
    Phone,
    Skeleton,
    StatusBadge,
    TableDate,
} from '@nabcellent/sui-react';
import { useState } from 'react';
import AlertError from '@/components/alerts/AlertError';
import { Link } from 'react-router-dom';

const Cashbacks = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    });
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useCashbacksQuery(pagination);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !res) return <Skeleton className={'h-[700px]'} />;

    return (
        <DataTable
            title={'Cashbacks'}
            columns={[
                {
                    accessorKey: 'account',
                    accessorFn: (row: Cashback) => `${row.account?.phone}: ${row.account?.user?.name ?? ''}`,
                    header: 'Account',
                    cell: ({ row: { original } }: any) =>
                        original.type === 'SYSTEM' ? (
                            <b className={'text-primary'}>SYSTEM</b>
                        ) : (
                            <>
                                {original.account?.user?.name} {original.account?.user?.name && <br />}
                                <Link className={'text-xs'} to={`/accounts/${original.account?.id}/details`}>
                                    <Phone phone={original.account?.phone} />
                                </Link>
                            </>
                        ),
                },
                {
                    accessorKey: 'description',
                    accessorFn: (row: Cashback) => row.transaction?.description,
                    header: 'Description',
                },
                {
                    accessorKey: 'type',
                    header: 'Type',
                },
                {
                    accessorKey: 'cashback',
                    header: 'Cashback',
                    cell: ({ row }: any) => currencyFormat(row.original.amount),
                },
                {
                    accessorKey: 'amount',
                    header: 'Amount',
                    cell: ({ row }: any) => currencyFormat(row.original.transaction.amount),
                },
                {
                    accessorKey: 'status',
                    header: 'Status',
                    cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
                },
                {
                    accessorKey: 'updated_at',
                    accessorFn: (row: Cashback) => getRelativeDateAndTime(row.updated_at).toString(),
                    header: 'Created',
                    cell: ({ row }: any) => <TableDate date={row.original.updated_at} />,
                },
            ]}
            data={res.data}
            reFetching={isFetching}
            serverTotal={res.total}
            serverPageSize={res.per_page}
            serverPageCount={res.last_page}
            currentServerPage={res.current_page}
            onNextServerPage={() => {
                setPagination((pagination) => ({ ...pagination, page: pagination.page + 1 }));
            }}
            onPreviousServerPage={() => {
                setPagination((pagination) => ({ ...pagination, page: pagination.page - 1 }));
            }}
            onGoToServerPage={(page) => {
                setPagination((pagination) => ({ ...pagination, page }));
            }}
            onSetServerPageSize={(page_size) => {
                setPagination((pagination) => ({ ...pagination, page_size }));
            }}
        />
    );
};

export default Cashbacks;
