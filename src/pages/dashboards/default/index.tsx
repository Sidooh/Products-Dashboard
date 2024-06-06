import { lazy } from 'react';
import ProviderBalances from './ProviderBalances';
import Transactions from './Transactions';

const DashboardChart = lazy(() => import('./Chart'));
const TransactionSummaries = lazy(() => import('./TransactionSummaries'));

const Dashboard = () => (
    <div className={'space-y-3'}>
        <div className="grid 2xl:grid-cols-12 gap-3">
            <div className={'2xl:col-span-9'}>
                <DashboardChart />
            </div>
            <div className={'2xl:col-span-3'}>
                <TransactionSummaries />
            </div>
        </div>

        <Transactions />
        <ProviderBalances />
    </div>
);

export default Dashboard;
