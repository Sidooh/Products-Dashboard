import { SLAResponse, useGetSLAQuery } from "../../../features/analytics/analyticsApi";
import { logger } from "../../../utils/logger";
import { Card, Col, Row } from "react-bootstrap";
import { getStatusColor, LoadingButton, SectionError, SectionLoader, Tooltip, groupBy } from "@nabcellent/sui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent, faSync } from "@fortawesome/free-solid-svg-icons";

const Sla = () => {
    const { data, isError, error, isLoading, isSuccess, refetch } = useGetSLAQuery()

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    logger.log(groupBy(data, 'year'))

    const groupedSLAs: { [key: string]: SLAResponse[] } = groupBy(data, 'year')

    return (
        <Row>
            <Col>
                <h5 className="text-primary text-center position-relative">
                <span className="bg-200 dark__bg-1100 px-3">
                    SLA - Success Rate
                    <Tooltip title="Refresh SLAs" placement="left">
                        <LoadingButton loading={false} className="btn btn-sm border-0 py-2"
                                       spinner-position="replace" onClick={() => refetch()}>
                            <FontAwesomeIcon icon={faSync}/>
                        </LoadingButton>
                    </Tooltip>
                </span>
                    <span
                        className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"></span>
                </h5>

                <Card>
                    <Card.Body>
                        {Object.keys(groupedSLAs).map(year => {
                            const total = groupedSLAs[year].reduce((p, c) => p += c.count, 0)

                            return (
                                <>
                                    <h5 className={'text-center text-decoration-underline'}>{year}</h5>
                                    <Row key={year}>
                                        {groupedSLAs[year].map((sla, i) => (
                                            <Col key={`sla-${i}`} md={6} xxl={3}
                                                 className={` text-center ${i !== groupedSLAs[year].length - 1 && 'border-end'}`}>
                                                <div
                                                    className={`icon-circle icon-circle-primary text-${getStatusColor(sla.status)} fw-bold`}>
                                                    <span
                                                        className="me-1 fs-2">{Math.round((sla.count / total) * 100)}</span>
                                                    <FontAwesomeIcon icon={faPercent}/>
                                                </div>
                                                <h6 className={`mb-1 text-${getStatusColor(sla.status)}`}>{sla.status}</h6>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )
                        })}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Sla;