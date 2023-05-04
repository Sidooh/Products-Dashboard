import { Card } from 'react-bootstrap';
import TableActions from 'components/TableActions';
import SidoohAccount from 'components/SidoohAccount';
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
import Latency from "../Latency";

type TransactionsTableProps = {
    tableTitle: string,
    transactions: Transaction[],
    onRefetch?: () => void,
    reFetching?: boolean,
    serverTotal?: number
    serverPageCount?: number
    currentServerPage?: number
    onNextServerPage?: () => void,
    onPreviousServerPage?: () => void,
    onGoToServerPage?: (page: number) => void,
    onSetServerPageSize?: (page: number) => void,
}

const TransactionsTable = ({
    tableTitle,
    transactions,
    onRefetch,
    reFetching,
    serverTotal,
    serverPageCount,
    currentServerPage,
    onNextServerPage,
    onPreviousServerPage,
    onGoToServerPage,
    onSetServerPageSize
}: TransactionsTableProps) => {
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
                        cell: ({ row: { original: tx } }: any) => <Latency from={tx.created_at} to={tx.updated_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                    }
                ]}
                           data={transactions}
                           onRefetch={onRefetch}
                           reFetching={reFetching}
                           serverTotal={serverTotal}
                           serverPageCount={serverPageCount}
                           currentServerPage={currentServerPage}
                           onNextServerPage={onNextServerPage}
                           onPreviousServerPage={onPreviousServerPage}
                           onGoToServerPage={onGoToServerPage}
                           onSetServerPageSize={onSetServerPageSize}/>
            </Card.Body>
        </Card>
    );
};

export default TransactionsTable;
