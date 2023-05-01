import { ComponentLoader, SectionError } from "@nabcellent/sui-react";
import { logger } from "../../../utils/logger";
import TransactionsTable from "../../../components/tables/TransactionsTable";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useGetDashboardTransactionsQuery } from "../../../features/dashboard/dashboardApi";

const Transactions = () => {
    let {
        data: transactions,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        isFetching
    } = useGetDashboardTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactions) return <ComponentLoader/>;

    logger.log('Transactions', transactions);

    return (
        <div>
            {transactions.pending.length
             ? <TransactionsTable tableTitle={'Pending Transactions'} transactions={transactions.pending}/> : (
                 <Card className={'mb-3 bg-soft-primary'}>
                     <Card.Header className={'fw-bolder'}>
                         <FontAwesomeIcon icon={faInfoCircle}/> No Pending Transactions.
                     </Card.Header>
                 </Card>
             )}

            <TransactionsTable tableTitle={'Recent Transactions'} transactions={transactions.recent}
                               reFetching={isFetching} onRefetch={refetch}/>
        </div>
    );
};

export default Transactions;