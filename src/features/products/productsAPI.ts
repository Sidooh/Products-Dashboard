import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';

export const productsAPI = createApi({
    reducerPath: 'productsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query<any, void>({
            query:() => '/dashboard',
        }),
        getRevenueData: builder.query<any, void>({
            query:() => '/dashboard/revenue-chart',
        }),
    })
});

export const {
    useGetDashboardQuery,
} = productsAPI;