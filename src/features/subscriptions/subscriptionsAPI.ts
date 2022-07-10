import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { EarningAccount, Cashback } from 'utils/types';
import { RootState } from 'app/store';

export const subscriptionsAPI = createApi({
    reducerPath: 'subscriptionsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Subscription', 'SubscriptionType'],
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
        subscriptions: builder.query<EarningAccount[], void>({
            query: () => '?with=account',
            providesTags: ['Subscription']
        }),
        subscriptionTypes: builder.query<Cashback[], void>({
            query: () => `/subscription-types`,
            providesTags: ['SubscriptionType']
        }),
    })
});

export const {
    useSubscriptionsQuery,
    useSubscriptionTypesQuery,
} = subscriptionsAPI;