import { Card } from 'react-bootstrap';
import { DataTable, TableDate } from '@nabcellent/sui-react';
import SidoohAccount from '../common/SidoohAccount';
import TableActions from '../common/TableActions';
import { ProductAccount } from '../../utils/types';

const ProductAccountsTable = ({title, accounts}: { title: string, accounts: ProductAccount[] }) => {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={title} columns={[
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

export default ProductAccountsTable;
