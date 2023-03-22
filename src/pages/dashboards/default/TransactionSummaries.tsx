import { Card, Col, Row } from "react-bootstrap";
import { useGetDashboardSummariesQuery } from "features/products/productsAPI";
import CountUp from 'react-countup';
import { Badge, ComponentLoader, SectionError } from "@nabcellent/sui-react";
import CardBgCorner from 'components/CardBgCorner';

const TransactionSummaries = () => {
    const { data, isError, error, isLoading, isSuccess } = useGetDashboardSummariesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    return (
        <>
            <Row className="g-3 g-xxl-0 h-100">
                <Col md={6} xxl={12} className={'mb-xxl-2'}>
                    <Card className={'h-xl-100'}>
                        <CardBgCorner corner={2}/>
                        <Card.Body as={Row} className={'position-relative'}>
                            <Col className="d-md-flex flex-column justify-content-center">
                                <h5 className="mb-md-0 mb-lg-2">Transactions</h5>
                                <h4 className="fs-2 fw-normal text-700 m-0">
                                    <CountUp end={data.total_transactions} separator=","/>
                                </h4>
                            </Col>
                            <Col className={'d-flex align-items-start justify-content-end'}>
                                <Badge pill>
                                    <CountUp end={data.total_transactions_today} separator=","/>
                                </Badge>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={12} className={'mt-xxl-2'}>
                    <Card className={'h-xl-100'}>
                        <CardBgCorner/>
                        <Card.Body as={Row} className={'position-relative'}>
                            <Col className="d-md-flex flex-column justify-content-center">
                                <h5 className="mb-md-0 mb-lg-2">Revenue</h5>
                                <h4 className="fs-2 fw-normal text-700 m-0">
                                    <CountUp prefix={'KES '} end={data.total_revenue} separator=","/>
                                </h4>
                            </Col>
                            <Col className={'d-flex align-items-start justify-content-end'}>
                                <Badge bg={'success'} pill>
                                    <CountUp prefix={'KES '} end={data.total_revenue_today} separator=","/>
                                </Badge>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TransactionSummaries;
