import { useParams } from 'react-router-dom';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import {
    useCheckPaymentMutation,
    useTransactionProcessMutation,
    useTransactionQuery,
    useTransactionRefundMutation, useTransactionRetryMutation
} from 'features/transactions/transactionsAPI';
import moment from 'moment';
import { Fragment, lazy } from 'react';
import { CONFIG } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateLeft,
    faArrowsRotate,
    faBars,
    faCodePullRequest,
    faArrowRotateRight
} from '@fortawesome/free-solid-svg-icons';
import { currencyFormat, SectionError, SectionLoader, Status, StatusChip, toast } from '@nabcellent/sui-react';
import CardBgCorner from 'components/CardBgCorner';
import { Sweet } from 'utils/helpers';
import { SweetAlertOptions } from 'sweetalert2';

const TransactionPayment = lazy(() => import('./TransactionPayment'));
const TandaTransaction = lazy(() => import('./TandaTransaction'));

const Show = () => {
        const { id } = useParams<{ id: any }>();
        const { data: transaction, isError, error, isLoading, isSuccess } = useTransactionQuery(Number(id));

        const [processTransaction] = useTransactionProcessMutation();
        const [retryTransaction] = useTransactionRetryMutation();
        const [refundTransaction] = useTransactionRefundMutation();
        const [checkPayment] = useCheckPaymentMutation();

        if (isError) return <SectionError error={error}/>;
        if (isLoading || !isSuccess || !transaction) return <SectionLoader/>;

        const txStatus = transaction.status;

        console.log(transaction);

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

            const querySuccess = (titleText: string) => toast({ titleText, icon: 'success', timer: 7 });

            if (action === 'retry') {
                options.title = 'Retry Transaction';
                options.text = 'Are you sure you want to retry this transaction?';
                options.preConfirm = async () => {
                    const res = await retryTransaction(transaction.id) as any;
                    console.log(res);

                    if (res?.data?.id) await querySuccess('Retry Successful!');
                    if (res?.error) await queryError(res, 'Retry Error');
                };
            }

            if (action === 'refund') {
                options.title = 'Refund';
                options.text = 'Are you sure you want to refund this transaction?';
                options.preConfirm = async () => {
                    const res = await refundTransaction(transaction.id) as any;
                    console.log(res);

                    if (res?.data?.id) await querySuccess('Refund Successful!');
                    if (res?.error) await queryError(res, 'Refund Error');
                };
            }

            if (action === 'check-payment') {
                options.title = 'Check Payment';
                options.text = 'Are you sure you want to check this transactions\' payment?';
                options.preConfirm = async () => {
                    const res = await checkPayment(transaction.id) as any;
                    console.log(res);

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
                    console.log(res);

                    if (res?.data?.id) await querySuccess('Check Request Complete!');
                    if (res?.error?.data?.message) return Sweet.showValidationMessage(res?.error.data.message);
                };
            }

            await Sweet.fire(options);
        };

        const transactionDropdownItems = [];
        if (txStatus === Status.PENDING && !transaction.tanda_request) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('retry')}>
                    <FontAwesomeIcon icon={faArrowRotateRight}/>&nbsp; Retry
                </Dropdown.Item>
            );
        }
        if (txStatus === Status.PENDING && transaction.payment?.status === Status.COMPLETED && (!transaction.tanda_request || ![
            '000000',
            '000001'
        ].includes(String(transaction?.tanda_request?.status)))) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('refund')}>
                    <FontAwesomeIcon icon={faArrowRotateLeft}/>&nbsp; Refund
                </Dropdown.Item>
            );
        }
        if (transaction.payment?.status === Status.PENDING) {
            transactionDropdownItems.push(
                <Dropdown.Item as="button" onClick={() => queryTransaction('check-payment')}>
                    <FontAwesomeIcon icon={faArrowsRotate}/>&nbsp; Check Payment
                </Dropdown.Item>
            );
        }
        if (txStatus === Status.PENDING && !transaction.tanda_request && [
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
                                <StatusChip status={txStatus}/>
                            </Col>
                            {transactionDropdownItems.length > 0 && (
                                <Col sm={'auto'} className="d-flex align-items-end justify-content-end">
                                    <Dropdown>
                                        <Dropdown.Toggle size={'sm'} as={'a'} className={'cursor-pointer'}>
                                            <FontAwesomeIcon icon={faBars}/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {transactionDropdownItems.map((item, i) => <Fragment key={i}>{item}</Fragment>)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            )}
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
                        </Row>
                    </Card.Body>
                </Card>

                <TransactionPayment payment={transaction.payment}/>

                {transaction.tanda_request && <TandaTransaction request={transaction.tanda_request}/>}
            </>
        );
    }
;

export default Show;
