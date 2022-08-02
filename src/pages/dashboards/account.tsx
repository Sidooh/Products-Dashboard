import {Link, useParams} from 'react-router-dom';
import {Card, Col, Row} from 'react-bootstrap';
import StatusChip from 'components/chips/StatusChip';
import CardBgCorner from 'components/CardBgCorner';
import {SectionError} from '../../components/common/Error';
import {SectionLoader} from '../../components/common/Loader';
import {currencyFormat} from '../../utils/helpers';
import {CONFIG} from '../../config';
import DataTable from "../../components/common/datatable";
import TableDate from "../../components/common/TableDate";
import TableActions from "../../components/common/TableActions";
import {useAccountQuery} from "../../features/accounts/accountsAPI";
import {Chip} from "@mui/material";
import CountUp from "react-countup";

const ShowAccountDetails = () => {
    const {id} = useParams<{ id: any }>();
    const {data, isError, error, isLoading, isSuccess} = useAccountQuery(Number(id));

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    const account = data.account

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner/>
                <Card.Body className="position-relative">
                    <h5>Account: #{account.id}</h5>
                    {/*<p className="fs--1">{moment(account.created_at).format('MMM D, Y, hh:mm A')}</p>*/}
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
                    {/*<strong className="me-2">Status:</strong>*/}

                    {/*<Row>*/}
                    {/*    <Col lg={6} className="mb-4 mb-lg-0">*/}
                    {/*        <StatusChip status={account.status} entity={'transaction'} entityId={Number(id)}/>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col lg={6} className="mb-4 mb-lg-0 text-end">*!/*/}
                    {/*    /!*    {account.status === Status.PENDING && account.payment?.status === Status.COMPLETED &&*!/*/}
                    {/*    /!*        <Flex alignItems={'center'}>*!/*/}
                    {/*    /!*            <FormControl size={'sm'} value={requestId} placeholder={'Request ID'}*!/*/}
                    {/*    /!*                         onChange={(e) => setRequestId(e.currentTarget.value)}/>*!/*/}
                    {/*    /!*            <Tooltip title={'Process Transaction'}>*!/*/}
                    {/*    /!*                <IconButton size={'small'} sx={{ml: 1}} onClick={onProcessTransaction}>*!/*/}
                    {/*    /!*                    <FontAwesomeIcon icon={faArrowsRotate}/>*!/*/}
                    {/*    /!*                </IconButton>*!/*/}
                    {/*    /!*            </Tooltip>*!/*/}
                    {/*    /!*        </Flex>*!/*/}
                    {/*    /!*    }*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*</Row>*/}
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col md={6} xxl={12}>
                    <Card style={{'height': '150px'}}>
                        <CardBgCorner corner={2}/>
                        <Card.Body>
                            <Row className="flex-between-center">
                                <Col className="d-md-flex d-lg-block flex-between-center">
                                    <h5 className="mb-md-0 mb-lg-2">Transactions</h5>
                                    <Chip sx={{px: .5}} variant={'outlined'} color={'success'} className={`mt-2 mb-3`}
                                          label={<CountUp end={data.totalTransactionsToday} separator=","/>}/>
                                    <h4 className="fs-3 fw-normal text-700">
                                        <CountUp end={data.totalTransactions} separator=","/>
                                    </h4>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={12}>
                    <Card style={{'height': '150px'}}>
                        <CardBgCorner/>
                        <Card.Body>
                            <Row className="sflex-between-center">
                                <Col className="d-md-flex d-lg-block flex-between-center">
                                    <h5 className="mb-md-0 mb-lg-2">Revenue</h5>
                                    <Chip sx={{px: .5}} variant={'outlined'} color={'success'} className={`mt-2 mb-3`}
                                          label={<CountUp end={data.totalRevenueToday} prefix={' KES '}
                                                          separator=","/>}/>
                                    <h4 className="fs-3 fw-normal text-700 align-text-bottom">
                                        <CountUp end={data.totalRevenue} prefix={'KES '} separator=","/>
                                    </h4>
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
                            accessorKey: 'id',
                            header: '#',
                            cell: ({row}: any) => <Link to={`/transactions/${row.original.id}`}>{row.original.id}</Link>
                        },
                        {
                            accessorKey: 'description',
                            header: 'Description',
                            cell: ({row}: any) => (
                                <span>
                                {row.original.description}<br/>
                                    {row.original.destination !== account.phone &&
                                        <small><b>{row.original.destination}</b></small>}
                            </span>
                            )
                        },
                        {
                            accessorKey: 'amount',
                            header: 'Amount',
                            cell: ({row}: any) => currencyFormat(row.original.amount)
                        },
                        {
                            accessorKey: 'status',
                            header: 'Status',
                            cell: ({row}: any) => <StatusChip status={row.original.status} entity={'transaction'}
                                                              entityId={row.original.id}/>
                        },
                        {
                            accessorKey: 'created_at',
                            header: 'Date',
                            cell: ({row}: any) => <TableDate date={row.original.created_at}/>
                        },
                        {
                            id: 'actions',
                            cell: ({row}: any) => <TableActions entityId={row.original.id} entity={'transaction'}/>
                        }
                    ]} data={data.recentTransactions}/>
                </Card.Body>
            </Card>


            <Row className="g-3">
                <Col md={4} xxl={12}>
                    <Card className={'bg-line-chart-gradient h-100'}>
                        <Card.Header className={'bg-transparent light'}>
                            <h5 className="text-white">VOUCHER</h5>
                            <h4 className="real-time-user display-4 fw-normal text-white">
                                <CountUp end={data.voucher.balance} prefix={'KES '} separator=","/>
                            </h4>
                        </Card.Header>
                    </Card>
                </Col>
                <Col md={4} xxl={12}>
                    {
                        data.earningAccounts.map(e => {
                            return <Card className={'bg-line-chart-gradient h-100'} key={e.id} >
                                <Card.Header className={'bg-transparent light'}>
                                    <h5 className="text-white">{e.type}</h5>
                                    <h4 className="real-time-user display-4 fw-normal text-white">
                                        <CountUp end={e.self_amount} prefix={'KES '} separator=","/>
                                    </h4>
                                    <Chip sx={{px: .5}} variant={'outlined'} className={`mt-2 mb-3 text-white`}
                                          label={<CountUp end={e.invite_amount} prefix={' KES '}
                                                          separator=","/>}/>

                                </Card.Header>
                            </Card>
                        })

                    }
                </Col>
            </Row>

        </>
    );

};

export default ShowAccountDetails;
