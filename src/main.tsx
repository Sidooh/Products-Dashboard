import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@nabcellent/sui-react';

import '@/assets/css/index.css';
import '@nabcellent/sui-react/dist/style.min.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ThemeProvider defaultTheme={'light'} storageKey={'payments-ui-theme'}>
                    <App />
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
