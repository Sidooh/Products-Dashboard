import { Col, Row } from "react-bootstrap";
import TotalRevenue from './TotalRevenue';
import TransactionsCount from "./TransactionsCount";
import PendingTransactions from './PendingTransactions';
import Revenue from './revenue/Revenue';
import RecentTransactions from './RecentTransactions';
import { useGetDashboardQuery } from 'features/products/productsAPI';
import { SectionError } from '../../../components/common/Error';
import { SectionLoader } from '../../../components/common/Loader';

export const payment = {
    all       : [4, 1, 6, 2, 7, 12, 4, 6, 5, 4, 5, 10],
    successful: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
    failed    : [1, 0, 2, 1, 2, 1, 1, 0, 0, 1, 0, 2]
};

const Dashboard = () => {
    const {data, isError, error, isLoading, isSuccess} = useGetDashboardQuery();
    console.log(data);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    return (
        <>
            <Row className="g-3 mb-3">
                <Col xxl={9}><Revenue data={payment}/></Col>
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
