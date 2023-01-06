import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { Cashback } from 'utils/types';
import { RootState } from '../../app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const cashbacksApi = createApi({
    reducerPath: 'cashbacksApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Cashback'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/cashbacks`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        cashbacks: builder.query<Cashback[], void>({
            query: () => `?with=account`,
            providesTags: ['Cashback'],
            transformResponse: (response: ApiResponse<Cashback[]>) => response.data
        }),
    })
});

export const {
    useCashbacksQuery,
} = cashbacksApi;