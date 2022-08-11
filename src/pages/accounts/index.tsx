import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { DataTable, SectionError, TableDate, Str, SectionLoader } from '@nabcellent/sui-react';
import { useAccountsQuery } from 'features/accounts/accountsAPI';
import { Navigate, useParams } from 'react-router-dom';
import SidoohAccount from '../../components/common/SidoohAccount';

const Accounts = () => {
    const {product} = useParams();
    console.log(product);

    if (!['utility', 'airtime'].includes(String(product))) return <Navigate to={'/'}/>;

    let {data, isLoading, isSuccess, isError, error} = useAccountsQuery(product!);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: accounts} = data;
    console.log(accounts);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={`${Str.ucFirst(product!)} Accounts`} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: any) => row.account.phone,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'account_number',
                        header: 'Account Number',
                    },
                    {
                        accessorKey: 'provider',
                        header: 'Provider',
                    },
                    {
                        accessorKey: 'priority',
                        header: 'Priority',
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'subscription'}/>
                    }
                ]} data={accounts}/>
            </Card.Body>
        </Card>
    );
};

export default Accounts;
