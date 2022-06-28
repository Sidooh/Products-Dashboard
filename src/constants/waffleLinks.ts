import { CONFIG } from 'config';

export type WaffleLinkType = {
    avatar?: string
    avatarText?: string
    title?: string
    link?: string
    img?: string
    hr?: boolean
    contentClass?: string
    enabled?: boolean
}

export const waffleLinks: WaffleLinkType[] = [
    {
        avatarText: 'A',
        title: 'Accounts',
        link: CONFIG.sidooh.services.accounts.dashboard.url,
        contentClass: 'bg-soft-primary text-primary',
    },
    {
        avatarText: 'E',
        title: 'Enterprise',
        link: `/events/event-detail`,
        contentClass: 'bg-soft-primary text-primary',
    },
    {
        avatarText: 'L',
        title: 'Legacy',
        link: CONFIG.sidooh.services.legacy.url,
        contentClass: 'bg-soft-primary text-primary',
        enabled:true
    },
    {
        avatarText: 'N',
        title: 'Notify',
        link: CONFIG.sidooh.services.notify.dashboard.url,
        contentClass: 'bg-soft-primary text-primary',
        enabled:true
    },
    {
        avatarText: 'p',
        title: 'Payments',
        link: CONFIG.sidooh.services.payments.dashboard.url,
        contentClass: 'bg-soft-primary text-primary',
    },
    {
        avatarText: 'S',
        title: 'Savings',
        link: `/events/event-detail`,
        contentClass: 'bg-soft-primary text-primary',
    },
    {
        avatarText: 'U',
        title: 'USSD',
        link: `/events/event-detail`,
        contentClass: 'bg-soft-primary text-primary',
    },
    /*{
        avatar: account,
        title: 'Account',
        link: `/user/profile`
    },*/
];
