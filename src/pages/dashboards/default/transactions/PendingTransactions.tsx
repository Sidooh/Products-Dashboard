import { ComponentLoader, SectionError } from '@nabcellent/sui-react';
import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { Status } from 'utils/enums';
import Transactions from './Transactions';

const PendingTransactions = () => {
    let {data: transactionData, isLoading, isSuccess, isError, error} = useTransactionsQuery(Status.PENDING);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactionData) return <ComponentLoader/>;

    const {data: transactions} = transactionData;
    console.log('Pending Transactions', transactions);

    return <Transactions tableTitle={'Pending Transactions'} transactions={transactions}/>;
};

export default PendingTransactions;
