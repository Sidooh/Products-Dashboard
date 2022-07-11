import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { Transaction } from 'utils/types';
import { RootState } from '../../app/store';

export const transactionsApi = createApi({
    reducerPath: 'transactionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Transaction'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`)

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Transaction Endpoints
        transactions: builder.query<Transaction[], void>({
            query: () => '/transactions?with=account,payment',
            providesTags: ['Transaction']
        }),
        transaction: builder.query<Transaction, string>({
            query: id => `/transactions/${id}?with=account,payment,tanda_request`,
            providesTags: ['Transaction']
        }),
    })
});

export const {
    useTransactionsQuery,
    useTransactionQuery,
} = transactionsApi;