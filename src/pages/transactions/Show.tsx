import { useParams } from 'react-router-dom';
import {
    useCheckPaymentMutation,
    useCompletePaymentMutation,
    useFailPaymentMutation,
    useTransactionProcessMutation,
    useTransactionQuery,
    useTransactionRefundMutation,
    useTransactionRetryMutation,
} from '@/services/transactionsApi';
import moment from 'moment';
import { Fragment, lazy } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    currencyFormat,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    IconButton,
    Latency,
    Separator,
    Skeleton,
    Status,
    StatusBadge,
    Sweet,
    toast,
} from '@nabcellent/sui-react';
import CardBgCorner from '@/components/CardBgCorner';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import SavingsTransaction from './SavingsTransaction';
import AlertError from '@/components/alerts/AlertError';
import { FaArrowRotateLeft, FaArrowRotateRight, FaArrowsRotate, FaCodePullRequest } from 'react-icons/fa6';
import { CgOptions } from 'react-icons/cg';
import SidoohAccount from '@/components/SidoohAccount';

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

    if (isError) return <AlertError error={error} />;
    if (isLoading || !isSuccess || !transaction) return <Skeleton className={'h-[700px]'} />;

    const payment = transaction.payment;
    const txStatus = transaction.status;

    const querySuccess = (titleText: string) => toast({ titleText, icon: 'success' });

    const queryTransaction = async (action: 'retry' | 'refund' | 'check-payment' | 'check-request') => {
        let options: SweetAlertOptions = {
            backdrop: `rgba(0, 0, 150, 0.4)`,
            showLoaderOnConfirm: true,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Proceed',
            allowOutsideClick: () => !Sweet.isLoading(),
        };

        const queryError = (res: any, titleText: string) =>
            toast({
                titleText,
                text: res?.error?.data?.message || res?.error.error,
                icon: 'error',
                timer: 7,
            });

        if (action === 'retry') {
            options.title = 'Retry Transaction';
            options.text = 'Are you sure you want to retry this transaction?';
            options.preConfirm = async () => {
                const res = (await retryTransaction(transaction.id)) as any;

                if (res?.data?.id) await querySuccess('Retry Successful!');
                if (res?.error) await queryError(res, 'Retry Error');
            };
        }

        if (action === 'refund') {
            options.title = 'Refund';
            options.text = 'Are you sure you want to refund this transaction?';
            options.preConfirm = async () => {
                const res = (await refundTransaction(transaction.id)) as any;

                if (res?.data?.id) await querySuccess('Refund Successful!');
                if (res?.error) await queryError(res, 'Refund Error');
            };
        }

        if (action === 'check-payment') {
            options.title = 'Check Payment';

            if (payment?.id) {
                options.text = "Are you sure you want to check this transactions' payment?";
            } else {
                options.input = 'number';
                options.inputAttributes = { placeholder: 'Payment ID' };
            }

            options.preConfirm = async (payment_id: number) => {
                const res = (await checkPayment({ id: transaction.id, payment_id: payment_id })) as any;

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

                const res = (await processTransaction({ id: transaction.id, request_id: requestId })) as any;

                if (res?.data?.id) await querySuccess('Check Request Complete!');
                if (res?.error?.data?.message) return Sweet.showValidationMessage(res?.error.data.message);
            };
        }

        await Sweet.fire(options);
    };

    const tandaRequests = transaction.tanda_requests;

    const transactionDropdownItems = [];
    if (txStatus === Status.PENDING && !Boolean(tandaRequests?.length)) {
        transactionDropdownItems.push(
            <DropdownMenuItem onClick={() => queryTransaction('retry')}>
                <FaArrowRotateRight />
                &nbsp; Retry
            </DropdownMenuItem>
        );
    }

    if (
        txStatus === Status.PENDING &&
        payment?.status === Status.COMPLETED &&
        (!Boolean(tandaRequests?.length) ||
            tandaRequests?.every((r) => !['000000', '000001'].includes(String(r.status))))
    ) {
        transactionDropdownItems.push(
            <DropdownMenuItem onClick={() => queryTransaction('refund')}>
                <FaArrowRotateLeft />
                &nbsp; Refund
            </DropdownMenuItem>
        );
    }
    if (!payment || payment?.status === Status.PENDING) {
        transactionDropdownItems.push(
            <DropdownMenuItem onClick={() => queryTransaction('check-payment')}>
                <FaArrowsRotate />
                &nbsp; Check Payment
            </DropdownMenuItem>
        );
    }
    if (txStatus === Status.PENDING && !Boolean(tandaRequests?.length) && [1, 5].includes(transaction.product_id)) {
        transactionDropdownItems.push(
            <DropdownMenuItem onClick={() => queryTransaction('check-request')}>
                <FaCodePullRequest />
                &nbsp; Check Request
            </DropdownMenuItem>
        );
    }

    return (
        <div className="space-y-3">
            <Card className="relative">
                <CardBgCorner corner={4} />
                <CardHeader className={'relative flex-row justify-between items-start'}>
                    <div>
                        <h5 className={'font-semibold leading-none tracking-tight'}>Transaction: #{transaction?.id}</h5>
                        <p className="text-sm text-muted-foreground">
                            {moment(transaction?.created_at).format('MMM Do, Y | hh:mm A')}
                        </p>
                    </div>
                    <span className={'font-bold text-xs'}>
                        Latency <Latency from={transaction.created_at} to={transaction.updated_at} />
                    </span>
                </CardHeader>
                <CardContent className="relative">
                    <div className={'flex justify-between items-end'}>
                        <StatusBadge
                            status={transaction.status}
                            statuses={[Status.COMPLETED, Status.FAILED]}
                            onStatusChange={async (status) => {
                                await Swal.fire({
                                    backdrop: `rgba(0, 0, 150, 0.4)`,
                                    showLoaderOnConfirm: true,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Proceed',
                                    title: 'Update Status',
                                    html: `Are you sure you want to update the status of this transaction to <b>${status}</b>?`,
                                    allowOutsideClick: () => !Swal.isLoading(),
                                    preConfirm: async () => {
                                        let res;
                                        if (status === Status.COMPLETED) {
                                            res = (await completePayment(transaction.id)) as any;
                                        } else if (status === Status.FAILED) {
                                            res = (await failPayment(transaction.id)) as any;
                                        } else return;

                                        if (res?.data?.id) await toast({ titleText: 'Payment status updated!' });
                                        if (res?.error?.data?.message)
                                            await toast({
                                                titleText: res?.error.data.message,
                                                icon: 'error',
                                                timer: 7,
                                            });
                                    },
                                });
                            }}
                        />
                        <div className={'items-center'}>
                            {transactionDropdownItems.length > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <IconButton className={'h-7 w-7'} icon={CgOptions} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {transactionDropdownItems.map((item, i) => (
                                            <Fragment key={i}>{item}</Fragment>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="relative">
                <CardBgCorner corner={1} />
                <CardHeader className={'font-semibold leading-none tracking-tight'}>Details</CardHeader>
                <CardContent className={'relative'}>
                    <div className="flex flex-col justify-evenly gap-y-1 lg:!flex-row lg:h-12 lg:items-center lg:space-x-4 text-sm">
                        <div>
                            <small className={'text-muted-foreground'}>Account</small>
                            <SidoohAccount account={transaction.account} />
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                            <small className={'text-muted-foreground'}>Description</small>
                            <p>{transaction.description}</p>
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                            <small className={'text-muted-foreground'}>Amount</small>
                            <p>{currencyFormat(transaction.amount)}</p>
                            <small className={'text-red-700'}>{currencyFormat(transaction.charge)}</small>
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                            <small className={'text-muted-foreground'}>Type</small>
                            <p>{transaction.type}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {payment && <TransactionPayment payment={payment} />}
            {Boolean(tandaRequests?.length) && <TandaTransaction requests={tandaRequests!!} />}
            {transaction.savings_transaction && <SavingsTransaction transaction={transaction.savings_transaction} />}
        </div>
    );
};
export default Show;
