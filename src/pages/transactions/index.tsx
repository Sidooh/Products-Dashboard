import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';
import Transactions from 'pages/dashboards/default/transactions/Transactions';

const Index = () => {
    let { data: transactions, isLoading, isSuccess, isError, error } = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <SectionLoader/>;

    logger.log(transactions);

    return <Transactions tableTitle={'Transactions'} transactions={transactions}/>;
};

export default Index;
