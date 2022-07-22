import { Card } from 'react-bootstrap';
import StatusChip from 'components/chips/StatusChip';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { currencyFormat } from 'utils/helpers';
import PhoneChip from 'components/chips/PhoneChip';

const Transactions = () => {
    let {data, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: transactions} = data;
    console.log(transactions);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Transactions'} columns={[
                    {
                        accessorKey: 'customer',
                        header: 'Customer',
                        cell: ({row}: any) => (
                            <span>
                                <PhoneChip phone={row.original.account.phone}/> <br/>
                                <small><b>Destination: {row.original.destination}</b></small>
                            </span>
                        )
                    },
                    {
                        accessorKey: 'product',
                        header: 'Product',
                        cell: ({row}: any) => row.original.product.name
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({row}: any) => currencyFormat(row.original.amount)
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({row}: any) => <StatusChip status={row.original.status} entity={'transaction'}
                                                          entityId={row.original.id}/>
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Date',
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
