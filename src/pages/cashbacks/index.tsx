import { Card } from 'react-bootstrap';
import { useCashbacksQuery } from 'features/cashbacks/cashbacksApi';
import { currencyFormat, DataTable, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import { Cashback } from 'utils/types';
import SidoohAccount from 'components/common/SidoohAccount';
import { logger } from 'utils/logger';

const EarningAccounts = () => {
    let { data: cashbacks, isLoading, isSuccess, isError, error } = useCashbacksQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !cashbacks) return <SectionLoader/>;

    logger.log(cashbacks);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Cashbacks'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: Cashback) => `${row.account?.phone}: ${row.account?.user?.name}`,
                        header: 'Customer',
                        cell: ({ row }: any) => <SidoohAccount account={row.original.account}/>
                    },
                    {
                        accessorKey: 'description',
                        accessorFn: (row: Cashback) => row.transaction?.description,
                        header: 'Description',
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                    },
                    {
                        accessorKey: 'cashback',
                        header: 'Cashback',
                        cell: ({ row }: any) => currencyFormat(row.original.amount)
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({ row }: any) => currencyFormat(row.original.transaction.amount)
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({ row }: any) => <TableDate date={row.original.updated_at}/>
                    }
                ]} data={cashbacks}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
