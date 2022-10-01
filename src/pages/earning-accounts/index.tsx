import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useEarningAccountsQuery } from 'features/earning-accounts/earningAccountsApi';
import { groupBy } from 'utils/helpers';
import SidoohAccount from 'components/common/SidoohAccount';
import { EarningAccount } from 'utils/types';
import { currencyFormat, DataTable, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';

const Index = () => {
    let {data: accounts, isLoading, isSuccess, isError, error} = useEarningAccountsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !accounts) return <SectionLoader/>;

    logger.log(accounts);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Earning Accounts'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: EarningAccount[]) => `${row[0].account?.phone}: ${row[0].account?.user?.name}`,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original[0].account}/>
                    },
                    {
                        accessorKey: 'total',
                        header: 'Total Earnings(self + invite)',
                        cell: ({row}: any) => row.original.map((acc: EarningAccount, i: number) => (
                            <strong key={`total-${i}`}>
                                <small
                                    className={'m-0'}>{acc.type}</small>: {currencyFormat((Number(acc.self_amount) + Number(acc.invite_amount)))}
                                <br/>
                            </strong>
                        ))
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({row}: any) => <TableDate date={row.original[0].updated_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({row}: any) => <TableActions entityId={row.original[0].id} entity={'earning-accounts'}/>
                    }
                ]} data={groupBy(accounts, 'account_id', true)}/>
            </Card.Body>
        </Card>
    );
};

export default Index;
