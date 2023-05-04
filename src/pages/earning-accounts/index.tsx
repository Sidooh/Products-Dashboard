import { Card } from 'react-bootstrap';
import TableActions from 'components/TableActions';
import { useEarningAccountsQuery } from 'features/apis/earningAccountsApi';
import SidoohAccount from 'components/SidoohAccount';
import { EarningAccount, PaginationState } from 'utils/types';
import { currencyFormat, DataTable, groupBy, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';
import { useState } from "react";

const Index = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    })
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useEarningAccountsQuery(pagination);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !res) return <SectionLoader/>;

    logger.log(res);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Earning Accounts'} columns={[
                    {
                        accessorKey: 'account',
                        accessorFn: (r: EarningAccount[]) => `${r[0].account?.phone}: ${r[0].account?.user?.name}`,
                        header: 'Account',
                        cell: ({ row }: any) => <SidoohAccount account={row.original[0].account}/>
                    },
                    {
                        accessorKey: 'earnings',
                        header: 'Total Earnings(self + invite)',
                        accessorFn: (r: EarningAccount[]) => {
                            const sum = r.reduce((p, c) => {
                                if (c.type === 'WITHDRAWALS') return p += 0

                                return p += Number(c.invite_amount) + Number(c.self_amount)
                            }, 0)

                            return currencyFormat(sum)
                        }
                    },
                    {
                        accessorKey: 'withdrawals',
                        header: 'Total Withdrawals',
                        accessorFn: (r: EarningAccount[]) => {
                            const sum = r.reduce((p, c) => {
                                if (c.type !== 'WITHDRAWALS') return p += 0

                                return p += Number(c.invite_amount) + Number(c.self_amount)
                            }, 0)

                            return currencyFormat(sum)
                        }
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({ row }: any) => <TableDate date={row.original[0].updated_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({ row }: any) => <TableActions entityId={row.original[0].account_id}
                                                              entity={'earning-accounts'}/>
                    }
                ]} data={groupBy(res.data, 'account_id', true)}
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

export default Index;
