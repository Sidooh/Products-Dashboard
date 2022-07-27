
import { SectionError } from 'components/common/Error';
import { ComponentLoader } from 'components/common/Loader';
import { lazy } from 'react';
import { Col, Row } from "react-bootstrap";
import { useGetDashboardSummariesQuery } from "../../../../../features/products/productsAPI";

const TotalRevenue = lazy(() => import('./Revenue'));
const TransactionsCount = lazy(() => import('./Count'));

const TransactionSummaries = () => {
    const {data, isError, error, isLoading, isSuccess} = useGetDashboardSummariesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const {data: stats} = data;

    return (
        <>
            <Row className="g-3">
                <Col md={6} xxl={12}>
                    <TransactionsCount total={stats.total_transactions}
                                       total_today={stats.total_transactions_today}/>
                </Col>
                <Col md={6} xxl={12}>
                    <TotalRevenue total={stats.total_revenue} total_today={stats.total_revenue_today}/>
                </Col>
            </Row>
        </>
    );
};

export default TransactionSummaries;
