import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse } from '@nabcellent/sui-react';

type DashboardSummariesData = {
    total_transactions: number
    total_transactions_today: number
    total_revenue: number
    total_revenue_today: number
}

export type DashboardChartData = {
    status: string,
    date: number
    amount: number
}

type ProvidersBalancesData = {
    tanda_float_balance: number
    kyanda_float_balance: number
    at_airtime_balance: number
}

export const productsAPI = createApi({
    reducerPath: 'productsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getDashboardSummaries: builder.query<DashboardSummariesData, void>({
            query: () => '/dashboard',
            transformResponse: (response: ApiResponse<DashboardSummariesData>) => response.data
        }),
        getDashboardChartData: builder.query<DashboardChartData[], void>({
            query: () => '/dashboard/chart',
            transformResponse: (response: ApiResponse<DashboardChartData[]>) => response.data
        }),
        getProvidersBalances: builder.query<ProvidersBalancesData, void>({
            query: () => '/dashboard/providers/balances',
            transformResponse: (response: ApiResponse<ProvidersBalancesData>) => response.data
        })
    })
});

export const {
    useGetDashboardSummariesQuery,
    useGetDashboardChartDataQuery,
    useGetProvidersBalancesQuery
} = productsAPI;