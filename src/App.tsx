import { ThemeProvider } from '@mui/material';
import Layout from './layouts';
import { theme } from './theme';
import { useAppSelector } from './app/hooks';
import { RootState } from './app/store';
import useTheme from './hooks/useTheme';
import { PageLoader } from '@nabcellent/sui-react';

function App() {
    const { isDark } = useAppSelector((state: RootState) => state.theme);
    const { isLoaded } = useTheme(isDark);

    if (!isLoaded) {
        return (
            <PageLoader isDark={isDark}/>
        );
    }

    return (
        <ThemeProvider theme={theme}><Layout/></ThemeProvider>
    );
}

export default App;
