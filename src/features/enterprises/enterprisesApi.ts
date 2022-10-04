import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { Enterprise } from 'utils/types';
import { RootState } from '../../app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const enterprisesApi = createApi({
    reducerPath: 'enterprisesApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Enterprises', 'Enterprise'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/enterprises`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        enterprises: builder.query<Enterprise[], void>({
            query: () => `/`,
            providesTags: ['Enterprises'],
            transformResponse: (response: ApiResponse<Enterprise[]>) => response.data
        }),
        enterprise: builder.query<Enterprise, number>({
            query: id => `/${id}?with=enterprise_accounts`,
            providesTags: ['Enterprise'],
            transformResponse: (response: ApiResponse<Enterprise>) => response.data
        }),
    })
});

export const {
    useEnterprisesQuery,
    useEnterpriseQuery,
} = enterprisesApi;