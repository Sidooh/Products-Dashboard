import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { TransactionType } from 'utils/types';

export const transactionsApi = createApi({
    reducerPath: 'transactionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Transaction'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
    }),
    endpoints: (builder) => ({
        //  Transaction Endpoints
        transactions: builder.query<TransactionType[], void>({
            query: () => '/transactions?with=account,payment',
            providesTags: ['Transaction']
        }),
        transaction: builder.query<TransactionType, string>({
            query: id => `/transactions/${id}?with_payment=true`,
            providesTags: ['Transaction']
        }),
    })
});

export const {
    useTransactionsQuery,
    useTransactionQuery,
} = transactionsApi;