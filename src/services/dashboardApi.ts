import { ApiResponse, ProductsTransaction as Transaction } from '@nabcellent/sui-react';
import { AnalyticsChartData } from '@/utils/types';
import { coreApi } from '@/services/coreApi';

type DashboardSummariesData = {
    total_transactions: number;
    total_transactions_today: number;
    total_revenue: number;
    total_revenue_today: number;
};

type DashboardChartData = {
    [key in 'TODAY' | 'YESTERDAY']: AnalyticsChartData[];
};

type DashboardTransactionsData = {
    recent: Transaction[];
    pending: Transaction[];
};

type ProvidersBalancesData = {
    tanda_float_balance: number;
    kyanda_float_balance: number;
    at_airtime_balance: number;
};

export const dashboardApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardChartData: builder.query<DashboardChartData, boolean>({
            query: (bypass_cache) => ({
                url: '/dashboard/chart',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<DashboardChartData>) => {
                if (!res.data.TODAY) res.data.TODAY = [];
                if (!res.data.YESTERDAY) res.data.YESTERDAY = [];

                return res.data;
            },
        }),
        getDashboardSummaries: builder.query<DashboardSummariesData, string>({
            query: (bypass_cache) => ({
                url: '/dashboard/summaries',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<DashboardSummariesData>) => res.data,
        }),
        getDashboardTransactions: builder.query<DashboardTransactionsData, void>({
            query: () => ({
                url: '/dashboard/transactions',
                params: { with: 'account,payment' },
            }),
            transformResponse: (response: ApiResponse<DashboardTransactionsData>) => response.data,
            providesTags: ['Transaction'],
        }),
        getProvidersBalances: builder.query<ProvidersBalancesData, string>({
            query: (bypass_cache) => ({
                url: '/dashboard/providers/balances',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ProvidersBalancesData>) => res.data,
        }),
    }),
});

export const {
    useGetDashboardSummariesQuery,
    useGetDashboardChartDataQuery,
    useGetDashboardTransactionsQuery,
    useGetProvidersBalancesQuery,
} = dashboardApi;
