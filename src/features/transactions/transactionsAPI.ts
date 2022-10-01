import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { ApiResponse, Transaction } from 'utils/types';
import { RootState } from 'app/store';
import { Status } from 'utils/enums';

export const transactionsApi = createApi({
    reducerPath: 'transactionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Transaction'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Transaction Endpoints
        transactions: builder.query<Transaction[], Status|void>({
            query: (status?: Status) => {
                let url = '/transactions?with=account,payment';

                if(status) url += `&status=${status}`;

                return url;
            },
            transformResponse: (response: ApiResponse<Transaction[]>) => response.data,
            providesTags: ['Transaction']
        }),
        transaction: builder.query<Transaction, number>({
            query: id => `/transactions/${id}?with=account,payment,tanda_request`,
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            providesTags: ['Transaction']
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
        transactionProcess: builder.mutation<Transaction, { id: number, request_id: string }>({
            query: ({id, ...patch}) => ({
                url: `/transactions/${id}/check-request`,
                method: 'POST',
                body: patch
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        checkPayment: builder.mutation<Transaction, number>({
            query: id => ({
                url: `/transactions/${id}/check-payment`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        completePayment: builder.mutation<Transaction, number>({
            query: id => ({
                url: `/transactions/${id}/complete`,
                method: 'POST',
            }),
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            invalidatesTags: ['Transaction']
        }),
        failPayment: builder.mutation<Transaction, number>({
            query: id => ({
                url: `/transactions/${id}/fail`,
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