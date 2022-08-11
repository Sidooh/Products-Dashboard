import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useEarningAccountsQuery } from 'features/earnings/earningsAPI';
import { groupBy } from 'utils/helpers';
import SidoohAccount from 'components/common/SidoohAccount';
import { EarningAccount } from 'utils/types';
import { DataTable, SectionError, SectionLoader, TableDate, currencyFormat } from '@nabcellent/sui-react';

const EarningAccounts = () => {
    let {data, isLoading, isSuccess, isError, error} = useEarningAccountsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: accounts} = data;
    console.log(accounts);
    console.log(groupBy(accounts, 'account_id', true));

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Earning Accounts'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: EarningAccount[]) => row[0]?.account?.phone,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original[0].account}/>
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                        cell: ({row}: any) => row.original.map((acc: EarningAccount) => (
                            <div>
                                <b><small className={'m-0'}>{acc.type}</small></b><br/>
                                <small>
                                    Self <b>{currencyFormat(acc.self_amount)}</b>
                                    &nbsp; | &nbsp;
                                    Invite <b>{currencyFormat(acc.invite_amount)}</b>
                                </small>
                            </div>
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
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'earnings-account'}/>
                    }
                ]} data={groupBy(accounts, 'account_id', true)}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
