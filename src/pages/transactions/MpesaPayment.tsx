import { Card, Table } from 'react-bootstrap';
import { Payment } from 'utils/types';
import moment from 'moment';
import { CONFIG } from "../../config";
import { currencyFormat, StatusChip } from '@nabcellent/sui-react';
import { ReadMore } from '@mui/icons-material';

const MpesaPayment = ({payment}: { payment: Payment }) => {
    return (
        <Card className="mb-3">
            <Card.Header className="pb-0">
                <h5 className="fs-0">Payment - {payment.type}</h5>
            </Card.Header>
            <div className="card-body">
                <Table striped responsive className="border-bottom fs--1">
                    <thead className="bg-200 text-900">
                    <tr>
                        <th className="border-0">Sub-Type</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Date</th>
                        <th className="border-0">Status</th>
                        <th className="border-0"></th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr className="border-200">
                        <td className="align-middle">{payment.subtype}</td>
                        <td className="align-middle">{currencyFormat(payment.amount)}</td>
                        <td className="">
                            {moment(payment.updated_at).format('MMM D, Y')}<br/>
                            <small>{moment(payment.updated_at).format('hh:mm A')}</small>
                        </td>
                        <td className="align-middle text-start"><StatusChip status={payment.status}/></td>
                        <td>
                            <a href={`${CONFIG.sidooh.services.payments.dashboard.url}/payments/${payment.payment_id}`}
                               target={'_blank'}><ReadMore/>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default MpesaPayment;
