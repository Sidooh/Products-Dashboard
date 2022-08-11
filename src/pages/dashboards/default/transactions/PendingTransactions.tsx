import { ComponentLoader, SectionError } from '@nabcellent/sui-react';
import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { Status } from 'utils/enums';
import Transactions from './Transactions';

const PendingTransactions = () => {
    let {data: transactions, isLoading, isSuccess, isError, error} = useTransactionsQuery(Status.PENDING);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    console.log('Pending Transactions', transactions);

    return <Transactions tableTitle={'Pending Transactions'} transactions={transactions}/>;
};

export default PendingTransactions;
