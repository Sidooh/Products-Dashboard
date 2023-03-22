import { lazy, Suspense } from 'react';
import ProviderBalances from "./ProviderBalances";
import { Col, Row } from "react-bootstrap";
import { ComponentLoader } from "@nabcellent/sui-react";

const DashboardChart = lazy(() => import('./Chart'));
const TransactionSummaries = lazy(() => import('./TransactionSummaries'));

const PendingTransactions = lazy(() => import('./transactions/PendingTransactions'));
const RecentTransactions = lazy(() => import('./transactions/RecentTransactions'));

const Dashboard = () => {
    return (
        <>
            <Row className="g-3 mb-3">
                <Col xxl={9}>
                    <Suspense fallback={<ComponentLoader/>}><DashboardChart/></Suspense>
                </Col>
                <Col>
                    <Suspense fallback={<ComponentLoader/>}><TransactionSummaries/></Suspense>
                </Col>
            </Row>

            <Suspense fallback={<ComponentLoader/>}><PendingTransactions/></Suspense>

            <Suspense fallback={<ComponentLoader/>}><RecentTransactions/></Suspense>

            <ProviderBalances/>
        </>
    );
};

export default Dashboard;
