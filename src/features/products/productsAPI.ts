import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from '../../app/store';

export const productsAPI = createApi({
    reducerPath      : 'productsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery        : fetchBaseQuery({
        baseUrl       : `${CONFIG.sidooh.services.products.api.url}`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`)

            return headers;
        }
    }),
    endpoints        : (builder) => ({
        getDashboard  : builder.query<any, void>({
            query: () => '/dashboard',
        }),
        getRevenueData: builder.query<any, void>({
            query: () => '/dashboard/revenue-chart',
        }),
    })
});

export const {
    useGetDashboardQuery,
    useGetRevenueDataQuery
} = productsAPI;