
import {SectionError} from 'components/common/Error';
import {ComponentLoader} from 'components/common/Loader';
import {lazy} from 'react';

import {Transaction} from "../../../../utils/types";
import {useTransactionsQuery} from "../../../../features/transactions/transactionsAPI";
import {Status} from "../../../../utils/enums";

const RecentTransactions = lazy(() => import('./RecentTransactions'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));

const DashboardTransactions = () => {
    let {data: transactionData, isLoading, isSuccess, isError, error} = useTransactionsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transactionData) return <ComponentLoader/>;

    const {data: transactions} = transactionData;
    console.log(transactions)

    const pendingTransactions = transactions.filter((t: Transaction) => t.status === Status.PENDING)

    return (
        <>
            {pendingTransactions && pendingTransactions.length > 0 &&
                <PendingTransactions transactions={pendingTransactions}/>
            }

            <RecentTransactions transactions={transactions}/>

        </>
    );
};

export default DashboardTransactions;
