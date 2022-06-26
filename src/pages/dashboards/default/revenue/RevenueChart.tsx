import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { getColor, rgbaColor } from 'utils/helpers';
import { useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';
import ECharts from 'components/common/echarts';
import { Status } from 'utils/enums';

type PaymentChartType = {
    data: any
    labels: string[]
    paymentStatus: string | Status
    style: object
}

echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent]);

const getOptions = (labels: string[], data: any, isDark: boolean) => ({
    tooltip: {
        trigger           : 'axis',
        axisPointer       : {
            type: 'cross'
        },
        padding           : [7, 10],
        backgroundColor   : getColor('100'),
        borderColor       : getColor('300'),
        borderWidth       : 1,
        transitionDuration: 0,
        textStyle         : {
            fontWeight: 500,
            fontSize  : 12,
            color     : getColor('dark')
        },
        formatter         : (params: any) => {
            return (
                `<b>${params[1].axisValue}</b> <br>`+
                `Today - ${params[1].value} KES<br>`+
                `Yesterday - ${params[0].value} KES`
            )
        }
    },
    xAxis  : [
        {
            show       : true,
            type       : 'category',
            data       : labels,
            splitLine  : {
                show     : true,
                lineStyle: {
                    color: rgbaColor('#fff', 0.1)
                },
            },
            axisLine   : {
                lineStyle: {
                    color: rgbaColor('#fff', 0.1)
                }
            },
            axisTick   : {
                show     : true,
                length   : 10,
                lineStyle: {
                    color: rgbaColor('#fff', 0.1)
                }
            },
            axisLabel  : {
                color     : getColor('400'),
                fontWeight: 600,
                fontSize  : 10,
                margin    : 15,
                interval  : window.innerWidth < 768 ? 'auto' : 0,
                rotate    : '30',
            },
        },
    ],
    yAxis  : {
        type       : 'value',
        axisPointer: {
            show: false
        },
        splitLine  : {
            show: false
        },
        axisLabel  : {
            show: false
        },
        axisTick   : {show: false},
        axisLine   : {show: false}
    },
    series : [
        {
            type     : 'line',
            data     : data.yesterday.datasets,
            symbol   : 'emptyCircle',
            itemStyle: {
                color: isDark ? getColor('primary') : getColor('red')
            },
            lineStyle: {
                color: isDark
                    ? rgbaColor(getColor('primary'), 0.8)
                    : rgbaColor(getColor('red'), 0.8)
            },
        },
        {
            type     : 'line',
            smooth   : true,
            data     : data.today.datasets,
            symbol   : 'emptyCircle',
            itemStyle: {
                color: isDark ? getColor('primary') : getColor('white')
            },
            lineStyle: {
                color: isDark
                    ? rgbaColor(getColor('primary'), 0.8)
                    : rgbaColor(getColor('white'), 0.8)
            },
            areaStyle: {
                color: {
                    type      : 'linear',
                    x         : 0,
                    y         : 0,
                    x2        : 0,
                    y2        : 1,
                    colorStops: [
                        {
                            offset: 0,
                            color : isDark
                                ? rgbaColor(getColor('primary'), 0.5)
                                : rgbaColor('#fff', 0.5)
                        },
                        {
                            offset: 1,
                            color : isDark
                                ? rgbaColor(getColor('primary'), 0)
                                : rgbaColor('#fff', 0)
                        }
                    ]
                }
            },
            emphasis : {
                lineStyle: {
                    width: 2
                }
            }
        }
    ],
    grid   : {left: 20, right: 5, bottom: '25%', top: 10}
});

const RevenueChart = ({data, labels, style}: PaymentChartType) => {
    const {isDark} = useAppSelector((state: RootState) => state.theme);

    return <ECharts echarts={echarts} options={getOptions(labels, data, isDark)} style={style}/>;
};

export default RevenueChart;
