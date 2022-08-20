import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useCashbacksQuery } from 'features/cashbacks/cashbacksApi';
import { currencyFormat, DataTable, SectionError, SectionLoader, TableDate } from '@nabcellent/sui-react';
import { Cashback } from 'utils/types';
import SidoohAccount from 'components/common/SidoohAccount';

const EarningAccounts = () => {
    let { data: cashbacks, isLoading, isSuccess, isError, error } = useCashbacksQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !cashbacks) return <SectionLoader/>;

    console.log(cashbacks);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Cashbacks'} columns={[
                    {
                        accessorKey: 'customer',
                        accessorFn: (row: Cashback) => row?.account?.phone,
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
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({ row }: any) => (
                            <span>
                                {currencyFormat(row.original.transaction.amount)} <br/>
                                <small>Cashback:<b> {currencyFormat(row.original.amount)}</b></small>
                            </span>
                        )
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({ row }: any) => <TableDate date={row.original.updated_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'cashback'}/>
                    }
                ]} data={cashbacks}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
