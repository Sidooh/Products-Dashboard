import { Card } from 'react-bootstrap';
import { useEnterprisesQuery } from 'features/enterprises/enterprisesApi';
import { DataTable, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import SidoohAccount from 'components/common/SidoohAccount';
import { logger } from 'utils/logger';
import { Enterprise } from "utils/types";
import TableActions from "components/common/TableActions";

const Enterprises = () => {
    let { data: enterprises, isLoading, isSuccess, isError, error } = useEnterprisesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !enterprises) return <SectionLoader/>;

    logger.log(enterprises);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Enterprises'} columns={[
                    {
                        accessorKey: 'admin',
                        accessorFn: (row: Enterprise) => `${row.admin.account?.phone}: ${row.admin.account?.user?.name}`,
                        header: 'Admin',
                        cell: ({ row }: any) => <SidoohAccount account={row.original.admin.account}/>
                    },
                    {
                        accessorKey: 'name',
                        header: 'Name',
                    },
                    {
                        accessorKey: 'enterprise_accounts_count',
                        header: 'No. of accounts',
                    },
                    {
                        accessorKey: 'created_at',
                        header: 'Created',
                        cell: ({ row }: any) => <TableDate date={row.original.created_at}/>
                    },
                    {
                        id: 'actions',
                        header: '',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'enterprises'}/>
                    }
                ]} data={enterprises}/>
            </Card.Body>
        </Card>
    );
};

export default Enterprises;
