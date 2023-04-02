import { lazy } from 'react';
import ProviderBalances from "./ProviderBalances";
import { Col, Row } from "react-bootstrap";

const DashboardChart = lazy(() => import('./Chart'));
const TransactionSummaries = lazy(() => import('./TransactionSummaries'));

const PendingTransactions = lazy(() => import('./transactions/PendingTransactions'));
const RecentTransactions = lazy(() => import('./transactions/RecentTransactions'));

const Dashboard = () => {
    return (
        <>
            <Row className="g-3 mb-3">
                <Col xxl={9}><DashboardChart/></Col>
                <Col><TransactionSummaries/></Col>
            </Row>

            <PendingTransactions/>
            <RecentTransactions/>
            <ProviderBalances/>
        </>
    );
};

export default Dashboard;
