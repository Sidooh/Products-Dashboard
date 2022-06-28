import { Col, Row } from "react-bootstrap";
import { useGetDashboardQuery } from 'features/products/productsAPI';
import { SectionError } from 'components/common/Error';
import { SectionLoader } from 'components/common/Loader';
import { lazy } from 'react';

const TotalRevenue = lazy(() => import('./TotalRevenue'));
const TransactionsCount = lazy(() => import('./TransactionsCount'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));
const Revenue = lazy(() => import('./revenue/Revenue'));
const RecentTransactions = lazy(() => import('./RecentTransactions'));

const Dashboard = () => {
    // console.log(process.env);
    const {data, isError, error, isLoading, isSuccess} = useGetDashboardQuery();
    console.log(data);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    return (
        <>
            <Row className="g-3 mb-3">
                <Col xxl={9}><Revenue total_today={data.total_today} total_yesterday={data.total_yesterday}/></Col>
                <Col>
                    <Row className="g-3">
                        <Col md={6} xxl={12}>
                            <TransactionsCount total={data.total_transactions}
                                               total_today={data.total_transactions_today}/>
                        </Col>
                        <Col md={6} xxl={12}>
                            <TotalRevenue total={data.total_revenue} total_today={data.total_revenue_today}/>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <PendingTransactions transactions={data.pending_transactions}/>
            <RecentTransactions transactions={data.recent_transactions}/>
        </>
    );
};

export default Dashboard;
