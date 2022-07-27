import { Col, Row } from "react-bootstrap";
import { useGetDashboardQuery } from 'features/products/productsAPI';
import { SectionError } from 'components/common/Error';
import { ComponentLoader } from 'components/common/Loader';
import { lazy } from 'react';

const TotalRevenue = lazy(() => import('./TotalRevenue'));
const TransactionsCount = lazy(() => import('./TransactionsCount'));
const Revenue = lazy(() => import('./revenue/Revenue'));

const DashboardStats = () => {
    let {data: dashboardStats, isLoading, isSuccess, isError, error} = useGetDashboardQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !dashboardStats) return <ComponentLoader/>;

    const {data: stats} = dashboardStats || {};
    console.log(stats);


    return (
        <>
            {stats && <Row className="g-3 mb-3">
                <Col xxl={9}><Revenue total_today={stats.total_today} total_yesterday={stats.total_yesterday}/></Col>
                <Col>
                    <Row className="g-3">
                        <Col md={6} xxl={12}>
                            <TransactionsCount total={stats.total_transactions}
                                               total_today={stats.total_transactions_today}/>
                        </Col>
                        <Col md={6} xxl={12}>
                            <TotalRevenue total={stats.total_revenue} total_today={stats.total_revenue_today}/>
                        </Col>
                    </Row>
                </Col>
            </Row>}

        </>
    );
};

export default DashboardStats;
