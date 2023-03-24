import { useEffect, useState } from "react";
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';

export type BubbleChartData = SimulationNodeDatum & {
    name: string
    v: number
    color: string
}

type BubbleChartProps = {
    data: BubbleChartData[]
}

type ForceGraphProps = {
    nodes: BubbleChartData[]
}

const width = 250;
const height = 300;
const fontSize = 2; //rem
const ForceGraph = ({ nodes }: ForceGraphProps) => {
    const [animatedNodes, setAnimatedNodes] = useState<BubbleChartData[]>([]);

    const radiusScale = (value: number) => {
        const fx = d3
            .scaleSqrt()
            .range([15, 55])
            .domain([
                0.75 * d3.min(nodes, item => item.v),
                0.65 * d3.max(nodes, item => item.v)
            ]);

        return fx(value);
    };

    // Tooltip
    const showTooltip = function (e: any, item: BubbleChartData) {
        e.target.classList.add('opacity-50');

        d3.select('.d3-tooltip').transition().duration(200);
        d3.select('.d3-tooltip')
            .style('opacity', 1)
            .style('border', `1px solid ${item.color}`)
            .text(item.name + ': ' + item.v)
            .style('left', e.clientX - 40 + 'px')
            .style('top', e.clientY - 40 + 'px');
    };

    const moveTooltip = function (e: any) {
        e.target.classList.add('opacity-75');

        d3.select('.d3-tooltip')
            .style('opacity', 1)
            .style('left', e.clientX - 40 + 'px')
            .style('top', e.clientY - 40 + 'px');
    };

    const hideTooltip = function (e: any) {
        e.target.classList.remove('opacity-75');

        d3.select('.d3-tooltip').transition().duration(200).style('opacity', 0);
    };

    useEffect(() => {
        const simulation = d3
            .forceSimulation()
            .velocityDecay(0.7)
            .force('x', d3.forceX().strength(0.05))
            .force('y', d3.forceY().strength(0.05))
            .force('collide', d3.forceCollide(d => radiusScale(d.v) + 4));

        simulation.on('tick', () => {
            setAnimatedNodes([...simulation.nodes()]);
        });

        simulation.nodes([...nodes]);
        simulation.alpha(0.01).restart();

        return () => simulation.stop();
    }, [nodes]);

    const nodeVTotal = nodes.reduce((p, c) => p += c.v, 0)

    return (
        <>
            {animatedNodes.map((node, index) => (
                <g key={index}
                   textAnchor="middle"
                   transform={`translate(${width / 2 + node.x}, ${height / 2 + node.y})`}
                   onMouseOver={e => showTooltip(e, node)}
                   onMouseMove={e => moveTooltip(e)}
                   onMouseLeave={e => hideTooltip(e)}>
                    <circle r={radiusScale(node.v)} fill={node.color} strokeWidth="0"/>
                    <text dy="10" fill="#fff" textAnchor="middle"
                          fontSize={`${(node.v / nodeVTotal) * 250}%`} fontWeight="bold"
                          style={{ pointerEvents: 'none' }}>
                        {node.name}
                    </text>
                </g>
            ))}
        </>
    );
};
const BubbleChart = ({ data }: BubbleChartProps) => {
    return (
        <div className="position-relative w-100" style={{ height: '30rem' }}>
            <div className="d3-tooltip"></div>
            <svg className="packed-bubble-svg h-100 w-100" viewBox={'0 0 ' + width + ' ' + height}>
                <ForceGraph nodes={data}/>
            </svg>
        </div>
    );
};

export default BubbleChart;