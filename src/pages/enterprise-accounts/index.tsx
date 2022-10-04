import { Card } from 'react-bootstrap';
import { DataTable, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import SidoohAccount from 'components/common/SidoohAccount';
import { logger } from 'utils/logger';
import { EnterpriseAccount } from "utils/types";
import TableActions from "components/common/TableActions";
import { useEnterpriseAccountsQuery } from "features/enterprise-accounts/enterpriseAccountsApi";

const Enterprises = () => {
    let {data: accounts, isLoading, isSuccess, isError, error} = useEnterpriseAccountsQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !accounts) return <SectionLoader/>;

    logger.log(accounts);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Enterprise Accounts'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: EnterpriseAccount) => `${row.account?.phone}: ${row.account?.user?.name}`,
                        header: 'Customer',
                        cell: ({row}: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'enterprise',
                        header: 'Enterprise',
                        cell: ({row}: any) => row.original.enterprise.name
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'enterprise-accounts'}/>
                    }
                ]} data={accounts}/>
            </Card.Body>
        </Card>
    );
};

export default Enterprises;
