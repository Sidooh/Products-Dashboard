import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/layouts/partials/Sidebar';
import Header from '@/layouts/partials/Header';
import Footer from '@/layouts/partials/Footer';
import { cn, ErrorBoundary, ErrorFallback, PageLoader } from '@nabcellent/sui-react';
import { useAppSelector } from '@/app/hooks';

const MainLayout = () => {
    const { hash, pathname } = useLocation();
    const { isSidebarCollapsed } = useAppSelector((state) => state.theme);

    useEffect(() => {
        setTimeout(() => {
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);

                if (element) {
                    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
                }
            }
        }, 0);
    }, [hash]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <div
                className={cn('px-3 lg:container lg:grid flex-1 gap-6 pb-6', {
                    'md:grid-cols-[200px_1fr]': !isSidebarCollapsed,
                    'md:grid-cols-[35px_1fr]': isSidebarCollapsed,
                })}
            >
                <aside className={'hidden md:!block ps-2 z-10'}>
                    <Sidebar />
                </aside>

                <main className="min-h-screen relative pb-12">
                    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
                        <Suspense fallback={<PageLoader />}>
                            <Outlet />
                        </Suspense>
                    </ErrorBoundary>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
