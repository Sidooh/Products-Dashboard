import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { EarningAccount, Cashback, ApiResponse } from 'utils/types';
import { RootState } from '../../app/store';

export const earningsAPI = createApi({
    reducerPath: 'earningsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['EarningAccount', 'Cashback'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/earnings`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Earning Endpoints
        earningAccounts: builder.query<ApiResponse<EarningAccount[]>, void>({
            query: () => '/accounts?with=account',
            providesTags: ['EarningAccount']
        }),
        cashbacks: builder.query<ApiResponse<Cashback[]>, void>({
            query: () => `/cashbacks`,
            providesTags: ['Cashback']
        }),
    })
});

export const {
    useEarningAccountsQuery,
    useCashbacksQuery,
} = earningsAPI;