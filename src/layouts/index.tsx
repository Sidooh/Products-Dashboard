import { lazy, memo, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Middleware } from '../middleware';
import MainLayout from './MainLayout';
import GuestLayout from './GuestLayout';
import { is } from 'utils/helpers';
import SettingsToggle from 'components/settings-panel/SettingsToggle';
import SettingsPanel from 'components/settings-panel/SettingsPanel';
import ShowAccountDetails from "../pages/dashboards/account";

const Login = lazy(() => import('pages/auth/Login'));
const Dashboard = lazy(() => import('pages/dashboards/default'));
const Analytics = lazy(() => import('pages/dashboards/analytics'));
const Transactions = lazy(() => import('pages/transactions'));
const ShowTransaction = lazy(() => import('pages/transactions/Show'));
const EarningAccounts = lazy(() => import('pages/earnings/EarningAccounts'));
const Cashbacks = lazy(() => import('pages/earnings/Cashbacks'));
const Subscriptions = lazy(() => import('pages/subscriptions'));
const SubscriptionTypes = lazy(() => import('pages/subscriptions/SubscriptionTypes'));
const Accounts = lazy(() => import('pages/accounts'));

const Layout = () => {
    const HTMLClassList = document.getElementsByTagName('html')[0].classList;

    useEffect(() => {
        if (is.windows()) HTMLClassList.add('windows');
        if (is.chrome()) HTMLClassList.add('chrome');
        if (is.firefox()) HTMLClassList.add('firefox');
    }, [HTMLClassList]);

    return (
        <>
            <Routes>
                <Route element={<GuestLayout/>}>
                    <Route path={'/login'} element={<Middleware.Guest component={<Login/>}/>}/>
                </Route>

                <Route element={<Middleware.Auth component={<MainLayout/>}/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path={'/dashboard'} element={<Dashboard/>}/>
                    <Route path={'/dashboard/analytics'} element={<Analytics/>}/>

                    <Route path={'/transactions'} element={<Transactions/>}/>
                    <Route path={'/transactions/:id'} element={<ShowTransaction/>}/>

                    <Route path={'/earnings/accounts'} element={<EarningAccounts/>}/>
                    <Route path={'/earnings/cashbacks'} element={<Cashbacks/>}/>

                    <Route path={'/subscriptions'} element={<Subscriptions/>}/>
                    <Route path={'/subscriptions-types'} element={<SubscriptionTypes/>}/>

                    <Route path={'/accounts/:product'} element={<Accounts/>}/>

                    <Route path={'/accounts/:id/details'} element={<ShowAccountDetails/>}/>

                    <Route path={'*'} element={<Dashboard/>}/>
                </Route>
            </Routes>
            <SettingsToggle/>
            <SettingsPanel/>
        </>
    );
};

export default memo(Layout);