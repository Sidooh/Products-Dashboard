import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { EnterpriseAccount } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const enterpriseAccountsApi = createApi({
    reducerPath: 'enterpriseAccountsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['EnterpriseAccount'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/enterprise-accounts`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        enterpriseAccounts: builder.query<EnterpriseAccount[], void>({
            query: () => `?with=account`,
            providesTags: ['EnterpriseAccount'],
            transformResponse: (response: ApiResponse<EnterpriseAccount[]>) => response.data
        }),
    })
});

export const {
    useEnterpriseAccountsQuery,
} = enterpriseAccountsApi;