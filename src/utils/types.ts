import { Account, Model, ProductsTransaction, Status, Voucher, Subscription } from '@nabcellent/sui-react';

export type EarningAccount = Model & {
    account_id: number;
    type: string;
    self_amount: number;
    invite_amount: number;
    account?: Account;
};

export type AccountDetails = {
    account: Account;
    totalTransactionsToday: number;
    totalTransactionsWeek: number;
    totalTransactionsMonth: number;
    totalTransactions: number;
    totalRevenueToday: number;
    totalRevenueWeek: number;
    totalRevenueMonth: number;
    totalRevenue: number;
    recentTransactions: ProductsTransaction[];
    vouchers: Voucher[];
    earningAccounts: EarningAccount[];
    subscriptions: Subscription[];
};

export type AnalyticsChartData = {
    status: Status;
    date: number;
    amount: number;
    count: number;
};
