import { lazy } from 'react';
import ProviderBalances from "./ProviderBalances";

const DashboardStatistics = lazy(() => import('./statistics'));
const DashboardTransactions = lazy(() => import('./transactions/DashboardTransactions'));

const Dashboard = () => {
    return (
        <>
            <DashboardStatistics/>

            <DashboardTransactions/>

            <ProviderBalances/>
        </>
    );
};

export default Dashboard;
