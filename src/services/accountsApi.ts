import { AccountDetails } from '@/utils/types';
import { ApiResponse, PaginatedResponse, PaginationState, ProductAccount } from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

export const accountsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        //  Earning Endpoints
        airtimeAccounts: builder.query<PaginatedResponse<ProductAccount[]>, PaginationState>({
            query: ({ page, page_size }) => ({
                url: `/airtime/accounts`,
                params: { with: 'account', page, page_size },
            }),
            providesTags: ['AirtimeAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<ProductAccount[]>>) => response.data,
        }),
        utilityAccounts: builder.query<PaginatedResponse<ProductAccount[]>, PaginationState>({
            query: ({ page, page_size }) => ({
                url: `/utility/accounts`,
                params: { with: 'account', page, page_size },
            }),
            providesTags: ['UtilityAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<ProductAccount[]>>) => response.data,
        }),
        account: builder.query<AccountDetails, number>({
            query: (id) => `/accounts/${id}/details`,
            transformResponse: (response: ApiResponse<AccountDetails>) => response.data,
        }),
    }),
});

export const { useAccountQuery, useAirtimeAccountsQuery, useUtilityAccountsQuery } = accountsApi;
