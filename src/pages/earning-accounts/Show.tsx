import { useGetEarningAccountQuery } from '@/services/earningAccountsApi';
import { Badge, Card, CardContent, CardHeader, Skeleton, SidoohAccount } from '@nabcellent/sui-react';
import CardBgCorner from '../../components/CardBgCorner';
import moment from 'moment/moment';
import { useParams } from 'react-router-dom';
import CountUp from 'react-countup';
import AlertError from '@/components/alerts/AlertError';

const Show = () => {
    const id = Number(useParams().id);
    let { data, isLoading, isSuccess, isError, error } = useGetEarningAccountQuery(id);

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !data) return <Skeleton className={'h-[100px]'} />;

    return (
        <div className={'space-y-3'}>
            <Card className={'relative'}>
                <CardBgCorner corner={2} />
                <CardHeader className={'relative justify-between items-start'}>
                    <h5 className={'font-semibold leading-none tracking-tight'}>
                        Earning Account Details: #{data.account.id}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                        {moment(data.account.created_at).format('MMM Do, Y | hh:mm A')}
                    </p>
                </CardHeader>
                <CardContent>
                    <SidoohAccount account={data.account} />
                </CardContent>
            </Card>

            <div className="flex w-full gap-3">
                {data.earning_accounts.map((a) => (
                    <Card className={'relative bg-[linear-gradient(-45deg,#414ba7,#4a2613)] bg-center w-full'}>
                        <CardHeader className="text-white !pb-0 text-sm text-white/70">{a.type}</CardHeader>
                        <CardContent>
                            <h4 className="text-white m-0 lg:text-lg">
                                <CountUp end={a.self_amount} prefix={'KES '} separator="," />
                            </h4>
                            <Badge className={'absolute top-0 end-0 m-3 rounded-full bg-lime-500 text-primary'}>
                                <CountUp end={a.invite_amount} prefix={'KES '} />
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Show;
