import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { transactionsApi } from '@/services/transactionsApi';
import { dashboardApi } from '@/services/dashboardApi';
import { earningAccountsApi } from '@/services/earningAccountsApi';
import { subscriptionsApi } from '@/services/subscriptionsApi';
import { accountsApi } from '@/services/accountsApi';
import { cashbacksApi } from '@/services/cashbacksApi';
import { subscriptionTypesApi } from '@/services/subscriptionTypesApi';
import { analyticsApi } from '@/services/analyticsApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,

        [transactionsApi.reducerPath]: transactionsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [earningAccountsApi.reducerPath]: earningAccountsApi.reducer,
        [subscriptionTypesApi.reducerPath]: subscriptionTypesApi.reducer,
        [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [cashbacksApi.reducerPath]: cashbacksApi.reducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            transactionsApi.middleware,
            dashboardApi.middleware,
            earningAccountsApi.middleware,
            subscriptionTypesApi.middleware,
            subscriptionsApi.middleware,
            accountsApi.middleware,
            cashbacksApi.middleware,
            analyticsApi.middleware
        ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
