import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { EarningAccount, PaginatedResponse, PaginationState } from 'utils/types';
import { RootState } from 'app/store';
import { Account, ApiResponse } from "@nabcellent/sui-react";

type EarningAccountResponse = {
    earning_accounts: EarningAccount[]
    account: Account
}

export const earningAccountsApi = createApi({
    reducerPath: 'earningAccountsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['EarningAccount'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/earning-accounts`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Earning Endpoints
        earningAccounts: builder.query<PaginatedResponse<EarningAccount[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/',
                params: { with: 'account', page, page_size }
            }),
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<EarningAccount[]>>) => response.data
        }),
        getEarningAccount: builder.query<EarningAccountResponse, number>({
            query: (id) => `/${id}?with=account`,
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<EarningAccountResponse>) => response.data
        })
    })
});

export const {
    useEarningAccountsQuery,
    useGetEarningAccountQuery
} = earningAccountsApi;