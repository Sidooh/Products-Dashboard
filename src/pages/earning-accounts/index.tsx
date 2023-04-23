import { Card } from 'react-bootstrap';
import TableActions from 'components/TableActions';
import { useEarningAccountsQuery } from 'features/earning-accounts/earningAccountsApi';
import SidoohAccount from 'components/SidoohAccount';
import { EarningAccount } from 'utils/types';
import { currencyFormat, DataTable, SectionError, SectionLoader, TableDate, groupBy } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';

const Index = () => {
    let { data: accounts, isLoading, isSuccess, isError, error } = useEarningAccountsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !accounts) return <SectionLoader/>;

    logger.log(accounts);

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
                ]} data={groupBy(accounts, 'account_id', true)}/>
            </Card.Body>
        </Card>
    );
};

export default Index;
