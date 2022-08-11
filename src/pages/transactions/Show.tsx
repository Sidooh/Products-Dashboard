import { useParams } from 'react-router-dom';
import { Card, Col, FormControl, Row } from 'react-bootstrap';
import { useTransactionProcessMutation, useTransactionQuery } from 'features/transactions/transactionsAPI';
import moment from 'moment';
import { PaymentType, Status } from 'utils/enums';
import { lazy, useState } from 'react';
import { CONFIG } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Tooltip } from '@mui/material';
import { CardBgCorner, currencyFormat, Flex, SectionError, SectionLoader, StatusChip } from '@nabcellent/sui-react';

const MpesaPayment = lazy(() => import('./MpesaPayment'));
const TandaTransaction = lazy(() => import('./TandaTransaction'));

const Show = () => {
    const {id} = useParams<{ id: any }>();
    const {data: transaction, isError, error, isLoading, isSuccess} = useTransactionQuery(Number(id));

    const [requestId, setRequestId] = useState('');

    const [
        processTransaction, // This is the mutation trigger
        {isLoading: isUpdating}, // This is the destructured mutation result
    ] = useTransactionProcessMutation();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || isUpdating || !isSuccess || !transaction) return <SectionLoader/>;

    const onProcessTransaction = (): void => {
        processTransaction({id: transaction.id, request_id: requestId});
    };

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner/>
                <Card.Body className="position-relative">
                    <h5>Transaction Details: #{transaction.id}</h5>
                    <p className="fs--1">{moment(transaction.created_at).format('MMM D, Y, hh:mm A')}</p>
                    <strong className="me-2">Status:</strong>

                    <Row>
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <StatusChip status={transaction.status}/>
                        </Col>
                        <Col lg={6} className="mb-4 mb-lg-0 text-end">
                            {transaction.status === Status.PENDING && transaction.payment?.status === Status.COMPLETED &&
                                <Flex alignItems={'center'}>
                                    <FormControl size={'sm'} value={requestId} placeholder={'Request ID'}
                                                 onChange={(e) => setRequestId(e.currentTarget.value)}/>
                                    <Tooltip title={'Process Transaction'}>
                                        <IconButton size={'small'} sx={{ml: 1}} onClick={onProcessTransaction}>
                                            <FontAwesomeIcon icon={faArrowsRotate}/>
                                        </IconButton>
                                    </Tooltip>
                                </Flex>
                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Body>
                    <Row>
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Account</h5>
                            <h6 className="mb-2">
                                <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/users/${transaction.account?.user_id}`}
                                   target={'_blank'}>
                                    {transaction.account?.user?.name}
                                </a>
                            </h6>
                            <p className="mb-0 fs--1">
                                <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${transaction.account?.id}`}
                                   target={'_blank'}>
                                    {transaction.account?.phone}
                                </a>
                            </p>
                        </Col>
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Details</h5>
                            <h6 className="mb-2">{transaction.description} - {transaction.destination}</h6>
                            <p className="mb-0 fs--1"><strong>Type: </strong>{transaction.type}</p>
                            <div className="fs--1"><strong>Amount: </strong>({currencyFormat(transaction.amount)})</div>
                        </Col>
                        {/*<Col lg={4}>*/}
                        {/*    <h5 className="mb-3 fs-0">*/}
                        {/*        Payment*/}
                        {/*    </h5>*/}
                        {/*    <div className="d-flex">*/}
                        {/*        <img className="me-3" src={IMAGES.icons.cash} width="40" height="40" alt=""/>*/}
                        {/*        <div className="flex-1">*/}
                        {/*            <h6 className="mb-0">{transaction.payment?.type} {transaction.payment?.subtype}</h6>*/}
                        {/*            <p className="mb-0 fs--1">*/}
                        {/*                <strong>Amount: </strong>{currencyFormat(transaction.amount)}*/}
                        {/*            </p>*/}
                        {/*            <div className="fs--1">*/}
                        {/*                <strong className="me-2">Status: </strong>*/}
                        {/*                <StatusChip status={transaction.payment?.status}*/}
                        {/*                            entity={'transaction'} entityId={Number(id)}/>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</Col>*/}
                    </Row>
                </Card.Body>
            </Card>

            {transaction.payment?.type === PaymentType.MPESA && <MpesaPayment payment={transaction.payment}/>}

            {transaction.tanda_request && <TandaTransaction request={transaction.tanda_request}/>}
        </>
    );
};

export default Show;
