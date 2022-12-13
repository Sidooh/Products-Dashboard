import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { AccountDetails, ProductAccount } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const accountsAPI = createApi({
    reducerPath: 'accountsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Account'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/accounts`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Earning Endpoints
        accounts: builder.query<ApiResponse<ProductAccount[]>, 'airtime' | 'utility'>({
            query: product => `/${product}-accounts?with=account`,
            providesTags: ['Account']
        }),
        account: builder.query<AccountDetails, number>({
            query: id => `/${id}/details`,
            transformResponse: (response: ApiResponse<AccountDetails>) => response.data,
        }),
    })
});

export const {
    useAccountQuery,
    useAccountsQuery,
} = accountsAPI;