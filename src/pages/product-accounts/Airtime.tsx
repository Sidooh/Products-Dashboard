import { SectionError, SectionLoader } from '@nabcellent/sui-react';
import { useAccountsQuery } from 'features/accounts/accountsAPI';
import ProductAccountsTable from '../../components/tables/ProductAccountsTable';

const AirtimeAccounts = () => {
    let {data, isLoading, isSuccess, isError, error} = useAccountsQuery('airtime');

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: accounts} = data;
    console.log(accounts);

    return <ProductAccountsTable title={'Airtime Accounts'} accounts={accounts}/>
};

export default AirtimeAccounts;
