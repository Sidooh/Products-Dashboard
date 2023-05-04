import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { PaginatedResponse, PaginationState, Transaction } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from '@nabcellent/sui-react';

export const transactionsApi = createApi({
    reducerPath: 'transactionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Transaction'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/transactions`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Transaction Endpoints
        transactions: builder.query<PaginatedResponse<Transaction[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/',
                params: { with: 'account,payment', page, page_size }
            }),
            transformResponse: (response: ApiResponse<PaginatedResponse<Transaction[]>>) => response.data,
            providesTags: ['Transaction']
        }),
        transaction: builder.query<Transaction, number>({
            query: id => `/${id}?with=account,payment,tanda_request`,
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            providesTags: ['Transaction']
        }),
        transactionRetry: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/${id}/retry`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        transactionRefund: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `/${id}/refund`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction'],
        }),
        transactionProcess: builder.mutation<Transaction, { id: number, request_id: string }>({
            query: ({ id, ...patch }) => ({
                url: `/${id}/check-request`,
                method: 'POST',
                body: patch
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        checkPayment: builder.mutation<Transaction, { id: number, payment_id?: number }>({
            query: ({ id, payment_id }) => ({
                url: `/${id}/check-payment?payment_id=${payment_id}`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        completePayment: builder.mutation<Transaction, number>({
            query: id => ({
                url: `/${id}/complete`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        failPayment: builder.mutation<Transaction, number>({
            query: id => ({
                url: `/${id}/fail`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
    })
});

export const {
    useTransactionsQuery,
    useTransactionQuery,
    useTransactionProcessMutation,
    useTransactionRetryMutation,
    useTransactionRefundMutation,
    useCheckPaymentMutation,
    useCompletePaymentMutation,
    useFailPaymentMutation
} = transactionsApi;