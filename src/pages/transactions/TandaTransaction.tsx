import { Card, Table } from 'react-bootstrap';

const TandaTransaction = () => {
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
                        <th className="border-0">Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr className="border-200">
                        <td className="align-middle">
                            967aaf87-c4ea-4f21-9cf9-c461117e5987
                            <br/>
                            <span className="text-sm-center">(012220624879875)</span>
                        </td>
                        <td className="align-middle">100</td>
                        <td className="align-middle">AIRTEL</td>
                        <td className="align-middle">254736388405</td>
                        <td className="align-middle">Request processed successfully</td>
                        <td className="align-middle text-center">000000</td>
                        <td className="align-middle">Jun 24, 2022, 04:29 PM</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </Card>
    );
};

export default TandaTransaction;
