import { Card, Table } from 'react-bootstrap';
import { TandaRequest } from 'utils/types';
import moment from 'moment';
import { currencyFormat } from '@nabcellent/sui-react';

const TandaTransaction = ({requests}: { requests: TandaRequest[] }) => {
    return (
        <Card className="mb-3">
            <Card.Header className="pb-0"><h5 className="fs-0">Transaction - Tanda</h5></Card.Header>
            <div className="card-body">
                <Table striped responsive className="border-bottom fs--1">
                    <thead className="bg-200 text-900">
                    <tr>
                        <th className="border-0">Reference (Receipt No.)</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Provider</th>
                        <th className="border-0">Destination</th>
                        <th className="border-0">Message</th>
                        <th className="border-0 text-center">Status</th>
                        <th className="border-0">Created</th>
                        <th className="border-0">Updated</th>
                    </tr>
                    </thead>

                    <tbody>
                    {requests.map(r => (
                        <tr key={r.request_id} className="border-200">
                            <td className="align-middle">
                                {r.request_id}<br/>
                                <span className="text-sm-center">({r.receipt_number})</span>
                            </td>
                            <td className="align-middle">{currencyFormat(r.amount)}</td>
                            <td className="align-middle">{r.provider}</td>
                            <td className="align-middle">{r.destination}</td>
                            <td className="align-middle">{r.message}</td>
                            <td className="align-middle text-center">{r.status}</td>
                            <td className="align-middle text-end">
                                {moment(r.last_modified).format('MMM D, Y')}<br/>
                                <small>{moment(r.last_modified).format('hh:mm A')}</small>
                            </td>
                            <td className="align-middle text-end">
                                {moment(r.updated_at).format('MMM D, Y')}<br/>
                                <small>{moment(r.updated_at).format('hh:mm A')}</small>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default TandaTransaction;
