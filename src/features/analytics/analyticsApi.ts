import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Status, Telco } from '@nabcellent/sui-react';
import { Product } from "../../utils/enums";

export type TransactionsSLOsResponse = {
    year: number,
    count: number,
    status: Status
}

export type ProductsSLOsResponse = {
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
        getTransactionsSLOs: builder.query<TransactionsSLOsResponse[], void>({
            query: () => '/slo/transactions',
            transformResponse: (res: ApiResponse<TransactionsSLOsResponse[]>) => res.data
        }),
        getProductsSLOs: builder.query<ProductsSLOsResponse, void>({
            query: () => '/slo/products',
            transformResponse: (res: ApiResponse<ProductsSLOsResponse>) => res.data
        }),
        getTransactions: builder.query<ChartData[], void>({
            query: () => '/transactions',
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data
        }),
        getRevenue: builder.query<ChartData[], void>({
            query: () => '/revenue',
            transformResponse: (res: ApiResponse<ChartData[]>) => res.data
        }),
        getTelcoTransactions: builder.query<TelcoChartResponse, void>({
            query: () => '/telco-transactions',
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data
        }),
        getTelcoRevenue: builder.query<TelcoChartResponse, void>({
            query: () => '/telco-revenue',
            transformResponse: (res: ApiResponse<TelcoChartResponse>) => res.data
        }),
        getProductTransactions: builder.query<ProductChartResponse, void>({
            query: () => '/product-transactions',
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data
        }),
        getProductRevenue: builder.query<ProductChartResponse, void>({
            query: () => '/product-revenue',
            transformResponse: (res: ApiResponse<ProductChartResponse>) => res.data
        })
    })
});

export const {
    useGetTransactionsSLOsQuery,
    useGetProductsSLOsQuery,
    useGetTransactionsQuery,
    useGetRevenueQuery,
    useGetTelcoTransactionsQuery,
    useGetTelcoRevenueQuery,
    useGetProductTransactionsQuery,
    useGetProductRevenueQuery
} = analyticsApi;