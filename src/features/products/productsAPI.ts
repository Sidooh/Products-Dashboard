import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse } from '@nabcellent/sui-react';
import { AnalyticsChartData } from "../../utils/types";

type DashboardSummariesData = {
    total_transactions: number
    total_transactions_today: number
    total_revenue: number
    total_revenue_today: number
}

type DashboardChartData = string[] | {
    [key in 'TODAY' | 'YESTERDAY']: AnalyticsChartData[]
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
            transformResponse: (res: ApiResponse<DashboardSummariesData>) => res.data
        }),
        getDashboardChartData: builder.query<DashboardChartData, void>({
            query: () => '/dashboard/chart',
            transformResponse: (res: ApiResponse<DashboardChartData>) => !Array.isArray(res.data) ? res.data : {
                TODAY: [],
                YESTERDAY: []
            }
        }),
        getProvidersBalances: builder.query<ProvidersBalancesData, void>({
            query: () => '/dashboard/providers/balances',
            transformResponse: (res: ApiResponse<ProvidersBalancesData>) => res.data
        })
    })
});

export const {
    useGetDashboardSummariesQuery,
    useGetDashboardChartDataQuery,
    useGetProvidersBalancesQuery
} = productsAPI;