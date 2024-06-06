import { CONFIG } from '@/config';
import {
    Card,
    CardContent,
    CardHeader,
    currencyFormat,
    Payment,
    StatusBadge,
    Table,
    TableBody,
    TableCell,
    TableDate,
    TableHead,
    TableHeader,
    TableRow,
} from '@nabcellent/sui-react';
import AlertError from '@/components/alerts/AlertError';
import { FaRegEye } from 'react-icons/fa6';

const TransactionPayment = ({ payment }: { payment?: Payment }) => {
    if (!payment) return <AlertError title={'This Transaction Has No Payment.'} />;

    return (
        <Card className="mb-3">
            <CardHeader className="flex-row gap-1">
                <h5>
                    Payment - <i className={'text-muted-foreground'}>{payment.type}</i>
                </h5>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-200 text-900">
                        <TableRow>
                            <TableHead>Sub-Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Charge</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{payment.subtype}</TableCell>
                            <TableCell className="align-middle">{currencyFormat(payment.amount)}</TableCell>
                            <TableCell className="align-middle">{currencyFormat(payment.charge)}</TableCell>
                            <TableCell className="">
                                <TableDate date={payment.updated_at} />
                            </TableCell>
                            <TableCell className="align-middle text-start">
                                <StatusBadge status={payment.status} />
                            </TableCell>
                            <TableCell>
                                <a
                                    href={`${CONFIG.services.payments.dashboard.url}/payments/${payment.id}`}
                                    target={'_blank'}
                                    rel={'noreferrer noopener'}
                                >
                                    <FaRegEye />
                                </a>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TransactionPayment;
