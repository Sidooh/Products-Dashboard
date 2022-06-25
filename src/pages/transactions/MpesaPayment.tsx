import { Card, Table } from 'react-bootstrap';

const MpesaPayment = () => {
    return (
        <Card className="mb-3">
            <Card.Header className="pb-0"><h5 className="fs-0">Payment - MPESA</h5></Card.Header>
            <div className="card-body">
                <Table striped responsive className="border-bottom fs--1">
                    <thead className="bg-200 text-900">
                    <tr>
                        <th className="border-0">Reference</th>
                        <th className="border-0 text-center">Status</th>
                        <th className="border-0">Result</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Date</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr className="border-200">
                        <td className="align-middle">
                            <h6 className="mb-0 text-nowrap">1-AIRTIME</h6>
                            <p className="mb-0">254714611696</p>
                        </td>
                        <td className="align-middle text-center">Paid</td>
                        <td className="align-middle">The service request is processed successfully.</td>
                        <td className="align-middle">KES&nbsp;100</td>
                        <td className="align-middle">Jun 24, 2022, 04:29 PM</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default MpesaPayment;
