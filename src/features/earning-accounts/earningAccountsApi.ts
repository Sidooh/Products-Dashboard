import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { ApiResponse, EarningAccount } from 'utils/types';
import { RootState } from 'app/store';

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
        earningAccounts: builder.query<EarningAccount[], void>({
            query: () => '?with=account',
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<EarningAccount[]>) => response.data
        }),
        getEarningAccount: builder.query<EarningAccount, number>({
            query: (id) => `/${id}?with=account`,
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<EarningAccount>) => response.data
        })
    })
});

export const {
    useEarningAccountsQuery,
    useGetEarningAccountQuery
} = earningAccountsApi;