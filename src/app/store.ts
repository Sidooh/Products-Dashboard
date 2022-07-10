import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from 'features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import { transactionsApi } from '../features/transactions/transactionsAPI';
import { productsAPI } from '../features/products/productsAPI';
import { earningsAPI } from '../features/earnings/earningsAPI';
import { subscriptionsAPI } from '../features/subscriptions/subscriptionsAPI';

export const store = configureStore({
    reducer: {
        auth : authReducer,
        theme: themeReducer,

        [transactionsApi.reducerPath]: transactionsApi.reducer,
        [productsAPI.reducerPath]: productsAPI.reducer,
        [earningsAPI.reducerPath]: earningsAPI.reducer,
        [subscriptionsAPI.reducerPath]: subscriptionsAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(transactionsApi.middleware, productsAPI.middleware, earningsAPI.middleware, subscriptionsAPI.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
