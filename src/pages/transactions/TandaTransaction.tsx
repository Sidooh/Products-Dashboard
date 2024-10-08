import {
    Card,
    CardContent,
    CardHeader,
    currencyFormat,
    Table,
    TableBody,
    TableCell,
    TableDate,
    TableHead,
    TableHeader,
    TableRow,
    TandaRequest,
} from '@nabcellent/sui-react';

const TandaTransaction = ({ requests }: { requests: TandaRequest[] }) => (
    <Card className="mb-3">
        <CardHeader className="flex-row gap-1">
            Transaction - <i className={'text-muted-foreground'}>Tanda</i>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader className="bg-slate-100">
                    <TableRow className={'border-muted text-nowrap'}>
                        <TableHead>Reference (Receipt No.)</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-end">Created</TableHead>
                        <TableHead className="text-end">Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((r) => (
                        <TableRow key={r.request_id} className={'border-muted'}>
                            <TableCell className={'text-nowrap'}>
                                <p>{r.request_id}</p>
                                <p className="text-sm">({r.receipt_number})</p>
                            </TableCell>
                            <TableCell>{currencyFormat(r.amount)}</TableCell>
                            <TableCell>{r.provider}</TableCell>
                            <TableCell>{r.destination}</TableCell>
                            <TableCell>{r.message}</TableCell>
                            <TableCell>{r.status}</TableCell>
                            <TableCell className="text-end text-nowrap">
                                <TableDate date={r.last_modified} />
                            </TableCell>
                            <TableCell className="text-end text-nowrap">
                                <TableDate date={r.updated_at} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default TandaTransaction;
