import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';
import TransactionsTable from 'components/tables/TransactionsTable';

const Index = () => {
    let { data: transactions, isLoading, isSuccess, isError, error } = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <SectionLoader/>;

    logger.log(transactions);

    return <TransactionsTable tableTitle={'Transactions'} transactions={transactions}/>;
};

export default Index;
