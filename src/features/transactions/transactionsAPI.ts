import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { ApiResponse, Transaction } from 'utils/types';
import { RootState } from 'app/store';

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
        transactions: builder.query<ApiResponse<Transaction[]>, void>({
            query: () => '/transactions?with=account,payment',
            providesTags: ['Transaction']
        }),
        transaction: builder.query<Transaction, number>({
            query: id => `/transactions/${id}?with=account,payment,tanda_request`,
            transformResponse: (response: ApiResponse<Transaction>) => response.data,
            providesTags: ['Transaction']
        }),
        transactionProcess: builder.mutation<ApiResponse<Transaction>, { id: number, request_id: string }>({
            query: ({id, ...patch}) => ({
                url: `/transactions/${id}/process`,
                method: 'POST',
                body: patch
            }),
            transformResponse: (response: { data: ApiResponse<Transaction> }) => response.data,
            invalidatesTags: ['Transaction']
        }),

        checkPayment: builder.mutation<ApiResponse<Transaction>, { id: number }>({
            query: ({id, ...patch}) => ({
                url: `/transactions/${id}/check-payment`,
                method: 'POST',
                body: patch
            }),
            transformResponse: (response: { data: ApiResponse<Transaction> }) => response.data,
            invalidatesTags: ['Transaction']
        }),

    })
});

export const {
    useTransactionsQuery,
    useTransactionQuery,
    useTransactionProcessMutation,
    useCheckPaymentMutation
} = transactionsApi;