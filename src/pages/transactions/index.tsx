import { useTransactionsQuery } from 'features/apis/transactionsApi';
import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';
import TransactionsTable from 'components/tables/TransactionsTable';
import { useState } from "react";
import { PaginationState } from "../../utils/types";

const Index = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 50,
    })
    let { data: res, isLoading, isSuccess, isError, error, isFetching } = useTransactionsQuery(pagination);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !res) return <SectionLoader/>;

    logger.log(res, res.current_page);

    return <TransactionsTable tableTitle={'Transactions'} transactions={res.data} reFetching={isFetching}
                              serverTotal={res.total}
                              serverPageCount={res.last_page}
                              currentServerPage={res.current_page}
                              onNextServerPage={() => {
                                  setPagination(pagination => ({ ...pagination, page: pagination.page + 1 }))
                              }}
                              onPreviousServerPage={() => {
                                  setPagination(pagination => ({ ...pagination, page: pagination.page - 1 }))
                              }}
                              onGoToServerPage={page => {
                                  setPagination(pagination => ({ ...pagination, page }))
                              }}
                              onSetServerPageSize={page_size => {
                                  setPagination(pagination => ({ ...pagination, page_size }))
                              }}/>;
};

export default Index;
