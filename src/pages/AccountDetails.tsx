import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import {
    Badge,
    currencyFormat,
    DataTable,
    Flex, PhoneChip,
    SectionError,
    SectionLoader,
    Status,
    StatusChip,
    TableDate
} from '@nabcellent/sui-react';
import { CONFIG } from 'config';
import TableActions from "components/TableActions";
import { useAccountQuery } from "features/apis/accountsApi";
import CountUp from "react-countup";
import CardBgCorner from 'components/CardBgCorner';
import { logger } from 'utils/logger';
import { Subscription, Transaction } from "utils/types";
import moment from "moment/moment";
import Latency from "../components/Latency";

const ShowAccountDetails = () => {
    const { id } = useParams<{ id: any }>();
    const { data, isError, error, isLoading, isSuccess } = useAccountQuery(Number(id));

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    const account = data.account;

    const isAgent = data.subscriptions.some(s => s.status === Status.ACTIVE)
    logger.log(data);

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner corner={3}/>
                <Card.Body className="position-relative">
                    <Flex justifyContent={'between'} alignItems={'center'}>
                        <h5>Account: #{account.id}</h5>
                        {isAgent && <Badge pill>AGENT</Badge>}
                    </Flex>

                    <Row>
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <h6 className="mb-2">
                                <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/users/${account.user_id}`}
                                   target={'_blank'}>
                                    {account.user?.name}
                                </a>
                            </h6>
                            <p className="mb-0 fs--1">
                                <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${account.id}`}
                                   target={'_blank'}>
                                    {account.phone}
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col md={6}>
                    <Card style={{ 'height': '110px' }}>
                        <CardBgCorner corner={2}/>
                        <Card.Body>
                            <Row>
                                <Col className="d-md-flex d-lg-block flex-between-center">
                                    <h5 className="mb-md-0 mb-lg-2">Transactions</h5>
                                    <h4 className="fs-3 fw-normal text-700">
                                        <CountUp end={data.totalTransactions} separator=","/>
                                    </h4>
                                </Col>
                                <Col className={'d-flex align-items-start justify-content-end'}>
                                    <Badge pill>
                                        <CountUp end={data.totalTransactionsToday} separator=","/>
                                    </Badge>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card style={{ 'height': '110px' }}>
                        <CardBgCorner/>
                        <Card.Body>
                            <Row>
                                <Col className="d-md-flex d-lg-block flex-between-center">
                                    <h5 className="mb-md-0 mb-lg-2">Revenue</h5>
                                    <h4 className="fs-3 fw-normal text-700 align-text-bottom">
                                        <CountUp end={data.totalRevenue} prefix={'KES '} separator=","/>
                                    </h4>
                                </Col>
                                <Col className={'d-flex align-items-start justify-content-end'}>
                                    <Badge bg={'success'} pill>
                                        <CountUp end={data.totalRevenueToday} prefix={' KES '} separator=","/>
                                    </Badge>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className={'my-3'}>
                <Card.Body>
                    <DataTable title={'Transactions'} columns={[
                        {
                            accessorKey: 'description',
                            header: 'Description',
                            cell: ({ row: { original: tx } }: any) => (
                                <span className={'d-flex flex-column'}>
                                    {tx.description}<br/>
                                    {tx.destination !== tx.account?.phone &&
                                    <small><PhoneChip phone={tx.destination}/></small>}
                                </span>
                            )
                        },
                        {
                            accessorKey: 'amount',
                            header: 'Amount',
                            cell: ({ row }: any) => currencyFormat(row.original.amount)
                        },
                        {
                            accessorKey: 'status',
                            header: 'Status',
                            cell: ({ row }: any) => <StatusChip status={row.original.status}/>
                        },
                        {
                            accessorKey: 'updated_at',
                            header: 'Updated',
                            cell: ({ row }: any) => <TableDate date={row.original.updated_at}/>
                        },
                        {
                            accessorKey: 'latency',
                            accessorFn: (r: Transaction) => moment(r.updated_at).diff(r.created_at, 's'),
                            header: 'Latency',
                            cell: ({ row: { original: tx } }: any) => <Latency from={tx.created_at} to={tx.updated_at}/>
                        },
                        {
                            id: 'actions',
                            cell: ({ row }: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                        }
                    ]} data={data.recentTransactions}/>
                </Card.Body>
            </Card>

            {data?.subscriptions?.length > 0 && (
                <Card className={'mb-3'}>
                    <Card.Body>
                        <DataTable title={'Subscriptions'} columns={[
                            {
                                accessorKey: 'type',
                                header: 'Type',
                                accessorFn: (row: Subscription) => row.subscription_type.title
                            },
                            {
                                accessorKey: 'status',
                                header: 'Status',
                                cell: ({ row }: any) => <StatusChip status={row.original.status}/>
                            },
                            {
                                accessorKey: 'start_date',
                                header: 'Start Date',
                                cell: ({ row }: any) => <TableDate date={row.original.start_date} dateOverTime/>,
                            },
                            {
                                accessorKey: 'end_date',
                                header: 'End Date',
                                cell: ({ row }: any) => <TableDate date={row.original.end_date} dateOverTime/>,
                            },
                            {
                                accessorKey: 'created_at',
                                header: 'Created',
                                cell: ({ row }: any) => <TableDate date={row.original.created_at} dateOverTime/>
                            }
                        ]} data={data.subscriptions}/>
                    </Card.Body>
                </Card>
            )}

            <Row className="g-3">
                {data.vouchers.length > 0 && (
                    <Col>
                        <Card className={'bg-line-chart-gradient'}>
                            <Card.Header className={'bg-transparent light'}>
                                <h6 className="text-white">VOUCHERS</h6>
                                <h4 className="text-white m-0">
                                    {data.vouchers.map(v => (
                                        <CountUp end={v.balance} prefix={'KES '} separator=","/>
                                    ))}
                                </h4>
                            </Card.Header>
                        </Card>
                    </Col>
                )}
                {data.earningAccounts.map(e => (
                    <Col key={e.id}>
                        <Card className={'bg-line-chart-gradient'}>
                            <Card.Header className={'bg-transparent light'} as={Row}>
                                <Col>
                                    <h6 className="text-white">{e.type}</h6>
                                    <h4 className="text-white m-0">
                                        <CountUp end={e.self_amount} prefix={'KES '} separator=","/>
                                    </h4>
                                </Col>
                                {e.type !== 'MERCHANT' &&
                                    <Col className={'d-flex align-items-start justify-content-end'}>
                                        <Badge bg={'light'} className={'text-secondary'} pill>
                                            <CountUp end={e.invite_amount} prefix={' KES '} separator=","/>
                                        </Badge>
                                    </Col>}
                            </Card.Header>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );

};

export default ShowAccountDetails;
