import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import StatusChip from 'components/chips/StatusChip';
import CardBgCorner from 'components/CardBgCorner';
import { IMAGES } from '../../constants/images';
import { useTransactionQuery } from '../../features/transactions/transactionsAPI';
import { SectionError } from '../../components/common/Error';
import { SectionLoader } from '../../components/common/Loader';
import moment from 'moment';
import { currencyFormat } from '../../utils/helpers';
import { PaymentType } from '../../utils/enums';
import { lazy } from 'react';
import PhoneChip from 'components/chips/PhoneChip';

const MpesaPayment = lazy(() => import('./MpesaPayment'));
const TandaTransaction = lazy(() => import('./TandaTransaction'));

const Show = () => {
    const {id} = useParams();
    const {data: transaction, isError, error, isLoading, isSuccess} = useTransactionQuery(String(id));
    console.log('Transaction:', transaction);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !transaction) return <SectionLoader/>;

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner/>
                <Card.Body className="position-relative">
                    <h5>Transaction Details: #{transaction.id}</h5>
                    <p className="fs--1">{moment(transaction.created_at).format('MMM D, Y, hh:mm A')}</p>
                    <strong className="me-2">Status: </strong>
                    <StatusChip status={transaction.status} entity={'transaction'} entityId={Number(id)}/>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Body>
                    <Row>
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Account</h5>
                            <h6 className="mb-2">
                                <a href="https://sidooh-admin-dashboard-iw4itjwa5a-uc.a.run.app/admin/users/50">
                                    {transaction.account?.user?.name ?? transaction.account?.phone}
                                </a>
                            </h6>
                            <p className="mb-0 fs--1">
                                <strong>Email: </strong>
                                <a href={`mailto:${transaction.account?.user?.email}`}>{transaction.account?.user?.email}</a>
                            </p>
                            <p className="mb-0 fs--1">
                                <strong>Phone: </strong>
                                <PhoneChip textOnly phone={transaction.account?.phone}/>
                            </p>
                        </Col>
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Details</h5>
                            <h6 className="mb-2">{transaction.description} - {transaction.destination}</h6>
                            <p className="mb-0 fs--1"><strong>Type: </strong>{transaction.type}</p>
                            <div className="fs--1"><strong>Amount: </strong>({currencyFormat(transaction.amount)})</div>
                        </Col>
                        <Col lg={4}>
                            <h5 className="mb-3 fs-0">Payment</h5>
                            <div className="d-flex">
                                <img className="me-3" src={IMAGES.icons.cash} width="40" height="40" alt=""/>
                                <div className="flex-1">
                                    <h6 className="mb-0">{transaction.payment?.type} {transaction.payment?.subtype}</h6>
                                    <p className="mb-0 fs--1">
                                        <strong>Amount: </strong>{currencyFormat(transaction.amount)}
                                    </p>
                                    <div className="fs--1">
                                        <strong className="me-2">Status: </strong>
                                        <StatusChip status={transaction.payment?.status}
                                                    entity={'transaction'} entityId={Number(id)}/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {transaction.payment?.type === PaymentType.MPESA && <MpesaPayment payment={transaction.payment}/>}

            {transaction.request && <TandaTransaction request={transaction.request}/>}
        </>
    );
};

export default Show;
