import { Card } from 'react-bootstrap';
import { useEnterpriseQuery } from 'features/enterprises/enterprisesApi';
import { DataTable, SectionError, SectionLoader, Status, StatusChip, TableDate } from '@nabcellent/sui-react';
import { logger } from 'utils/logger';
import CardBgCorner from "../../components/CardBgCorner";
import moment from "moment";
import { useParams } from "react-router-dom";
import { EnterpriseAccount } from "../../utils/types";
import SidoohAccount from "../../components/common/SidoohAccount";

const Show = () => {
    let {data: enterprise, isLoading, isSuccess, isError, error} = useEnterpriseQuery(Number(useParams().id));

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !enterprise) return <SectionLoader/>;

    logger.log(enterprise);

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner corner={4}/>
                <Card.Body className="position-relative row">
                    <h5>Enterprise Details: #{enterprise.id}</h5>
                    <p className="m-0 mt-4">{enterprise.name}</p>
                    <p className="small m-0 mt-4">{moment(enterprise.created_at).format('MMM D, Y, hh:mm A')}</p>
                </Card.Body>
            </Card>

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
                    ]} data={enterprise.enterprise_accounts}/>
                </Card.Body>
            </Card>
        </>
    );
};

export default Show;
