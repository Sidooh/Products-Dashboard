import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import TransactionsTable from '../../../../components/tables/TransactionsTable';
import { Transaction } from 'utils/types';
import { ComponentLoader, SectionError, Status } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';

const RecentTransactions = () => {
    let {data: transactions, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    transactions = transactions.filter((t: Transaction) => t.status !== Status.PENDING);
    logger.log('Recent Transactions', transactions);

    return <TransactionsTable tableTitle={'Recent Transactions'} transactions={transactions}/>;};

export default RecentTransactions;
