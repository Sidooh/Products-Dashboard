import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Status, Telco } from '@nabcellent/sui-react';
import { Product } from "../../utils/enums";

export type TransactionsSLOResponse = {
    year: number,
    count: number,
    status: Status
}

export type ProductsSLOData = {
    product: Product
    year: number,
    slo: number,
}

export type VendorsSLOResponse = {
    tanda: number,
    payments: number,
    savings: number
}

type ChartData = {
    count: number
    amount: number
    date: string
    destination: string
    status: Status
}

export type TelcoChartResponse = {
    [key in Telco]: ChartData[]
}

export type ProductChartResponse = {
    [key in Product]: ChartData[]
}

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/analytics`,
        prepareHeaders: async (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            // await new Promise(resolve => setTimeout(resolve, 3000));

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getTransactionsSLO: builder.query<TransactionsSLOResponse[], boolean>({
            query: (bypass_cache) => ({
                url: '/slo/transactions',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<TransactionsSLOResponse[]>) => res.data
        }),
        getProductsSLO: builder.query<ProductsSLOData[], boolean>({
            query: (bypass_cache) => ({
                url: '/slo/products',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ProductsSLOData[]>) => res.data
        }),
        getVendorsSLO: builder.query<VendorsSLOResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/slo/vendors',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<VendorsSLOResponse>) => res.data
        }),
        getTransactions: builder.query<ChartData[], boolean>({
            query: (bypass_cache) => ({
                url: '/transactions',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data
        }),
        getRevenue: builder.query<ChartData[], boolean>({
            query: (bypass_cache) => ({
                url: '/revenue',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data
        }),
        getTelcoTransactions: builder.query<TelcoChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/telco-transactions',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data
        }),
        getTelcoRevenue: builder.query<TelcoChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/telco-revenue',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data
        }),
        getProductTransactions: builder.query<ProductChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/product-transactions',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data
        }),
        getProductRevenue: builder.query<ProductChartResponse, boolean>({
            query: (bypass_cache) => ({
                url: '/product-revenue',
                params: { bypass_cache }
            }),
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data
        })
    })
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
    useGetProductRevenueQuery
} = analyticsApi;