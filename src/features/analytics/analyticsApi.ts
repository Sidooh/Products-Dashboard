import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from 'config';
import { RootState } from 'app/store';
import { ApiResponse, Status } from '@nabcellent/sui-react';

export type SLAResponse = {
    year: number,
    count: number,
    status: Status
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
            transformResponse: (response: ApiResponse<SLAResponse[]>) => response.data
        }),
    })
});

export const {
    useGetSLAQuery,
} = analyticsApi;