import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { useAirtimeAccountsQuery } from 'features/apis/accountsApi';
import { logger } from 'utils/logger';
import ProductAccountsTable from '../../components/tables/ProductAccountsTable';
import { useState } from "react";
import { PaginationState } from "../../utils/types";

const AirtimeAccounts = () => {
    const [params, setPagination] = useState<PaginationState>({
        page: 1,
        page_size: 100
    })
    let { data: res, isLoading, isSuccess, isFetching, isError, error } = useAirtimeAccountsQuery(params);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !res) return <SectionLoader/>;

    logger.log(res);

    return (
        <ProductAccountsTable
            title={'Airtime Accounts'} accounts={res.data}
            isFetching={isFetching}
            serverTotal={res.total}
            serverPageSize={res.per_page}
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
            }}
        />
    )
};

export default AirtimeAccounts;
