import TableActions from '@/components/TableActions';
import { useEarningAccountsQuery } from '@/services/earningAccountsApi';
import { EarningAccount } from '@/utils/types';
import {
    currencyFormat,
    DataTable,
    groupBy,
    PaginationState,
    Skeleton,
    TableDate,
    SidoohAccount,
} from '@nabcellent/sui-react';
import { useState } from 'react';
import AlertError from '@/components/alerts/AlertError';

const Index = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    });
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useEarningAccountsQuery(pagination);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !res) return <Skeleton className={'h-[700px]'} />;

    return (
        <DataTable
            title={'Earning Accounts'}
            columns={[
                {
                    accessorKey: 'account',
                    accessorFn: (r: EarningAccount[]) => `${r[0].account?.phone}: ${r[0].account?.user?.name}`,
                    header: 'Account',
                    cell: ({ row }: any) => <SidoohAccount account={row.original[0].account} />,
                },
                {
                    accessorKey: 'earnings',
                    header: 'Total Earnings(self + invite)',
                    accessorFn: (r: EarningAccount[]) => {
                        const sum = r.reduce((p, c) => {
                            if (c.type === 'WITHDRAWALS') return (p += 0);

                            return (p += Number(c.invite_amount) + Number(c.self_amount));
                        }, 0);

                        return currencyFormat(sum);
                    },
                },
                {
                    accessorKey: 'withdrawals',
                    header: 'Total Withdrawals',
                    accessorFn: (r: EarningAccount[]) => {
                        const sum = r.reduce((p, c) => {
                            if (c.type !== 'WITHDRAWALS') return (p += 0);

                            return (p += Number(c.invite_amount) + Number(c.self_amount));
                        }, 0);

                        return currencyFormat(sum);
                    },
                },
                {
                    accessorKey: 'updated_at',
                    header: 'Last Update',
                    cell: ({ row }: any) => <TableDate date={row.original[0].updated_at} />,
                },
                {
                    id: 'actions',
                    header: '',
                    cell: ({ row }: any) => (
                        <TableActions entityId={row.original[0].account_id} entity={'earning-accounts'} />
                    ),
                },
            ]}
            data={groupBy(res.data, 'account_id', true)}
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

export default Index;
