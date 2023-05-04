import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { Cashback, PaginatedResponse, PaginationState } from 'utils/types';
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
        cashbacks: builder.query<PaginatedResponse<Cashback[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/',
                params: { with: 'account', page, page_size }
            }),
            providesTags: ['Cashback'],
            transformResponse: (response: ApiResponse<PaginatedResponse<Cashback[]>>) => response.data
        }),
    })
});

export const {
    useCashbacksQuery,
} = cashbacksApi;