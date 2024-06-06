import { ApiResponse, Status, Telco } from '@nabcellent/sui-react';
import { Product } from '@/utils/enums';
import { coreApi } from '@/services/coreApi';

export type TransactionsSLOResponse = {
    year: number;
    count: number;
    status: Status;
};

export type ProductsSLOData = {
    product: Product;
    year: number;
    slo: number;
};

export type VendorsSLOResponse = {
    tanda: number;
    payments: number;
    savings: number;
};

type ChartData = {
    count: number;
    amount: number;
    date: string;
    destination: string;
    status: Status;
};

export type TelcoChartResponse = {
    [key in Telco]: ChartData[];
};

export type ProductChartResponse = {
    [key in Product]: ChartData[];
};

export const analyticsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactionsSLO: builder.query<TransactionsSLOResponse[], boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/slo/transactions',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<TransactionsSLOResponse[]>) => res.data,
        }),
        getProductsSLO: builder.query<ProductsSLOData[], boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/slo/products',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ProductsSLOData[]>) => res.data,
        }),
        getVendorsSLO: builder.query<VendorsSLOResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/slo/vendors',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<VendorsSLOResponse>) => res.data,
        }),
        getTransactions: builder.query<ChartData[], boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/transactions',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data,
        }),
        getRevenue: builder.query<ChartData[], boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/revenue',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data,
        }),
        getTelcoTransactions: builder.query<TelcoChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/telco-transactions',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data,
        }),
        getTelcoRevenue: builder.query<TelcoChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/telco-revenue',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data,
        }),
        getProductTransactions: builder.query<ProductChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/product-transactions',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data,
        }),
        getProductRevenue: builder.query<ProductChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/analytics/product-revenue',
                params: { bypass_cache },
            }),
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data,
        }),
    }),
});

export const {
    useGetTransactionsSLOQuery,
    useGetProductsSLOQuery,
    useGetVendorsSLOQuery,
    useGetTransactionsQuery,
    useGetRevenueQuery,
    useGetTelcoTransactionsQuery,
    useGetTelcoRevenueQuery,
    useGetProductTransactionsQuery,
    useGetProductRevenueQuery,
} = analyticsApi;
