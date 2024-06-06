import moment from 'moment';
import {
    currencyFormat,
    StatusBadge,
    SavingsTransaction as SavingsTransactionType,
    Card,
    Table,
    CardHeader,
    TableHeader,
    TableRow,
    TableHead,
} from '@nabcellent/sui-react';

const SavingsTransaction = ({ transaction }: { transaction: SavingsTransactionType }) => {
    return (
        <Card className="mb-3">
            <CardHeader className="pb-0">
                <h5 className="fs-0">Transaction - Savings</h5>
            </CardHeader>
            <div className="card-body">
                <Table className="border-b fs--1">
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Updated</TableHead>
                        </TableRow>
                    </TableHeader>

                    <tbody>
                        <tr className="border-200">
                            <td className="align-middle">{transaction.type}</td>
                            <td className="align-middle">{currencyFormat(transaction.amount)}</td>
                            <td className="align-middle">{transaction.description}</td>
                            <td className="align-middle text-center">
                                <StatusBadge status={transaction.status} />
                            </td>
                            <td className="align-middle text-end">
                                {moment(transaction.created_at).format('MMM D, Y')}
                                <br />
                                <small>{moment(transaction.created_at).format('hh:mm A')}</small>
                            </td>
                            <td className="align-middle text-end">
                                {moment(transaction.updated_at).format('MMM D, Y')}
                                <br />
                                <small>{moment(transaction.updated_at).format('hh:mm A')}</small>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default SavingsTransaction;
