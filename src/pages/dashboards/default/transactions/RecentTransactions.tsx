import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { SectionError } from 'components/common/Error';
import { ComponentLoader } from 'components/common/Loader';
import Transactions from './Transactions';

const RecentTransactions = () => {
    let {data: transactionData, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactionData) return <ComponentLoader/>;

    const {data: transactions} = transactionData;
    console.log('Recent Transactions', transactions);

    return <Transactions tableTitle={'Recent Transactions'} transactions={transactions}/>;};

export default RecentTransactions;
