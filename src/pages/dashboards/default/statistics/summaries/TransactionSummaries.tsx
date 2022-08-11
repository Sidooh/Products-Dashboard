import { Card, Col, Row } from "react-bootstrap";
import { useGetDashboardSummariesQuery } from "features/products/productsAPI";
import CountUp from 'react-countup';
import { Badge, ComponentLoader, SectionError } from "@nabcellent/sui-react";
import CardBgCorner from 'components/CardBgCorner';

const TransactionSummaries = () => {
    const {data, isError, error, isLoading, isSuccess} = useGetDashboardSummariesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const {data: stats} = data;

    return (
        <>
            <Row className="g-3 g-xxl-0 h-100">
                <Col md={6} xxl={12} className={'mb-xxl-2'}>
                    <Card className={'h-xl-100'}>
                        <CardBgCorner corner={2}/>
                        <Card.Body as={Row}>
                            <Col className="d-md-flex d-lg-block flex-between-center">
                                <h5 className="mb-md-0 mb-lg-2">Transactions</h5>
                                <h4 className="fs-3 fw-normal text-700">
                                    <CountUp end={stats.total_transactions} separator=","/>
                                </h4>
                            </Col>
                            <Col className={'d-flex align-items-start justify-content-end'}>
                                <Badge pill>
                                    <CountUp end={stats.total_transactions_today} separator=","/>
                                </Badge>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={12} className={'mt-xxl-2'}>
                    <Card className={'h-xl-100'}>
                        <CardBgCorner/>
                        <Card.Body as={Row}>
                            <Col className="d-md-flex d-lg-block flex-between-center">
                                <h5 className="mb-md-0 mb-lg-2">Revenue</h5>
                                <h4 className="fs-3 fw-normal text-700">
                                    <CountUp end={stats.total_revenue} separator=","/>
                                </h4>
                            </Col>
                            <Col className={'d-flex align-items-start justify-content-end'}>
                                <Badge bg={'success'} pill>
                                    <CountUp prefix={'KES '} end={stats.total_revenue_today} separator=","/>
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
