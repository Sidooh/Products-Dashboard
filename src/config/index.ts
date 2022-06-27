// const defaultConfig =  process.env.NODE_ENV === 'production' ? ProductionConfig : DevelopmentConfig;
// const defaultConfig =  process.env.NODE_ENV === 'development' ? ProductionConfig : DevelopmentConfig;

export const CONFIG = {
    sidooh: {
        services: {
            accounts: {
                api: {
                    url: process.env.REACT_APP_ACCOUNTS_API_URL
                }
            },
            products: {
                api: {
                    url: process.env.REACT_APP_PRODUCTS_API_URL
                }
            },
            notify  : {
                api      : {
                    url: process.env.REACT_APP_NOTIFY_API_URL
                },
                dashboard: {
                    url: process.env.REACT_APP_NOTIFY_DASH_URL
                }
            },
            legacy  : {
                dashboard: {
                    url: process.env.REACT_APP_LEGACY_URL
                }
            },
        },

        tagline: 'Sidooh, Makes You Money with Every Purchase!',
        version: '2.0'
    }
};