import {
    faBolt,
    faChalkboardUser,
    faCoins,
    faGlobe,
    faPieChart,
    faSimCard,
    faSubscript,
    faSuperscript, faBuildingUser, faUsersBetweenLines
} from '@fortawesome/free-solid-svg-icons';
import { RouteType } from "@nabcellent/sui-react";

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
                to: '/earning-accounts',
                active: true
            },
            {
                name: 'Cashbacks',
                icon: faCoins,
                to: '/cashbacks',
                active: true
            },
        ]
    },
    {
        label: 'Subscriptions',
        children: [
            {
                name: 'Subcription Types',
                icon: faSuperscript,
                to: '/subscriptions-types',
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
        label: 'Enterprise',
        children: [
            {
                name: 'All Enterprises',
                icon: faBuildingUser,
                to: '/enterprises',
                active: true
            },
            {
                name: 'Enterprise Accounts',
                icon: faUsersBetweenLines,
                to: '/enterprise-accounts',
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
                to: '/airtime-accounts',
                active: true
            },
            {
                name: 'Utility Accounts',
                icon: faBolt,
                to: '/utility-accounts',
                active: true
            },
        ]
    }
];

export default routes