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
import moment from "moment";

const TransactionsTable = ({ tableTitle, transactions }: { tableTitle: string, transactions: Transaction[] }) => {
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
                        cell: ({ row: { original: tx } }: any) => (
                            <span className={'d-flex flex-column'}>
                                {tx.description}<br/>
                                {tx.destination !== tx.account.phone &&
                                    <small><PhoneChip phone={tx.destination}/></small>}
                            </span>
                        )
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({ row: { original: tx } }: any) => (
                            <span className={'d-flex flex-column'}>
                                {currencyFormat(tx.amount)}<br/>
                                {tx.charge > 0 && <small className={'text-info'}>{currencyFormat(tx.charge)}</small>}
                            </span>
                        )
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
                        accessorKey: 'latency',
                        accessorFn: (r: Transaction) => moment(r.updated_at).diff(r.created_at, 's'),
                        header: 'Latency',
                        cell: ({ row: { original: tx } }: any) => {
                            let unit = 's', color = '', latency = moment(tx.updated_at).diff(tx.created_at, 's');

                            if (latency > 29) color = 'text-danger'

                            if (latency > 3600) {
                                unit = 'hrs'
                                latency = latency / 3600
                            } else if (latency > 120) {
                                unit = 'min'
                                latency = latency / 60
                            }

                            return <span className={`fw-bold ${color}`}>{Math.round(latency)} {unit}</span>
                        }
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

export default TransactionsTable;
