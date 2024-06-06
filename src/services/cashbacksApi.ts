import { ApiResponse, Cashback, PaginatedResponse, PaginationState } from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

export const cashbacksApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        cashbacks: builder.query<PaginatedResponse<Cashback[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/cashbacks',
                params: { with: 'account', page, page_size },
            }),
            providesTags: ['Cashback'],
            transformResponse: (response: ApiResponse<PaginatedResponse<Cashback[]>>) => response.data,
        }),
    }),
});

export const { useCashbacksQuery } = cashbacksApi;
