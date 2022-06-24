import { Col, Row } from "react-bootstrap";
import Revenue from './Revenue';
import Transactions from "./Transactions";
import TransactionSummary from './TransactionSummary';
import Payment from './payment/Payment';

export const payment = {
    all: [4, 1, 6, 2, 7, 12, 4, 6, 5, 4, 5, 10],
    successful: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
    failed: [1, 0, 2, 1, 2, 1, 1, 0, 0, 1, 0, 2]
};

const Dashboard = () => {
    return (
        <>
            <Row className="g-3">
                <Col xxl={9}><Payment data={payment}/></Col>
                <Col>
                    <Row className="g-3">
                        <Col md={6} xxl={12}><Transactions/></Col>
                        <Col md={6} xxl={12}><Revenue/></Col>
                    </Row>
                </Col>
            </Row>
            <TransactionSummary/>
        </>
    );
};

export default Dashboard;
