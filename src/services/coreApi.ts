import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { RootState } from '@/app/store';

export const coreApi = createApi({
    reducerPath: 'coreApi',
    keepUnusedDataFor: 60 * 7, // Seven minutes
    tagTypes: [
        'Transaction',
        'AirtimeAccount',
        'UtilityAccount',
        'Cashback',
        'EarningAccount',
        'Subscription',
        'SubscriptionType',
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.services.products.api.url}`,
        prepareHeaders: async (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;

            if (!CONFIG.services.products.api.url) throw new Error('Products Api URL Env is not set!');

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: () => ({}),
});
