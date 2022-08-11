import { Card } from 'react-bootstrap';
import TableActions from 'components/common/TableActions';
import { useCashbacksQuery } from 'features/earnings/earningsAPI';
import { DataTable, SectionError, SectionLoader, TableDate, currencyFormat } from '@nabcellent/sui-react';
import { Cashback } from 'utils/types';

const EarningAccounts = () => {
    let {data, isLoading, isSuccess, isError, error} = useCashbacksQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    let {data: cashbacks} = data;
    console.log(cashbacks);

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Cashbacks'} columns={[
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
                        cell: ({row}: any) => (
                            <span>
                                {currencyFormat(row.original.transaction.amount)} <br/>
                                <small>Cashback:<b> {currencyFormat(row.original.amount)}</b></small>
                            </span>
                        )
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({row}: any) => <TableDate date={row.original.updated_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'cashback'}/>
                    }
                ]} data={cashbacks}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
