import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from 'features/slices/authSlice';
import themeReducer from 'features/slices/themeSlice';
import { transactionsApi } from 'features/apis/transactionsApi';
import { dashboardApi } from 'features/apis/dashboardApi';
import { earningAccountsApi } from 'features/apis/earningAccountsApi';
import { subscriptionsAPI } from 'features/apis/subscriptionsAPI';
import { accountsAPI } from 'features/apis/accountsAPI';
import { cashbacksApi } from 'features/apis/cashbacksApi';
import { subscriptionTypesApi } from 'features/apis/subscriptionTypesApi';
import { analyticsApi } from "../features/apis/analyticsApi";

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
