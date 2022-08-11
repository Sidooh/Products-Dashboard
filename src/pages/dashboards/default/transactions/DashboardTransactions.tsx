import { ComponentLoader } from '@nabcellent/sui-react';
import { lazy, Suspense } from 'react';

const PendingTransactions = lazy(() => import('./PendingTransactions'));
const RecentTransactions = lazy(() => import('./RecentTransactions'));

const DashboardTransactions = () => {
    return (
        <>
            <Suspense fallback={<ComponentLoader/>}><PendingTransactions/></Suspense>

            <Suspense fallback={<ComponentLoader/>}><RecentTransactions/></Suspense>
        </>
    );
};

export default DashboardTransactions;