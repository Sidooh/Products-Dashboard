import { ComponentLoader, SectionError, Status } from '@nabcellent/sui-react';
import { useTransactionsQuery } from 'features/transactions/transactionsAPI';
import { Card } from 'react-bootstrap';
import Transactions from './Transactions';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logger } from 'utils/logger';

const PendingTransactions = () => {
    let { data: transactions, isLoading, isSuccess, isError, error } = useTransactionsQuery(Status.PENDING);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    logger.log('Pending Transactions', transactions);

    return transactions.length ? <Transactions tableTitle={'Pending Transactions'} transactions={transactions}/> : (
        <Card className={'mb-3 bg-soft-primary'}>
            <Card.Header className={'fw-bolder'}>
                <FontAwesomeIcon icon={faInfoCircle}/> No Pending Transactions.
            </Card.Header>
        </Card>
    );
};

export default PendingTransactions;
