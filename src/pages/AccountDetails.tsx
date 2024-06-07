import { useParams } from 'react-router-dom';
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    currencyFormat,
    DataTable,
    ProductsTransaction as Transaction,
    Skeleton,
    Status,
    StatusBadge,
    Subscription,
    TableDate,
    Latency,
    Phone,
} from '@nabcellent/sui-react';
import TableActions from '@/components/TableActions';
import { useAccountQuery } from '@/services/accountsApi';
import CountUp from 'react-countup';
import CardBgCorner from '@/components/CardBgCorner';
import moment from 'moment/moment';
import AlertError from '@/components/alerts/AlertError';
import SidoohAccount from '@/components/SidoohAccount';

const ShowAccountDetails = () => {
    const { id } = useParams<{ id: any }>();
    const { data, isError, error, isLoading, isSuccess } = useAccountQuery(Number(id));

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[1000px]'} />;

    const account = data.account;

    const isAgent = data.subscriptions.some((s) => s.status === Status.ACTIVE);

    return (
        <div className={'space-y-3'}>
            <Card className={'relative'}>
                <CardBgCorner corner={3} />
                <CardHeader className={'relative'}>
                    <h5 className={'font-semibold leading-none tracking-tight'}>Account: #{account.id}</h5>
                    {isAgent && <Badge className={'rounded-full'}>AGENT</Badge>}
                </CardHeader>
                <CardContent className="relative">
                    <SidoohAccount account={account} />
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-3">
                <Card className={'relative'}>
                    <CardBgCorner corner={2} />
                    <CardHeader className={'!pb-0 relative'}>
                        <span className={'text-sm text-muted-foreground'}>Transactions</span>
                        <div className="absolute flex items-center top-3 right-6 gap-2">
                            <Badge className={'rounded-full'}>
                                <CountUp end={data.totalTransactionsToday} separator="," />
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className={'relative flex flex-col justify-content-center'}>
                        <h5 className="text-xl font-semibold">
                            <CountUp end={data.totalTransactions} separator="," />
                        </h5>
                    </CardContent>
                </Card>
                <Card className={'relative'}>
                    <CardBgCorner corner={2} />
                    <CardHeader className={'!pb-0 relative'}>
                        <span className={'text-sm text-muted-foreground'}>Revenue</span>
                        <div className="absolute flex items-center top-3 right-6 gap-2">
                            <Badge className={'rounded-full bg-lime-500'}>
                                <CountUp end={data.totalRevenueToday} separator="," prefix={'KES '} />
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className={'relative flex flex-col justify-content-center'}>
                        <h5 className="text-xl font-semibold">
                            <CountUp end={data.totalRevenue} separator="," prefix={'KES '} />
                        </h5>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                title={'Transactions'}
                columns={[
                    {
                        accessorKey: 'description',
                        header: 'Description',
                        cell: ({ row: { original: tx } }: any) => (
                            <>
                                <p>{tx.description}</p>
                                {tx.destination !== account.phone && (
                                    <>
                                        {tx.description.includes('Airtime') ? (
                                            <Phone phone={tx.destination} className={'font-bold text-xs'} />
                                        ) : (
                                            tx.destination
                                        )}
                                    </>
                                )}
                            </>
                        ),
                    },
                    {
                        accessorKey: 'amount',
                        header: 'Amount',
                        cell: ({ row }: any) => currencyFormat(row.original.amount),
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
                    },
                    {
                        accessorKey: 'updated_at',
                        header: 'Updated',
                        cell: ({ row }: any) => <TableDate date={row.original.updated_at} />,
                    },
                    {
                        accessorKey: 'latency',
                        accessorFn: (r: Transaction) => moment(r.updated_at).diff(r.created_at, 's'),
                        header: 'Latency',
                        cell: ({ row: { original: tx } }: any) => <Latency from={tx.created_at} to={tx.updated_at} />,
                    },
                    {
                        id: 'actions',
                        cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'transaction'} />,
                    },
                ]}
                data={data.recentTransactions}
            />

            {data?.subscriptions?.length > 0 && (
                <DataTable
                    title={'Subscriptions'}
                    columns={[
                        {
                            accessorKey: 'type',
                            header: 'Type',
                            accessorFn: (row: Subscription) => row.subscription_type.title,
                        },
                        {
                            accessorKey: 'status',
                            header: 'Status',
                            cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
                        },
                        {
                            accessorKey: 'start_date',
                            header: 'Start Date',
                            cell: ({ row }: any) => <TableDate date={row.original.start_date} dateOverTime />,
                        },
                        {
                            accessorKey: 'end_date',
                            header: 'End Date',
                            cell: ({ row }: any) => <TableDate date={row.original.end_date} dateOverTime />,
                        },
                        {
                            accessorKey: 'created_at',
                            header: 'Created',
                            cell: ({ row }: any) => <TableDate date={row.original.created_at} dateOverTime />,
                        },
                    ]}
                    data={data.subscriptions}
                />
            )}

            <div className="flex flex-col xl:!flex-row w-full gap-3">
                {data.vouchers.length > 0 && (
                    <Card className={'relative bg-[linear-gradient(-45deg,#414ba7,#4a2613)] bg-center w-full'}>
                        <CardHeader className={'relative'}>
                            <h6 className="text-white/70 text-sm leading-none">VOUCHERS</h6>
                            <h4 className="text-white text-lg font-semibold">
                                {data.vouchers.map((v) => (
                                    <CountUp key={v.id} end={v.balance} prefix={'KES '} separator="," />
                                ))}
                            </h4>
                        </CardHeader>
                    </Card>
                )}
                {data.earningAccounts.map((e) => (
                    <Card
                        key={e.type}
                        className={'relative bg-[linear-gradient(-45deg,#414ba7,#4a2613)] bg-center w-full'}
                    >
                        <CardHeader className={'relative'}>
                            <h6 className="text-white/70 text-sm leading-none">{e.type}</h6>
                            <h4 className="text-white text-lg font-semibold">
                                <CountUp end={e.self_amount} prefix={'KES '} separator="," />
                            </h4>
                        </CardHeader>
                        {e.type !== 'MERCHANT' && (
                            <div className={'absolute top-0 end-0 m-3'}>
                                <Badge className={'rounded-full'}>
                                    <CountUp end={e.invite_amount} prefix={' KES '} separator="," />
                                </Badge>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ShowAccountDetails;
