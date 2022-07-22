import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { ApiResponse, ProductAccount } from 'utils/types';
import { RootState } from 'app/store';

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
        accounts: builder.query<ApiResponse<ProductAccount[]>, string>({
            query: product => `/${product}-accounts?with=account`,
            providesTags: ['Account']
        }),
    })
});

export const {
    useAccountsQuery,
} = accountsAPI;