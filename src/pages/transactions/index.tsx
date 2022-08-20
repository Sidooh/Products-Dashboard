import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import SidoohAccount from 'components/common/SidoohAccount';
import { DataTable, SectionError, SectionLoader, StatusChip, TableDate, currencyFormat } from '@nabcellent/sui-react';
import { Transaction } from '../../utils/types';
import moment from 'moment';

const Transactions = () => {
    let {data:transactions, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <SectionLoader/>;

    console.log(transactions);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Transactions'} columns={[
                    {
                        accessorKey: 'customer',
                        header: 'Customer',
                        accessorFn: (row:Transaction) => `${row.account.phone}: ${row.account.user?.name}`,
                        cell: ({row}: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'description',
                        header: 'Description',
                        cell: ({row}: any) => (
                            <span>
                                {row.original.description}<br/>
                                <small><b>{row.original.destination}</b></small>
                            </span>
                        )
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({row}: any) => currencyFormat(row.original.amount)
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({row}: any) => <StatusChip status={row.original.status}/>
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Date',
                        accessorFn: (row:Transaction) => moment(row.created_at).calendar(),
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                    }
                ]} data={transactions}/>
            </Card.Body>
        </Card>
    );
};

export default Transactions;
