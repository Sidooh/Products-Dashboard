import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import themeReducer from '@/features/themeSlice';
import { coreApi } from '@/services/coreApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,

        [coreApi.reducerPath]: coreApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coreApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
