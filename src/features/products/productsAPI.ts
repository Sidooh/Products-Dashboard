import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Transaction } from 'utils/types';

type DashboardData = {
    total_today: number
    total_yesterday: number
    total_transactions: number
    total_transactions_today: number
    total_revenue: number
    total_revenue_today: number
    pending_transactions: Transaction[]
    recent_transactions: Transaction[]
}

export const productsAPI = createApi({
    reducerPath: 'productsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query<ApiResponse<DashboardData>, void>({
            query: () => '/dashboard',
        }),
        getRevenueData: builder.query<ApiResponse<any>, void>({
            query: () => '/dashboard/revenue-chart',
        }),
    })
});

export const {
    useGetDashboardQuery,
    useGetRevenueDataQuery
} = productsAPI;