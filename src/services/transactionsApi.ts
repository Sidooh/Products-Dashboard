import {
    ApiResponse,
    PaginatedResponse,
    PaginationState,
    ProductsTransaction as Transaction,
} from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

export const transactionsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        //  Transaction Endpoints
        transactions: builder.query<PaginatedResponse<Transaction[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/transactions/',
                params: { with: 'account,payment', page, page_size },
            }),
            transformResponse: (response: ApiResponse<PaginatedResponse<Transaction[]>>) => response.data,
            providesTags: ['Transaction'],
        }),
        transaction: builder.query<Transaction, number>({
            query: (id) => `/transactions/${id}?with=account,payment,tanda_request`,
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            providesTags: ['Transaction'],
        }),
        transactionRetry: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/transactions/${id}/retry`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        transactionRefund: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/transactions/${id}/refund`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        transactionProcess: builder.mutation<Transaction, { id: number; request_id: string }>({
            query: ({ id, ...patch }) => ({
                url: `/transactions/${id}/check-request`,
                method: 'POST',
                body: patch,
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        checkPayment: builder.mutation<Transaction, { id: number; payment_id?: number }>({
            query: ({ id, payment_id }) => ({
                url: `/transactions/${id}/check-payment?payment_id=${payment_id}`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        completePayment: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/transactions/${id}/complete`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        failPayment: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/transactions/${id}/fail`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
    }),
});

export const {
    useTransactionsQuery,
    useTransactionQuery,
    useTransactionProcessMutation,
    useTransactionRetryMutation,
    useTransactionRefundMutation,
    useCheckPaymentMutation,
    useCompletePaymentMutation,
    useFailPaymentMutation,
} = transactionsApi;
