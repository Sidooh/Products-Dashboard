import { TransactionsSLOResponse, useGetTransactionsSLOQuery } from "../../../features/apis/analyticsApi";
import { Card, Col, Row } from "react-bootstrap";
import {
    ComponentLoader,
    getStatusColor,
    groupBy,
    IconButton,
    SectionError,
    Status,
    Tooltip
} from "@nabcellent/sui-react";
import CardBgCorner from "../../../components/CardBgCorner";
import { Fragment, useState } from "react";
import CountUp from "react-countup";
import { FaPercentage, FaSync } from "react-icons/fa";

const TransactionsSLOs = () => {
    const [bypassCache, setBypassCache] = useState(false)
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetTransactionsSLOQuery(bypassCache)

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const groupedSLOs: { [key: string]: TransactionsSLOResponse[] } = groupBy(data, 'year')
    const years = Object.keys(groupedSLOs)

    return (
        <Col xs={12} className={'mb-3'}>
            <h5 className="text-primary text-center position-relative">
                    <span className="bg-200 px-3">
                        Transaction Success Rate
                        <Tooltip title="Refresh SLO" placement="start">
                            <IconButton loading={isFetching} color={'secondary'} className="btn ms-2 mb-1"
                                        onClick={() => {
                                            if (!bypassCache) setBypassCache(true)
                                            refetch()
                                        }}>
                                <FaSync size={12}/>
                            </IconButton>
                        </Tooltip>
                    </span>
                <span className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"/>
            </h5>

            <Card>
                <CardBgCorner corner={5}/>
                <Card.Body className={'bg-dark'}>
                    {years.map((year, i) => {
                        const total = groupedSLOs[year].reduce((p, c) => p += c.count, 0)
                        const data = groupedSLOs[year].sort((a, b) => b.count - a.count)
                            .filter(s => [Status.COMPLETED, Status.FAILED, Status.REFUNDED].includes(s.status))

                        return (
                            <Fragment key={`year-${year}`}>
                                <div className={'d-flex'}>
                                    <h5 className={'text-light border-bottom pe-lg-5'}>{year}</h5>
                                </div>
                                <Row className={`g-2 ${i + 1 < years.length && 'mb-5'}`}>
                                    {data.map((d, i) => {
                                        const slo = (d.count / total) * 100

                                        return (
                                            <Col key={`slo-${year + i}`} lg={4} className={`text-center`}>
                                                <div className="bg-dark py-3">
                                                    <div
                                                        className={`icon-circle icon-circle-${getStatusColor(d.status)} text-${getStatusColor(d.status)} fw-bold`}>
                                                        <CountUp end={slo} decimals={Math.round(slo) === slo ? 0 : 1}
                                                                 className="me-1 fs-12"/>
                                                        <FaPercentage size={12}/>
                                                    </div>
                                                    <h6 className={`mb-1 fw-bold text-${getStatusColor(d.status)}`}>{d.status}</h6>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Fragment>
                        )
                    })}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TransactionsSLOs;