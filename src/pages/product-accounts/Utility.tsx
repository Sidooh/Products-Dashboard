import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { useAccountsQuery } from 'features/apis/accountsAPI';
import ProductAccountsTable from 'components/tables/ProductAccountsTable';
import { logger } from 'utils/logger';

const UtilityAccounts = () => {
    let {data, isLoading, isSuccess, isError, error} = useAccountsQuery('utility');

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: accounts} = data;
    logger.log(accounts);

    return <ProductAccountsTable title={'Utility Accounts'} accounts={accounts}/>
};

export default UtilityAccounts;
