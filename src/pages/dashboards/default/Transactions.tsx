import TransactionsTable from '@/components/tables/TransactionsTable';
import { useGetDashboardTransactionsQuery } from '@/services/dashboardApi';
import AlertError from '@/components/alerts/AlertError';
import { Skeleton } from '@nabcellent/sui-react';
import AlertInfo from '@/components/alerts/AlertInfo';

const Transactions = () => {
    let {
        data: transactions,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetDashboardTransactionsQuery();

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !transactions) return <Skeleton className={'h-[700px]'} />;

    return (
        <div className={'space-y-3'}>
            {transactions.pending.length ? (
                <TransactionsTable tableTitle={'Pending Transactions'} transactions={transactions.pending} />
            ) : (
                <AlertInfo title={'No Pending Transactions.'} />
            )}

            <TransactionsTable
                tableTitle={'Recent Transactions'}
                transactions={transactions.recent}
                reFetching={isFetching}
                onRefetch={refetch}
            />
        </div>
    );
};

export default Transactions;
