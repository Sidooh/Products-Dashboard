import { useParams } from 'react-router-dom';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import {
    useCheckPaymentMutation,
    useCompletePaymentMutation,
    useFailPaymentMutation,
    useTransactionProcessMutation,
    useTransactionQuery,
    useTransactionRefundMutation,
    useTransactionRetryMutation
} from 'features/transactions/transactionsAPI';
import moment from 'moment';
import { Fragment, lazy } from 'react';
import { CONFIG } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateLeft,
    faArrowRotateRight,
    faArrowsRotate,
    faBars,
    faCodePullRequest
} from '@fortawesome/free-solid-svg-icons';
import { currencyFormat, SectionError, SectionLoader, Status, StatusChip, toast, Sweet } from '@nabcellent/sui-react';
import CardBgCorner from 'components/CardBgCorner';
import { SweetAlertOptions } from 'sweetalert2';
import { logger } from 'utils/logger';
import SavingsTransaction from "./SavingsTransaction";

const TransactionPayment = lazy(() => import('./TransactionPayment'));
const TandaTransaction = lazy(() => import('./TandaTransaction'));

const Show = () => {
        const { id } = useParams<{ id: any }>();
        const { data: transaction, isError, error, isLoading, isSuccess } = useTransactionQuery(Number(id));

        const [processTransaction] = useTransactionProcessMutation();
        const [retryTransaction] = useTransactionRetryMutation();
        const [refundTransaction] = useTransactionRefundMutation();
        const [checkPayment] = useCheckPaymentMutation();
        const [completePayment] = useCompletePaymentMutation();
        const [failPayment] = useFailPaymentMutation();

        if (isError) return <SectionError error={error}/>;
        if (isLoading || !isSuccess || !transaction) return <SectionLoader/>;

        const payment = transaction.payment;
        const txStatus = transaction.status;

        logger.info(transaction);

        const querySuccess = (titleText: string) => toast({ titleText, icon: 'success' });

        const queryTransaction = async (action: 'retry' | 'refund' | 'check-payment' | 'check-request') => {
            let options: SweetAlertOptions = {
                backdrop: `rgba(0, 0, 150, 0.4)`,
                showLoaderOnConfirm: true,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Proceed',
                allowOutsideClick: () => !Sweet.isLoading()
            };

            const queryError = (res: any, titleText: string) => toast({
                titleText,
                text: res?.error?.data?.message || res?.error.error,
                icon: 'error',
                timer: 7
            });

            if (action === 'retry') {
                options.title = 'Retry Transaction';
                options.text = 'Are you sure you want to retry this transaction?';
                options.preConfirm = async () => {
                    const res = await retryTransaction(transaction.id) as any;
                    logger.log(res);

                    if (res?.data?.id) await querySuccess('Retry Successful!');
                    if (res?.error) await queryError(res, 'Retry Error');
                };
            }

            if (action === 'refund') {
                options.title = 'Refund';
                options.text = 'Are you sure you want to refund this transaction?';
                options.preConfirm = async () => {
                    const res = await refundTransaction(transaction.id) as any;
                    logger.log(res);

                    if (res?.data?.id) await querySuccess('Refund Successful!');
                    if (res?.error) await queryError(res, 'Refund Error');
                };
            }

            if (action === 'check-payment') {
                options.title = 'Check Payment';

                if (payment?.id) {
                    options.text = 'Are you sure you want to check this transactions\' payment?';
                } else {
                    options.input = 'number';
                    options.inputAttributes = { placeholder: 'Payment ID' };
                }

                options.preConfirm = async (payment_id: number) => {
                    const res = await checkPayment({ id: transaction.id, payment_id: payment_id }) as any;

                    if (res?.data?.id) await querySuccess('Check Payment Complete!');
                    if (res?.error) await queryError(res, 'Check Payment Error!');
                };
            }

            if (action === 'check-request') {
                options.title = 'Check Request';
                options.input = 'text';
                options.inputAttributes = { placeholder: 'Request ID' };
                options.preConfirm = async (requestId: string) => {
                    if (!requestId) return Sweet.showValidationMessage('Request ID is required.');

                    const res = await processTransaction({ id: transaction.id, request_id: requestId }) as any;
                    logger.log(res);

                    if (res?.data?.id) await querySuccess('Check Request Complete!');
                    if (res?.error?.data?.message) return Sweet.showValidationMessage(res?.error.data.message);
                };
            }

            await Sweet.fire(options);
        };

        const tandaRequests = transaction.tanda_requests

        const transactionDropdownItems = [];
        if (txStatus === Status.PENDING && !Boolean(tandaRequests?.length)) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('retry')}>
                    <FontAwesomeIcon icon={faArrowRotateRight}/>&nbsp; Retry
                </Dropdown.Item>
            );
        }

        if (txStatus === Status.PENDING && payment?.status === Status.COMPLETED && (!Boolean(tandaRequests?.length) || tandaRequests?.every(r => !['000000', '000001'].includes(String(r.status))))) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('refund')}>
                    <FontAwesomeIcon icon={faArrowRotateLeft}/>&nbsp; Refund
                </Dropdown.Item>
            );
        }
        if (!payment || payment?.status === Status.PENDING) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('check-payment')}>
                    <FontAwesomeIcon icon={faArrowsRotate}/>&nbsp; Check Payment
                </Dropdown.Item>
            );
        }
        if (txStatus === Status.PENDING && !Boolean(tandaRequests?.length) && [
            1, 5
        ].includes(transaction.product_id)) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('check-request')}>
                    <FontAwesomeIcon icon={faCodePullRequest}/>&nbsp; Check Request
                </Dropdown.Item>
            );
        }

        return (
            <>
                <Card className={'mb-3'}>
                    <CardBgCorner corner={2}/>
                    <Card.Body className="position-relative">
                        <Row>
                            <Col>
                                <h5>Transaction Details: #{transaction.id}</h5>
                                <p className="fs--1">{moment(transaction.created_at).format('MMM D, Y, hh:mm A')}</p>
                                <StatusChip status={txStatus}
                                            statuses={[Status.COMPLETED, Status.FAILED, Status.PENDING, Status.REFUNDED]}
                                            onStatusChange={async status => {
                                                await Sweet.fire({
                                                    backdrop: `rgba(0, 0, 150, 0.4)`,
                                                    showLoaderOnConfirm: true,
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Proceed',
                                                    title: 'Update Status',
                                                    html: `Are you sure you want to update the status of this transaction to <b>${status}</b>?`,
                                                    allowOutsideClick: () => !Sweet.isLoading(),
                                                    preConfirm: async () => {
                                                        let res;
                                                        if (status === Status.COMPLETED) {
                                                            res = await completePayment(transaction.id) as any;
                                                        } else if (status === Status.FAILED) {
                                                            res = await failPayment(transaction.id) as any;
                                                        }

                                                        if (res?.data?.id) await querySuccess('Transaction status updated!');
                                                        if (res?.error?.data?.message) await toast({
                                                            titleText: res?.error.data.message,
                                                            icon: 'error',
                                                            timer: 7
                                                        });
                                                    }
                                                });
                                            }}/>
                            </Col>
                            <Col sm={'auto'} className="d-flex text-end flex-column align-items-stretch justify-content-between">
                                <small className={'text-secondary text-decoration-underline'}>
                                    <b>Latency</b>
                                    ({moment(transaction.updated_at).diff(transaction.created_at, 's')}s)
                                </small>

                                {transactionDropdownItems.length > 0 && (
                                    <Dropdown>
                                        <Dropdown.Toggle size={'sm'} as={'a'} className={'cursor-pointer'}>
                                            <FontAwesomeIcon icon={faBars}/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {transactionDropdownItems.map((item, i) => <Fragment key={i}>{item}</Fragment>)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col lg={5} className="mb-4 mb-lg-0">
                                <h5 className="mb-3 fs-0">Account</h5>
                                <h6 className="mb-2">
                                    <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/users/${transaction.account?.user_id}`}
                                       target={'_blank'} rel={'noreferrer noopener'}>{transaction.account?.user?.name}
                                    </a>
                                </h6>
                                <p className="mb-0 fs--1">
                                    <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${transaction.account?.id}`}
                                       target={'_blank'} rel={'noreferrer noopener'}>{transaction.account?.phone}
                                    </a>
                                </p>
                            </Col>
                            <Col lg={7} className="mb-4 mb-lg-0">
                                <h5 className="mb-3 fs-0">Details</h5>
                                <Row>
                                    <h6 className="col-3 mb-1"><b>Description</b></h6>
                                    <h6 className="col-9 mb-1">: {transaction.description} for {transaction.destination}</h6>
                                    <h6 className="col-3 mb-1"><b>Type</b></h6>
                                    <h6 className="col-9 mb-1">: {transaction.type}</h6>
                                    <h6 className="col-3 mb-1"><b>Amount</b></h6>
                                    <h6 className="col-9 mb-1">: {currencyFormat(transaction.amount)}</h6>
                                    <h6 className="col-3 mb-1"><b>Charge</b></h6>
                                    <h6 className="col-9 mb-1">: {currencyFormat(transaction.charge)}</h6>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {payment && <TransactionPayment payment={payment}/>}
                {Boolean(tandaRequests?.length) && <TandaTransaction requests={tandaRequests!!}/>}
                {transaction.savings_transaction && <SavingsTransaction transaction={transaction.savings_transaction}/>}
            </>
        );
    }
;

export default Show;
