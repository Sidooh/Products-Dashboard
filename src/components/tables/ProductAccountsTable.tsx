import { Card } from 'react-bootstrap';
import { DataTable, getRelativeDateAndTime, TableDate } from '@nabcellent/sui-react';
import SidoohAccount from '../SidoohAccount';
import TableActions from '../TableActions';
import { ProductAccount } from 'utils/types';

type ProductAccountsTableProps = {
    title: string, accounts: ProductAccount[]
    isFetching?: boolean,
    serverTotal?: number
    serverPageSize?: number
    serverPageCount?: number
    currentServerPage?: number
    onNextServerPage?: () => void,
    onPreviousServerPage?: () => void,
    onGoToServerPage?: (page: number) => void,
    onSetServerPageSize?: (page: number) => void,
}

const ProductAccountsTable = ({
    title, accounts,
    isFetching,
    serverTotal,
    serverPageSize,
    serverPageCount,
    currentServerPage,
    onNextServerPage,
    onPreviousServerPage,
    onGoToServerPage,
    onSetServerPageSize
}: ProductAccountsTableProps) => (
    <Card className={'mb-3'}>
        <Card.Body>
            <DataTable title={title} columns={[
                {
                    accessorKey: 'account',
                    accessorFn: (row: ProductAccount) => `${row.account.phone}: ${row.account.user?.name}`,
                    header: 'Account',
                    cell: ({ row }: any) => <SidoohAccount account={row.original.account}/>
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
                    cell: ({ row }: any) => <TableDate date={row.original.created_at}/>
                },
                {
                    id: 'actions',
                    header: '',
                    cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'subscription'}/>
                }
            ]} data={accounts}
                       reFetching={isFetching}
                       serverTotal={serverTotal}
                       serverPageSize={serverPageSize}
                       serverPageCount={serverPageCount}
                       currentServerPage={currentServerPage}
                       onNextServerPage={onNextServerPage}
                       onPreviousServerPage={onPreviousServerPage}
                       onGoToServerPage={onGoToServerPage}
                       onSetServerPageSize={onSetServerPageSize}/>
        </Card.Body>
    </Card>
);

export default ProductAccountsTable;
