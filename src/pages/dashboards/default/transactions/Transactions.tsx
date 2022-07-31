import { Card } from 'react-bootstrap';
import DataTable from 'components/common/datatable';
import StatusChip from 'components/chips/StatusChip';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import { Transaction } from 'utils/types';
import SidoohAccount from '../../../../components/common/SidoohAccount';

const Transactions = ({title, transactions}: { title: string, transactions: Transaction[] }) => {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={title} columns={[
                    {
                        accessorKey: 'customer',
                        header: 'Customer',
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
                        cell: ({row}: any) => (new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'KES'
                        })).format(row.original.amount)
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({row}: any) => <StatusChip status={row.original.status} entity={'transaction'}
                                                          entityId={row.original.id}/>
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Date',
                        cell: ({row}: any) => <TableDate date={row.original.updated_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                    }
                ]} data={transactions}/>
            </Card.Body>
        </Card>
    );
};

export default Transactions;
