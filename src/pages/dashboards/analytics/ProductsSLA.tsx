import { useGetProductsSLAQuery } from "../../../features/analytics/analyticsApi";
import { Card, Col, Row } from "react-bootstrap";
import { ComponentLoader, LoadingButton, SectionError, Str, Tooltip } from "@nabcellent/sui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import CardBgCorner from "../../../components/CardBgCorner";
import CountUp from "react-countup";
import moment from "moment";
import { FaPercentage } from "react-icons/all";

const ProductsSLA = () => {
    const { data, isError, error, isLoading, isSuccess, refetch, isFetching } = useGetProductsSLAQuery()

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    return (
        <Col xs={12} className={'mb-3'}>
            <h5 className="text-primary text-center position-relative">
                    <span className="bg-200 px-3">
                        PRODUCT SUCCESS RATE - SLA
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
                <Card.Body style={{ backgroundImage: 'linear-gradient(-45deg, rgba(0, 0, 0, 1), rgb(245, 183, 0))' }}>
                    <h5 className={'text-primary text-decoration-underline'}>{moment().year()}</h5>
                    <Row className={'g-2'}>
                        {Object.keys(data).map((product) => {
                            let color = 'success', sla = data[product as keyof typeof data]

                            if(sla < 70) color = 'danger'
                            else if(sla < 90) color = 'warning'

                            return (
                                <Col key={product} lg={4} className={`text-center border-bottom`}>
                                    <div className="bg-dark py-3">
                                        <div className={`icon-circle icon-circle-${color} fw-bold`}>
                                            <CountUp end={data[product as keyof typeof data]} className="me-1 fs-2"/>
                                            <FaPercentage/>
                                        </div>
                                        <h6 className={`mb-1 fw-bold text-${color}`}>{Str.headline(product)}</h6>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProductsSLA;