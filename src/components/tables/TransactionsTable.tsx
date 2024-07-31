import TableActions from '@/components/TableActions';
import {
    currencyFormat,
    DataTable,
    getRelativeDateAndTime,
    Latency,
    Phone,
    ProductsTransaction as Transaction,
    StatusBadge,
    TableDate,
} from '@nabcellent/sui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

type TransactionsTableProps = {
    tableTitle: string;
    transactions: Transaction[];
    onRefetch?: () => void;
    reFetching?: boolean;
    serverTotal?: number;
    pageSize?: number;
    serverPageCount?: number;
    currentServerPage?: number;
    onNextServerPage?: () => void;
    onPreviousServerPage?: () => void;
    onGoToServerPage?: (page: number) => void;
    onSetServerPageSize?: (page: number) => void;
};

const TransactionsTable = ({
    tableTitle,
    transactions,
    onRefetch,
    reFetching,
    serverTotal,
    pageSize,
    serverPageCount,
    currentServerPage,
    onNextServerPage,
    onPreviousServerPage,
    onGoToServerPage,
    onSetServerPageSize,
}: TransactionsTableProps) => (
    <DataTable
        title={tableTitle}
        columns={[
            {
                accessorKey: 'account',
                header: 'Account',
                accessorFn: (row: Transaction) => `${row.account.phone}: ${row.account?.user?.name ?? ''}`,
                cell: ({
                    row: {
                        original: { account },
                    },
                }: any) => (
                    <>
                        {account?.user?.name} {account?.user?.name && <br />}
                        <Link className={'text-xs'} to={`/accounts/${account.id}/details`}>
                            <Phone phone={account.phone} />
                        </Link>
                    </>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                accessorFn: (row: Transaction) => `${row.description}: ${row.destination}`,
                cell: ({ row: { original: tx } }: any) => (
                    <span className={'flex flex-col leading-snug'}>
                        {tx.description}
                        <br />
                        {tx.destination !== tx.account?.phone && (
                            <small>
                                <Phone phone={tx.destination} />
                            </small>
                        )}
                    </span>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: ({ row: { original: tx } }: any) => (
                    <span className={'flex flex-col'}>
                        {currencyFormat(tx.amount)}
                        <br />
                        {tx.charge > 0 && <small className={'text-info'}>{currencyFormat(tx.charge)}</small>}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
            },
            {
                accessorKey: 'created_at',
                accessorFn: (row: Transaction) => getRelativeDateAndTime(row.created_at).toString(),
                header: 'Date',
                cell: ({ row }: any) => <TableDate date={row.original.created_at} />,
            },
            {
                accessorKey: 'latency',
                accessorFn: (r: Transaction) => moment(r.updated_at).diff(r.created_at, 's'),
                header: 'Latency',
                cell: ({ row: { original: tx } }: any) => <Latency from={tx.created_at} to={tx.updated_at} />,
            },
            {
                id: 'actions',
                cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'transaction'} />,
            },
        ]}
        data={transactions}
        onRefresh={onRefetch}
        isRefreshing={reFetching}
        serverTotal={serverTotal}
        serverPageSize={pageSize}
        serverPageCount={serverPageCount}
        currentServerPage={currentServerPage}
        onNextServerPage={onNextServerPage}
        onPreviousServerPage={onPreviousServerPage}
        onGoToServerPage={onGoToServerPage}
        onSetServerPageSize={onSetServerPageSize}
    />
);

export default TransactionsTable;
