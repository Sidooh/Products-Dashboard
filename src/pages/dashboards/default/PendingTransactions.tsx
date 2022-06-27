import DataTable from 'components/common/datatable';
import { Card } from 'react-bootstrap';
import StatusChip from 'components/chips/StatusChip';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import { Transaction } from 'utils/types';

const PendingTransactions = ({transactions}: { transactions: Transaction[] }) => {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable bulkActions title={'Pending Transactions'} columns={[
                    {
                        accessor: 'customer',
                        Header  : 'Customer',
                        Cell    : ({row}: any) => (
                            <span>
                                {row.original.account.phone} <br/>
                                <small><b>Destination: {row.original.destination}</b></small>
                            </span>
                        )
                    },
                    {
                        accessor: 'product',
                        Header  : 'Product',
                        Cell    : ({row}: any) => row.original.product.name
                    },
                    {
                        accessor: 'amount',
                        Header  : 'Amount',
                        Cell    : ({row}: any) => (new Intl.NumberFormat('en-GB', {
                            style   : 'currency',
                            currency: 'KES'
                        })).format(row.original.amount)
                    },
                    {
                        accessor: 'payment',
                        Header  : 'Payment',
                        Cell    : ({row}: any) => <StatusChip status={row.original.payment?.status}
                                                              entity={'payment'} entityId={row.original.id}/>
                    },
                    {
                        accessor: 'status',
                        Header  : 'Status',
                        Cell    : ({row}: any) => <StatusChip status={row.original.status} entity={'transaction'}
                                                              entityId={row.original.id}/>
                    },
                    {
                        accessor : 'created_at',
                        Header   : 'Date',
                        className: 'text-end',
                        Cell     : ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        accessor     : 'actions',
                        disableSortBy: true,
                        className    : 'text-end',
                        Cell         : ({row}: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                    }
                ]} data={transactions}/>
            </Card.Body>
        </Card>
    );
};

export default PendingTransactions;
