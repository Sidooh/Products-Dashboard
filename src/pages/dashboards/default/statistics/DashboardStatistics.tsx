import { Col, Row } from "react-bootstrap";
import { lazy } from 'react';

const RevenueChartWrapper = lazy(() => import('./revenue/RevenueChartWrapper'));
const TransactionSummaries = lazy(() => import('./summaries/TransactionSummaries'));

const DashboardStatistics = () => {

    return (
        <>
             <Row className="g-3 mb-3">
                <Col xxl={9}>
                    <RevenueChartWrapper />
                </Col>
                <Col>
                    <TransactionSummaries />
                </Col>
            </Row>

        </>
    );
};

export default DashboardStatistics;
