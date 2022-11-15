import { Card, Table } from 'react-bootstrap';
import { SavingsTransaction } from 'utils/types';
import moment from 'moment';
import { currencyFormat, StatusChip } from '@nabcellent/sui-react';

const TandaTransaction = ({ transaction }: { transaction: SavingsTransaction }) => {
    return (
        <Card className="mb-3">
            <Card.Header className="pb-0"><h5 className="fs-0">Transaction - Savings</h5></Card.Header>
            <div className="card-body">
                <Table striped responsive className="border-bottom fs--1">
                    <thead className="bg-200 text-900">
                    <tr>
                        <th className="border-0">Type</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Description</th>
                        <th className="border-0 text-center">Status</th>
                        <th className="border-0">Created</th>
                        <th className="border-0">Updated</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr className="border-200">
                        <td className="align-middle">{transaction.type}</td>
                        <td className="align-middle">{currencyFormat(transaction.amount)}</td>
                        <td className="align-middle">{transaction.description}</td>
                        <td className="align-middle text-center"><StatusChip status={transaction.status}/></td>
                        <td className="align-middle text-end">
                            {moment(transaction.created_at).format('MMM D, Y')}<br/>
                            <small>{moment(transaction.created_at).format('hh:mm A')}</small>
                        </td>
                        <td className="align-middle text-end">
                            {moment(transaction.updated_at).format('MMM D, Y')}<br/>
                            <small>{moment(transaction.updated_at).format('hh:mm A')}</small>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default TandaTransaction;
