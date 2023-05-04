import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { Subscription } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const subscriptionsAPI = createApi({
    reducerPath: 'subscriptionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Subscription'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/subscriptions`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        //  Earning Endpoints
        subscriptions: builder.query<Subscription[], void>({
            query: () => '?with=account',
            providesTags: ['Subscription'],
            transformResponse: (response:ApiResponse<Subscription[]>) => response.data
        })
    })
});

export const {
    useSubscriptionsQuery,
} = subscriptionsAPI;