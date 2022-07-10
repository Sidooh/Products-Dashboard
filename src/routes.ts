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
                to: '/settings',
                active: true
            },
            {
                name: 'Cashbacks',
                icon: faCoins,
                to: '/settings',
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
                to: '/settings',
                active: true
            },
            {
                name: 'Subscriptions',
                icon: faSubscript,
                to: '/settings',
                active: true
            },
        ]
    },
    {
        label: 'Accounts',
        children: [
            {
                name: 'Utility Accounts',
                icon: faBolt,
                to: '/settings',
                active: true
            },
            {
                name: 'Airtime Accounts',
                icon: faSimCard,
                to: '/settings',
                active: true
            },
        ]
    }
];

export default routes