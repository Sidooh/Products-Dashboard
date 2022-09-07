import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import Transactions from './Transactions';
import { Transaction } from 'utils/types';
import { Status } from 'utils/enums';
import { ComponentLoader, SectionError } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';

const RecentTransactions = () => {
    let {data: transactions, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    transactions = transactions.filter((t: Transaction) => t.status !== Status.PENDING);
    logger.log('Recent Transactions', transactions);

    return <Transactions tableTitle={'Recent Transactions'} transactions={transactions}/>;};

export default RecentTransactions;
