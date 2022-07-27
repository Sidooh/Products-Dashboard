import { lazy } from 'react';

const DashboardStats = lazy(() => import('./DashboardStats'));
const DashboardTransactions = lazy(() => import('./DashboardTransactions'));

const Dashboard = () => {
    return (
        <>
            <DashboardStats />

            <DashboardTransactions />
        </>
    );
};

export default Dashboard;
