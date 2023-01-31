import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import SidoohAccount from 'components/common/SidoohAccount';
import { Transaction } from 'utils/types';
import {
    currencyFormat,
    DataTable,
    getRelativeDateAndTime,
    PhoneChip,
    StatusChip,
    TableDate
} from '@nabcellent/sui-react';

const Transactions = ({ tableTitle, transactions }: { tableTitle: string, transactions: Transaction[] }) => {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={tableTitle} columns={[
                    {
                        accessorKey: 'account',
                        header: 'Account',
                        accessorFn: (row: Transaction) => `${row.account.phone}: ${row.account?.user?.name ?? ''}`,
                        cell: ({ row }: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'description',
                        header: 'Description',
                        accessorFn: (row: Transaction) => `${row.description}: ${row.destination}`,
                        cell: ({ row }: any) => (
                            <span>
                                {row.original.description}<br/>
                                <small><b><PhoneChip phone={row.original.destination}/></b></small>
                            </span>
                        )
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({ row }: any) => currencyFormat(row.original.amount)
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({ row }: any) => <StatusChip status={row.original.status}/>
                    },
                    {
                        accessorKey: 'created_at',
                        accessorFn: (row: Transaction) => getRelativeDateAndTime(row.created_at).toString(),
                        header: 'Date',
                        cell: ({ row }: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                    }
                ]} data={transactions}/>
            </Card.Body>
        </Card>
    );
};

export default Transactions;
