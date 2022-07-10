import { Card } from 'react-bootstrap';
import TableDate from 'components/common/TableDate';
import TableActions from 'components/common/TableActions';
import DataTable from 'components/common/datatable';
import { useCashbacksQuery } from 'features/earnings/earningsAPI';
import { SectionLoader } from 'components/common/Loader';
import { SectionError } from 'components/common/Error';
import { currencyFormat } from '../../utils/helpers';

const EarningAccounts = () => {
    let {data: cashbacks, isLoading, isSuccess, isError, error} = useCashbacksQuery();

    console.log(cashbacks);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !cashbacks) return <SectionLoader/>;

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <DataTable title={'Cashbacks'} columns={[
                    {
                        accessorKey: 'description',
                        accessorFn: row => row.transaction.description,
                        header: 'Description',
                    },
                    {
                        accessorKey: 'type',
                        header: 'Type',
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({row}: any) => currencyFormat(row.original.transaction.amount)
                    },
                    {
                        accessorKey: 'cashback',
                        header: 'Cashback',
                        cell: ({row}: any) => currencyFormat(row.original.amount)
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Last Update',
                        cell: ({row}: any) => <TableDate date={row.original.updated_at}/>
                    },
                    {
                        id: 'actions',
                        cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'earnings-account'}/>
                    }
                ]} data={cashbacks}/>
            </Card.Body>
        </Card>
    );
};

export default EarningAccounts;
