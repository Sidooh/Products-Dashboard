import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { AccountDetails, PaginatedResponse, PaginationState, ProductAccount } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['AirtimeAccount', 'UtilityAccount'],
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.sidooh.services.products.api.url,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Earning Endpoints
        airtimeAccounts: builder.query<PaginatedResponse<ProductAccount[]>, PaginationState>({
            query: ({ page, page_size }) => ({
                url: `/airtime/accounts`,
                params: { with: 'account', page, page_size }
            }),
            providesTags: ['AirtimeAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<ProductAccount[]>>) => response.data
        }),
        utilityAccounts: builder.query<PaginatedResponse<ProductAccount[]>, PaginationState>({
            query: ({ page, page_size }) => ({
                url: `/utility/accounts`,
                params: { with: 'account', page, page_size }
            }),
            providesTags: ['UtilityAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<ProductAccount[]>>) => response.data
        }),
        account: builder.query<AccountDetails, number>({
            query: id => `/accounts/${id}/details`,
            transformResponse: (response: ApiResponse<AccountDetails>) => response.data,
        }),
    })
});

export const {
    useAccountQuery,
    useAirtimeAccountsQuery,
    useUtilityAccountsQuery
} = accountsApi;