import { Account, Model, Status } from '@nabcellent/sui-react';

export type Payment = Model & {
    payment_id: number
    amount: number
    charge: number
    type: string
    subtype: string
    status: Status
    transaction_id: number
}

export type TandaRequest = Model & {
    request_id: number
    receipt_number: number
    amount: number
    provider: string
    message: string
    destination: string
    last_modified: string
    status: number
}

export type Transaction = Model & {
    status: Status
    description: string
    destination: string
    product_id: 1 | 2 | 3 | 4 | 5 | 6
    type: string
    amount: number
    charge: number
    payment?: Payment
    tanda_requests?: TandaRequest[]
    savings_transaction?: SavingsTransaction
    account: Account
}

export type SavingsTransaction = Model & {
    savings_id: number
    amount: number
    description: string
    type: string
    status: Status
    transaction: Transaction
}

export type EarningAccount = Model & {
    account_id: number
    type: string
    self_amount: number
    invite_amount: number
    account?: Account
}

export type Cashback = Model & {
    amount: number
    type: string
    transaction?: Transaction
    account?: Account
}

export type ProductAccount = Model & {
    provider: string
    account_number: number
    priority: number
    account: Account
}

export type Voucher = Model & {
    type: string
    balance: number
}

export type AccountDetails = {
    account: Account
    totalTransactionsToday: number
    totalTransactionsWeek: number
    totalTransactionsMonth: number
    totalTransactions: number
    totalRevenueToday: number
    totalRevenueWeek: number
    totalRevenueMonth: number
    totalRevenue: number
    recentTransactions: Transaction[]
    vouchers: Voucher[],
    earningAccounts: EarningAccount[]
    subscriptions: Subscription[]
}

export type SubscriptionType = Model & {
    title: string
    price: number
    duration: number
    period: string
}

export type Subscription = Model & {
    amount: number
    start_date: string
    end_date: string
    account: Account
    status: Status
    subscription_type: SubscriptionType
}

export type AnalyticsChartData = {
    status: Status,
    date: number
    amount: number
    count: number
}

export interface PaginationState {
    page: number;
    page_size: number;
}

export interface PaginatedResponse<T> {
    data: T,
    current_page: number
    last_page:number
    per_page: number
    total: number
    from: number
    to: number
}