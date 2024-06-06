import { EarningAccount } from '@/utils/types';
import { Account, ApiResponse, PaginatedResponse, PaginationState } from '@nabcellent/sui-react';
import { coreApi } from '@/services/coreApi';

type EarningAccountResponse = {
    earning_accounts: EarningAccount[];
    account: Account;
};

export const earningAccountsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        //  Earning Endpoints
        earningAccounts: builder.query<PaginatedResponse<EarningAccount[]>, PaginationState>({
            query: ({ page = 1, page_size = 100 }) => ({
                url: '/earning-accounts',
                params: { with: 'account', page, page_size },
            }),
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<PaginatedResponse<EarningAccount[]>>) => response.data,
        }),
        getEarningAccount: builder.query<EarningAccountResponse, number>({
            query: (id) => `/earning-accounts/${id}?with=account`,
            providesTags: ['EarningAccount'],
            transformResponse: (response: ApiResponse<EarningAccountResponse>) => response.data,
        }),
    }),
});

export const { useEarningAccountsQuery, useGetEarningAccountQuery } = earningAccountsApi;
