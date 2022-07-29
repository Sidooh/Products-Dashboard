/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';

        REACT_APP_ACCOUNTS_API_URL: string;
        REACT_APP_PRODUCTS_API_URL: string;
        REACT_APP_NOTIFY_API_URL: string;

        REACT_APP_NOTIFY_DASH_URL: string;
        REACT_APP_PAYMENTS_DASH_URL: string;
        REACT_APP_ACCOUNTS_DASH_URL: string;
        REACT_APP_SAVINGS_DASH_URL: string;

        REACT_APP_LEGACY_URL: string;
    }
}