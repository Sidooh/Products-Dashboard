import { Col, Row } from "react-bootstrap";
import { useGetDashboardQuery } from 'features/products/productsAPI';
import { SectionError } from 'components/common/Error';
import { SectionLoader } from 'components/common/Loader';
import { lazy } from 'react';
import {useTransactionsQuery} from "../../../features/transactions/transactionsAPI";
import {Status} from "../../../utils/enums";

const TotalRevenue = lazy(() => import('./TotalRevenue'));
const TransactionsCount = lazy(() => import('./TransactionsCount'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));
const Revenue = lazy(() => import('./revenue/Revenue'));
const RecentTransactions = lazy(() => import('./RecentTransactions'));

const Dashboard = () => {
    let {data: transactionData, isLoading, isSuccess, isError, error} = useTransactionsQuery();
    let {data: dashboardStats} = useGetDashboardQuery();

    if (isError) return <SectionError error={error}/>;
    console.log(isLoading);

    if (isLoading || !isSuccess || !transactionData) return <SectionLoader/>;

    console.log(isLoading);

    const {data: stats} = dashboardStats || {};
    console.log(stats);

    const {data: transactions} = transactionData;
    console.log(transactions)

    const pendingTransactions = transactions.filter(t => t.status === Status.PENDING)

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

            {pendingTransactions && pendingTransactions.length > 0 && <PendingTransactions transactions={pendingTransactions}/>}
            <RecentTransactions transactions={transactions}/>
        </>
    );
};

export default Dashboard;
