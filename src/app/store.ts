import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from 'features/auth/authSlice';
import themeReducer from 'features/theme/themeSlice';
import { transactionsApi } from 'features/transactions/transactionsAPI';
import { dashboardApi } from 'features/dashboard/dashboardApi';
import { earningAccountsApi } from 'features/earning-accounts/earningAccountsApi';
import { subscriptionsAPI } from 'features/subscriptions/subscriptionsAPI';
import { accountsAPI } from 'features/accounts/accountsAPI';
import { cashbacksApi } from 'features/cashbacks/cashbacksApi';
import { subscriptionTypesApi } from 'features/subscription-types/subscriptionTypesApi';
import { analyticsApi } from "../features/analytics/analyticsApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,

        [transactionsApi.reducerPath]: transactionsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [earningAccountsApi.reducerPath]: earningAccountsApi.reducer,
        [subscriptionTypesApi.reducerPath]: subscriptionTypesApi.reducer,
        [subscriptionsAPI.reducerPath]: subscriptionsAPI.reducer,
        [accountsAPI.reducerPath]: accountsAPI.reducer,
        [cashbacksApi.reducerPath]: cashbacksApi.reducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware()
        .concat(
            transactionsApi.middleware,
            dashboardApi.middleware,
            earningAccountsApi.middleware,
            subscriptionTypesApi.middleware,
            subscriptionsAPI.middleware,
            accountsAPI.middleware,
            cashbacksApi.middleware,
            analyticsApi.middleware,
        )
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
