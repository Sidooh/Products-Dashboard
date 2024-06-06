import { ApiResponse, SubscriptionType } from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

export const subscriptionTypesApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        subscriptionTypes: builder.query<SubscriptionType[], void>({
            query: () => `/subscription-types`,
            providesTags: ['SubscriptionType'],
            transformResponse: (response: ApiResponse<SubscriptionType[]>) => response.data,
        }),
    }),
});

export const { useSubscriptionTypesQuery } = subscriptionTypesApi;
