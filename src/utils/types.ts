import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Status } from './enums';

export interface ApiResponse<T> {
    status: string;
    data:T
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

export type StkCallback = {
    id: string
    amount: number
    result_desc: string
    checkout_request_id: string
    created_at: string
}

export type StkRequest = {
    id: string
    checkout_request_id: string
    amount: number
    phone: number
    reference: string
    status: Status
    created_at: string
    response?: StkCallback
}

export type Payment = {
    payment_id: number
    amount: number
    type: string
    subtype: string
    status: Status
    provider?: StkRequest
}

export type TandaRequest = {
    request_id: number
    receipt_number: number
    amount: number
    provider: string
    message: string
    destination: string
    last_modified: string
    status: number
}

export type User = {
    id?: number
    name: string
    email: string
}

export type Account = {
    id?: number
    phone: number
    user?: User
}

export type Transaction = {
    id?: number
    status: Status
    description: string
    destination: string
    type: string
    amount: number
    created_at: string
    payment?: Payment
    request?: TandaRequest
    account?: Account
}

export type EarningAccount = {
    id?: number
    type: string
    self_amount: number
    invite_amount: number
}

export type Cashback = {
    id?: number
    amount: number
    type: string
    transaction?: Transaction
}

export type ProductAccount = {
    id?: number
    provider: string
    account_number: number
    priority: number
}