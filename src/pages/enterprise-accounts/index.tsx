import { Card } from 'react-bootstrap';
import { DataTable, SectionError, SectionLoader, Status, StatusChip, TableDate } from '@nabcellent/sui-react';
import SidoohAccount from 'components/common/SidoohAccount';
import { logger } from 'utils/logger';
import { EnterpriseAccount } from "utils/types";
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
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({row}: any) => (
                            <StatusChip status={row.original.status ? Status.ACTIVE : Status.INACTIVE}/>
                        )
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Created',
                        cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                    }
                ]} data={accounts}/>
            </Card.Body>
        </Card>
    );
};

export default Enterprises;
