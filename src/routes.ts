import { RouteType } from '@nabcellent/sui-react';
import {
    FaBolt,
    FaChalkboardUser,
    FaChartPie,
    FaCoins,
    FaGlobe,
    FaSimCard,
    FaSubscript,
    FaSuperscript,
} from 'react-icons/fa6';

const routes: RouteType[] = [
    {
        label: 'Dashboard',
        children: [
            {
                name: 'Dashboard',
                active: true,
                icon: FaChartPie,
                children: [
                    {
                        name: 'Home',
                        to: '/',
                        active: true,
                    },
                    {
                        name: 'Analytics',
                        to: '/dashboard/analytics',
                        active: true,
                    },
                ],
            },
        ],
    },
    {
        label: 'Transactions',
        children: [
            {
                name: 'All Transactions',
                icon: FaGlobe,
                to: '/transactions',
                active: true,
            },
        ],
    },
    {
        label: 'Earnings',
        children: [
            {
                name: 'Accounts',
                icon: FaChalkboardUser,
                to: '/earning-accounts',
                active: true,
            },
            {
                name: 'Cashbacks',
                icon: FaCoins,
                to: '/cashbacks',
                active: true,
            },
        ],
    },
    {
        label: 'Subscriptions',
        children: [
            {
                name: 'Subcription Types',
                icon: FaSuperscript,
                to: '/subscriptions-types',
                active: true,
            },
            {
                name: 'Subscriptions',
                icon: FaSubscript,
                to: '/subscriptions',
                active: true,
            },
        ],
    },
    {
        label: 'Accounts',
        children: [
            {
                name: 'Airtime Accounts',
                icon: FaSimCard,
                to: '/airtime-accounts',
                active: true,
            },
            {
                name: 'Utility Accounts',
                icon: FaBolt,
                to: '/utility-accounts',
                active: true,
            },
        ],
    },
];

export default routes;
