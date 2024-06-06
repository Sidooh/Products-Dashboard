import { useTransactionsQuery } from '@/services/transactionsApi';
import TransactionsTable from '@/components/tables/TransactionsTable';
import { useState } from 'react';
import { PaginationState, Skeleton } from '@nabcellent/sui-react';
import AlertError from '@/components/alerts/AlertError';

const Index = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100,
    });
    let { data: res, isLoading, isSuccess, isError, error, isFetching } = useTransactionsQuery(pagination);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !res) return <Skeleton className={'h-[700px]'} />;

    return (
        <TransactionsTable
            tableTitle={'Transactions'}
            transactions={res.data}
            reFetching={isFetching}
            serverTotal={res.total}
            pageSize={res.per_page}
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

export default Index;
