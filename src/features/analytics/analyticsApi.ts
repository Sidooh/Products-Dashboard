import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Status, Telco } from '@nabcellent/sui-react';
import { DashboardChartData } from "../products/productsAPI";
import { Product } from "../../utils/enums";

export type SLAResponse = {
    year: number,
    count: number,
    status: Status
}

export type TelcoChartResponse = {
    [key in Telco]: DashboardChartData[]
}

export type ProductChartResponse = {
    [key in Product]: DashboardChartData[]
}

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    keepUnusedDataFor: 60 * 5, // Five minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.sidooh.services.products.api.url}/analytics`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.auth?.token;

            if (token) headers.set('authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getSLA: builder.query<SLAResponse[], void>({
            query: () => '/sla',
            transformResponse: (res: ApiResponse<SLAResponse[]>) => res.data
        }),
        getTransactions: builder.query<DashboardChartData[], void>({
            query: () => '/transactions',
            transformResponse: (res: ApiResponse<DashboardChartData[]>) => res.data
        }),
        getRevenue: builder.query<DashboardChartData[], void>({
            query: () => '/revenue',
            transformResponse: (res: ApiResponse<DashboardChartData[]>) => res.data
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
    useGetSLAQuery,
    useGetTransactionsQuery,
    useGetRevenueQuery,
    useGetTelcoTransactionsQuery,
    useGetTelcoRevenueQuery,
    useGetProductTransactionsQuery,
    useGetProductRevenueQuery
} = analyticsApi;