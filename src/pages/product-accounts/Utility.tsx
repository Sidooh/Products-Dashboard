import { useUtilityAccountsQuery } from '@/services/accountsApi';
import ProductAccountsTable from '@/components/tables/ProductAccountsTable';
import { useState } from 'react';
import AlertError from '@/components/alerts/AlertError';
import { PaginationState, Skeleton } from '@nabcellent/sui-react';

const UtilityAccounts = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    });
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useUtilityAccountsQuery(pagination);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !res) return <Skeleton className={'h-[700px]'} />;

    return (
        <ProductAccountsTable
            title={'Utility Accounts'}
            accounts={res.data}
            isFetching={isFetching}
            serverTotal={res.total}
            serverPageSize={res.per_page}
            serverPageCount={res.last_page}
            currentServerPage={res.current_page}
            onNextServerPage={() => {
                setPagination((pagination) => ({ ...pagination, page: pagination.page + 1 }));
            }}
            onPreviousServerPage={() => {
                setPagination((pagination) => ({ ...pagination, page: pagination.page - 1 }));
            }}
            onGoToServerPage={(page) => {
                setPagination((pagination) => ({ ...pagination, page }));
            }}
            onSetServerPageSize={(page_size) => {
                setPagination((pagination) => ({ ...pagination, page_size }));
            }}
        />
    );
};

export default UtilityAccounts;
