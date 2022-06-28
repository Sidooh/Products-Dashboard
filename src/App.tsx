import { ThemeProvider } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'components/common/Error';
import Layout from './layouts';
import { theme } from './theme';
import { Suspense } from 'react';
import { SectionLoader } from './components/common/Loader';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
                <Suspense fallback={<SectionLoader/>}>
                    <Layout/>
                </Suspense>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
