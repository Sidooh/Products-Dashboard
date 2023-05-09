import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse } from '@nabcellent/sui-react';
import { AnalyticsChartData, Transaction } from "../../utils/types";

type DashboardSummariesData = {
    total_transactions: number
    total_transactions_today: number
    total_revenue: number
    total_revenue_today: number
}

type DashboardChartData = {
    [key in 'TODAY' | 'YESTERDAY']: AnalyticsChartData[]
}

type DashboardTransactionsData = {
    recent: Transaction[]
    pending: Transaction[]
}

type ProvidersBalancesData = {
    tanda_float_balance: number
    kyanda_float_balance: number
    at_airtime_balance: number
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    tagTypes: ['Transaction'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/dashboard`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getDashboardChartData: builder.query<DashboardChartData, boolean>({
            query: (bypass_cache) => ({
                url: '/chart',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<DashboardChartData>) => {
                if (!res.data.TODAY) res.data.TODAY = []
                if (!res.data.YESTERDAY) res.data.YESTERDAY = []

                return res.data
            }
        }),
        getDashboardSummaries: builder.query<DashboardSummariesData, string>({
            query: (bypass_cache) => ({
                url: '/summaries',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<DashboardSummariesData>) => res.data
        }),
        getDashboardTransactions: builder.query<DashboardTransactionsData, void>({
            query: () => ({
                url: '/transactions',
                params: { with: 'account,payment' }
            }),
            transformResponse: (response: ApiResponse<DashboardTransactionsData>) => response.data,
            providesTags: ['Transaction']
        }),
        getProvidersBalances: builder.query<ProvidersBalancesData, string>({
            query: (bypass_cache) => ({
                url: '/providers/balances',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ProvidersBalancesData>) => res.data
        })
    })
});

export const {
    useGetDashboardSummariesQuery,
    useGetDashboardChartDataQuery,
    useGetDashboardTransactionsQuery,
    useGetProvidersBalancesQuery
} = dashboardApi;