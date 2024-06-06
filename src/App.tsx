import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import { Middleware } from './middleware';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Analytics from './pages/dashboards/analytics';

const Dashboard = lazy(() => import('@/pages/dashboards/default'));

const ShowAccountDetails = lazy(() => import('@/pages/AccountDetails'));

const Transactions = lazy(() => import('@/pages/transactions'));
const ShowTransaction = lazy(() => import('@/pages/transactions/Show'));

const EarningAccounts = lazy(() => import('@/pages/earning-accounts'));
const ShowEarningAccount = lazy(() => import('@/pages/earning-accounts/Show'));

const Cashbacks = lazy(() => import('@/pages/cashbacks'));

const Subscriptions = lazy(() => import('@/pages/subscriptions'));
const SubscriptionTypes = lazy(() => import('@/pages/subscriptions/SubscriptionTypes'));

const AirtimeAccounts = lazy(() => import('@/pages/product-accounts/Airtime'));
const UtilityAccounts = lazy(() => import('@/pages/product-accounts/Utility'));

function App() {
    return (
        <Routes>
            <Route element={<GuestLayout />}>
                <Route path={'/login'} element={<Middleware.Guest component={<Login />} />} />
            </Route>

            <Route element={<Middleware.Auth component={<MainLayout />} />}>
                <Route index element={<Dashboard />} />
                <Route path={'/dashboard'} element={<Dashboard />} />
                <Route path={'/dashboard/analytics'} element={<Analytics />} />

                <Route path={'/transactions'} element={<Transactions />} />
                <Route path={'/transactions/:id'} element={<ShowTransaction />} />

                <Route path={'/earning-accounts'} element={<EarningAccounts />} />
                <Route path={'/earning-accounts/:id'} element={<ShowEarningAccount />} />

                <Route path={'/cashbacks'} element={<Cashbacks />} />

                <Route path={'/subscriptions'} element={<Subscriptions />} />
                <Route path={'/subscriptions-types'} element={<SubscriptionTypes />} />

                <Route path={'/airtime-accounts'} element={<AirtimeAccounts />} />
                <Route path={'/utility-accounts'} element={<UtilityAccounts />} />

                <Route path={'/accounts/:id/details'} element={<ShowAccountDetails />} />

                <Route path={'*'} element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
