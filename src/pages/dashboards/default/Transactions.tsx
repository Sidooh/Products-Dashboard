import { useTransactionsQuery } from "../../../features/transactions/transactionsAPI";
import { ComponentLoader, partition, SectionError, Status } from "@nabcellent/sui-react";
import { logger } from "../../../utils/logger";
import { Transaction } from "../../../utils/types";
import TransactionsTable from "../../../components/tables/TransactionsTable";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Transactions = () => {
    const [bypassCache, setBypassCache] = useState(false)
    let {
        data: transactions,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        isFetching
    } = useTransactionsQuery(bypassCache);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    logger.log('Transactions', transactions);

    const [pendingTransactions, otherTransactions] = partition<Transaction>(transactions, (tx) => {
        return tx.status === Status.PENDING
    })

    return (
        <div>
            {pendingTransactions.length
             ? <TransactionsTable tableTitle={'Pending Transactions'} transactions={pendingTransactions}/> : (
                 <Card className={'mb-3 bg-soft-primary'}>
                     <Card.Header className={'fw-bolder'}>
                         <FontAwesomeIcon icon={faInfoCircle}/> No Pending Transactions.
                     </Card.Header>
                 </Card>
             )}

            <TransactionsTable tableTitle={'Recent Transactions'} transactions={otherTransactions}
                               reFetching={isFetching}
                               onRefetch={() => {
                                   if (!bypassCache) setBypassCache(true)

                                   refetch()
                               }}/>
        </div>
    );
};

export default Transactions;