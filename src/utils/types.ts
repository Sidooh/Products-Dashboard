import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Status } from './enums';

export interface ApiResponse<T> {
    status: string;
    data: T;
}

export type ToastDataType = {
    type: 'success' | 'info' | 'warning' | 'danger';
    msg: string;
    duration?: number | undefined;
    close?: boolean | undefined;
    gravity?: 'top' | 'bottom' | undefined;
    position?: 'left' | 'center' | 'right' | undefined;
}

export type RouteChildType = {
    name: string
    active: boolean
    icon?: IconProp
    to?: string
    exact?: boolean
    badge?: {
        text?: string
        type?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark',
    }
    children?: RouteChildType[]
}

export type RouteType = {
    label: string
    labelDisable?: boolean
    children: RouteChildType[]
}

type Model = {
    id: number
    created_at: string
    updated_at: string
}

export type StkCallback = Model & {
    amount: number
    result_desc: string
    checkout_request_id: string
}

export type StkRequest = Model & {
    checkout_request_id: string
    amount: number
    phone: number
    reference: string
    status: Status
    response?: StkCallback
}

export type Payment = Model & {
    payment_id: number
    amount: number
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

export type User = Model & {
    name: string
    email: string
}

export type Account = Model & {
    phone: string
    user?: User
    user_id: number,
    status: string
}

export type Transaction = Model & {
    status: Status
    description: string
    destination: string
    product_id: 1 | 2 | 3 | 4 | 5 | 6
    type: string
    amount: number
    payment?: Payment
    tanda_request?: TandaRequest
    account: Account
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
}

export type ProductAccount = Model & {
    provider: string
    account_number: number
    priority: number
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
    voucher: Voucher,
    earningAccounts: EarningAccount[]
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
    subscription_type: SubscriptionType
}