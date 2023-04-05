import { SLAResponse, useGetSLAQuery } from "../../../features/analytics/analyticsApi";
import { Card, Col, Row } from "react-bootstrap";
import { getStatusColor, groupBy, LoadingButton, SectionError, ComponentLoader, Tooltip } from "@nabcellent/sui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent, faSync } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import CardBgCorner from "../../../components/CardBgCorner";
import { Fragment } from "react";

const Sla = () => {
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetSLAQuery()

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const groupedSLAs: { [key: string]: SLAResponse[] } = groupBy(data, 'year')

    return (
        <Col xs={12} className={'mb-3'}>
            <h5 className="text-primary text-center position-relative">
                    <span className="bg-200 dark__bg-1100 px-3">
                        SLA - TRANSACTION SUCCESS RATE
                        <Tooltip title="Refresh SLAs" placement="left">
                            <LoadingButton loading={isFetching} className="btn btn-sm border-0 py-2"
                                           spinner-position="replace" onClick={() => refetch()}>
                                <FontAwesomeIcon icon={faSync}/>
                            </LoadingButton>
                        </Tooltip>
                    </span>
                <span
                    className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"></span>
            </h5>

            <Card>
                <CardBgCorner corner={5}/>
                <Card.Body style={{ backgroundImage: 'linear-gradient(-45deg, rgba(65, 75, 167, 1), #4a2613)' }}>
                    {[...Object.keys(groupedSLAs), ...Object.keys(groupedSLAs)].map(year => {
                        const total = groupedSLAs[year].reduce((p, c) => p += c.count, 0)
                        const data = groupedSLAs[year].sort((a, b) => b.count - a.count)

                        return (
                            <Fragment key={`year-${year}`}>
                                <h5 className={'text-light text-decoration-underline'}>{year}</h5>
                                <Row className={'g-2 mb-5'}>
                                    {data.map((sla, i) => (
                                        <Col key={`sla-${year + i}`} lg={4}
                                             className={classNames(`text-center border-bottom`)}>
                                            <div className="bg-dark py-3">
                                                <div
                                                    className={`icon-circle icon-circle-${getStatusColor(sla.status)} text-${getStatusColor(sla.status)} fw-bold`}>
                                                <span
                                                    className="me-1 fs-2">{Math.round((sla.count / total) * 100)}</span>
                                                    <FontAwesomeIcon icon={faPercent}/>
                                                </div>
                                                <h6 className={`mb-1 fw-bold text-${getStatusColor(sla.status)}`}>{sla.status}</h6>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Fragment>
                        )
                    })}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Sla;