import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from 'features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import { transactionsApi } from '../features/transactions/transactionsAPI';

export const store = configureStore({
    reducer: {
        auth : authReducer,
        theme: themeReducer,

        [transactionsApi.reducerPath]: transactionsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(transactionsApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
