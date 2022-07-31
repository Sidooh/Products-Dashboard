import { lazy } from 'react';

const DashboardStatistics = lazy(() => import('./statistics/DashboardStatistics'));
const DashboardTransactions = lazy(() => import('./transactions/DashboardTransactions'));

const Dashboard = () => {
    return (
        <>
            <DashboardStatistics/>

            <DashboardTransactions/>
        </>
    );
};

export default Dashboard;
