import { Card } from 'react-bootstrap';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useEarningAccountsQuery } from 'features/earnings/earningsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { currencyFormat, groupBy } from '../../utils/helpers';
import { EarningAccount } from '../../utils/types';
import SidoohAccount from '../../components/common/SidoohAccount';

const EarningAccounts = () => {
    let {data, isLoading, isSuccess, isError, error} = useEarningAccountsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: accounts} = data;
    console.log(accounts);
    const groupByAccount = groupBy<EarningAccount>(['account_id']);
    console.log(groupByAccount(accounts));

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Earning Accounts'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: row => row?.account?.phone,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                    },
                    {
                        accessorKey: 'self_amount',
                        header: 'Self Amount',
                        cell: ({row}: any) => currencyFormat(row.original.self_amount)
                    },
                    {
                        accessorKey: 'invite_amount',
                        header: 'Invite Amount',
                        cell: ({row}: any) => currencyFormat(row.original.invite_amount)
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({row}: any) => <TableDate date={row.original.updated_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'earnings-account'}/>
                    }
                ]} data={accounts}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
