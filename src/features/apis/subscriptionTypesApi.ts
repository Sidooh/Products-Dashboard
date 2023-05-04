import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { SubscriptionType } from 'utils/types';
import { RootState } from 'app/store';
import { ApiResponse } from "@nabcellent/sui-react";

export const subscriptionTypesApi = createApi({
    reducerPath: 'subscriptionTypesApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['SubscriptionType'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/subscription-types`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        subscriptionTypes: builder.query<SubscriptionType[], void>({
            query: () => ``,
            providesTags: ['SubscriptionType'],
            transformResponse: (response:ApiResponse<SubscriptionType[]>) => response.data
        }),
    })
});

export const {
    useSubscriptionTypesQuery,
} = subscriptionTypesApi;