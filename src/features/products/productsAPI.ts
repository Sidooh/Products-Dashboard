import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse } from 'utils/types';

type DashboardData = {
    total_today: number
    total_yesterday: number
    total_transactions: number
    total_transactions_today: number
    total_revenue: number
    total_revenue_today: number
}

type RevenueDayData = {
    ALL: {
        labels: string[],
        dataset: number[]
    }
}

type RevenueData = {
    today: RevenueDayData
    yesterday: RevenueDayData
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
            // transformResponse: (response: { data: ApiResponse<DashboardData> }) => response.data.data,
        }),
        getRevenueData: builder.query<RevenueData, void>({
            query: () => '/dashboard/revenue-chart',
        }),
    })
});

export const {
    useGetDashboardQuery,
    useGetRevenueDataQuery
} = productsAPI;