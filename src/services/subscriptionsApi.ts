import { ApiResponse, PaginatedResponse, PaginationState, Subscription } from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

export const subscriptionsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        //  Earning Endpoints
        subscriptions: builder.query<PaginatedResponse<Subscription[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/subscriptions',
                params: { with: 'account', page, page_size },
            }),
            providesTags: ['Subscription'],
            transformResponse: (response: ApiResponse<PaginatedResponse<Subscription[]>>) => response.data,
        }),
    }),
});

export const { useSubscriptionsQuery } = subscriptionsApi;
