import { Card } from 'react-bootstrap';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useAccountsQuery } from 'features/accounts/accountsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { Str } from 'utils/helpers';
import { Navigate, useParams } from 'react-router-dom';
import PhoneChip from '../../components/chips/PhoneChip';

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
                        accessorFn: row => row.account.phone,
                        header: 'Customer',
                        cell: ({row}: any) => <PhoneChip phone={row.original.account.phone}/>
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
                        header: 'Date Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'subscription'}/>
                    }
                ]} data={accounts}/>
            </Card.Body>
        </Card>
    );
};

export default Accounts;
