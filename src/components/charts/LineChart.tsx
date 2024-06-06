import CardBgCorner from '../CardBgCorner';
import {
    Card,
    CardContent,
    CardHeader,
    Frequency,
    IconButton,
    Period,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Status,
    Str,
} from '@nabcellent/sui-react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { Dispatch, ReactNode } from 'react';
import { FaSync } from 'react-icons/fa';

export const chartSelectOptions = {
    [Period.LAST_24_HOURS]: [Frequency.HOURLY],
    [Period.LAST_SEVEN_DAYS]: [Frequency.DAILY],
    [Period.LAST_THIRTY_DAYS]: [Frequency.DAILY, Frequency.WEEKLY],
    [Period.LAST_THREE_MONTHS]: [Frequency.WEEKLY, Frequency.MONTHLY],
    [Period.LAST_SIX_MONTHS]: [Frequency.MONTHLY],
    [Period.YTD]: [Frequency.MONTHLY, Frequency.QUARTERLY],
};

type LineChartProps = {
    options: ChartOptions<'line'>;
    data: ChartData<'line'>;
    refetch: () => QueryActionCreatorResult<any> | void;
    isFetching: boolean;
    chartTypeOpt: 'time-series' | 'cumulative';
    setChartTypeOpt: Dispatch<LineChartProps['chartTypeOpt']>;
    chartPeriodOpt: Period;
    setChartPeriodOpt: Dispatch<Period>;
    chartFreqOpt: Frequency;
    setChartFreqOpt: Dispatch<Frequency>;
    txStatus: Status | 'ALL';
    setTxStatus: Dispatch<Status | 'ALL'>;
    extraModifiers?: ReactNode;
    cardBg?: 1 | 2 | 3 | 4 | 5;
};

const LineChart = ({
    options,
    data,
    refetch,
    isFetching,
    chartTypeOpt,
    setChartTypeOpt,
    chartPeriodOpt,
    setChartPeriodOpt,
    chartFreqOpt,
    setChartFreqOpt,
    txStatus,
    setTxStatus,
    extraModifiers,
}: LineChartProps) => (
    <Card className="relative overflow-hidden">
        <CardBgCorner corner={5} />
        <CardHeader className="absolute right-0 me-3">
            <div className={'flex gap-2'}>
                <IconButton icon={FaSync} onClick={() => refetch()} isLoading={isFetching} className={'w-7 h-7'} />
                <Select value={chartTypeOpt} onValueChange={(e) => setChartTypeOpt(e as 'time-series' | 'cumulative')}>
                    <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2">
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Chart Type</SelectLabel>
                            <SelectItem value="time-series">Time Series</SelectItem>
                            <SelectItem value="cumulative">Cumulative</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    value={chartPeriodOpt}
                    onValueChange={(e) => {
                        setChartPeriodOpt(e as Period);
                        setChartFreqOpt(chartSelectOptions[e as Period][0]);
                    }}
                >
                    <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2">
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Period</SelectLabel>
                            {Object.values(Period).map((p) => (
                                <SelectItem key={p} value={p}>
                                    {Str.headline(p)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    value={chartFreqOpt}
                    onValueChange={(e) => setChartFreqOpt(e as Frequency)}
                    disabled={chartSelectOptions[chartPeriodOpt].length < 2}
                >
                    <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2">
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Period</SelectLabel>
                            {chartSelectOptions[chartPeriodOpt].map((f) => (
                                <SelectItem key={f} value={f}>
                                    {Str.headline(f)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={txStatus} onValueChange={(e) => setTxStatus(e as Status)}>
                    <SelectTrigger className="w-24 h-7 lg:w-[120px] px-2">
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value={'ALL'}>All</SelectItem>
                            {[Status.COMPLETED, Status.FAILED, Status.PENDING, Status.REFUNDED].map((status, i) => (
                                <SelectItem key={`status-${i}`} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className={'flex justify-end mt-2'}>{extraModifiers}</div>
        </CardHeader>
        <CardContent className={'relative pt-3'} style={{ height: 350 }}>
            <Line options={options} data={data} />
        </CardContent>
    </Card>
);

export default LineChart;
