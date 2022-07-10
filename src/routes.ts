import { RouteType } from "utils/types";
import {
    faBolt,
    faChalkboardUser,
    faCoins,
    faGlobe,
    faPieChart,
    faSimCard,
    faSubscript,
    faSuperscript
} from '@fortawesome/free-solid-svg-icons';

const routes:RouteType[] = [
    {
        label       : 'Dashboard',
        labelDisable: true,
        children    : [
            {
                name    : 'Dashboard',
                active  : true,
                icon    : faPieChart,
                children: [
                    {
                        name  : 'Home',
                        to    : '/',
                        exact : true,
                        active: true
                    },
                ]
            }
        ]
    },
    {
        label: 'Transactions',
        children: [
            {
                name: 'All Transactions',
                icon: faGlobe,
                to: '/transactions',
                active: true,
            },
        ]
    },
    {
        label: 'Earnings',
        children: [
            {
                name: 'Accounts',
                icon: faChalkboardUser,
                to: '/earnings/accounts',
                active: true
            },
            {
                name: 'Cashbacks',
                icon: faCoins,
                to: '/earnings/cashbacks',
                active: true
            },
        ]
    },
    {
        label: 'Subscriptions',
        children: [
            {
                name: 'Sub Types',
                icon: faSuperscript,
                to: '/subscriptions/types',
                active: true
            },
            {
                name: 'Subscriptions',
                icon: faSubscript,
                to: '/subscriptions',
                active: true
            },
        ]
    },
    {
        label: 'Accounts',
        children: [
            {
                name: 'Airtime Accounts',
                icon: faSimCard,
                to: '/accounts/airtime',
                active: true
            },
            {
                name: 'Utility Accounts',
                icon: faBolt,
                to: '/accounts/utility',
                active: true
            },
        ]
    }
];

export default routes