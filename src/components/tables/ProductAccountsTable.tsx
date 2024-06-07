import { DataTable, getRelativeDateAndTime, ProductAccount, TableDate, Phone } from '@nabcellent/sui-react';
import { Link } from 'react-router-dom';

type ProductAccountsTableProps = {
    title: string;
    accounts: ProductAccount[];
    isFetching?: boolean;
    serverTotal?: number;
    serverPageSize?: number;
    serverPageCount?: number;
    currentServerPage?: number;
    onNextServerPage?: () => void;
    onPreviousServerPage?: () => void;
    onGoToServerPage?: (page: number) => void;
    onSetServerPageSize?: (page: number) => void;
};

const ProductAccountsTable = ({
    title,
    accounts,
    isFetching,
    serverTotal,
    serverPageSize,
    serverPageCount,
    currentServerPage,
    onNextServerPage,
    onPreviousServerPage,
    onGoToServerPage,
    onSetServerPageSize,
}: ProductAccountsTableProps) => (
    <DataTable
        title={title}
        columns={[
            {
                accessorKey: 'account',
                accessorFn: (row: ProductAccount) => `${row.account.phone}: ${row.account.user?.name}`,
                header: 'Account',
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
                accessorFn: (row: ProductAccount) => getRelativeDateAndTime(row.created_at).toString(),
                header: 'Created',
                cell: ({ row }: any) => <TableDate date={row.original.created_at} />,
            },
        ]}
        data={accounts}
        reFetching={isFetching}
        serverTotal={serverTotal}
        serverPageSize={serverPageSize}
        serverPageCount={serverPageCount}
        currentServerPage={currentServerPage}
        onNextServerPage={onNextServerPage}
        onPreviousServerPage={onPreviousServerPage}
        onGoToServerPage={onGoToServerPage}
        onSetServerPageSize={onSetServerPageSize}
    />
);

export default ProductAccountsTable;
