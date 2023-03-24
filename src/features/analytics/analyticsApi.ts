import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Status, Telco } from '@nabcellent/sui-react';
import { DashboardChartData } from "../products/productsAPI";

export type SLAResponse = {
    year: number,
    count: number,
    status: Status
}

export type TelcoTransactionResponse = {
    [key in Telco]: DashboardChartData[]
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
        getTelcoTransactions: builder.query<TelcoTransactionResponse, void>({
            query: () => '/telco-transactions',
            transformResponse: (res: ApiResponse<TelcoTransactionResponse>) => res.data
        }),
        getTelcoRevenue: builder.query<TelcoTransactionResponse, void>({
            query: () => '/telco-revenue',
            transformResponse: (res: ApiResponse<TelcoTransactionResponse>) => res.data
        })
    })
});

export const {
    useGetSLAQuery,
    useGetTransactionsQuery,
    useGetRevenueQuery,
    useGetTelcoTransactionsQuery,
    useGetTelcoRevenueQuery
} = analyticsApi;