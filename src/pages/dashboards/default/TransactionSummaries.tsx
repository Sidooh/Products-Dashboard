import { Card, Col, Row } from "react-bootstrap";
import { useGetDashboardSummariesQuery } from "features/dashboard/dashboardApi";
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
                        <Card.Body className={'position-relative d-flex flex-column justify-content-center'}>
                            <h6 className="mb-md-0 mb-lg-2">Transactions</h6>
                            <h5 className="text-700 m-0">
                                <CountUp end={data.total_transactions} separator=","/>
                            </h5>
                            <div className={'position-absolute top-0 end-0 m-3'}>
                                <Badge pill>
                                    <CountUp end={data.total_transactions_today} separator=","/>
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xxl={12} className={'mt-xxl-2'}>
                    <Card className={'h-xl-100'}>
                        <CardBgCorner/>
                        <Card.Body className={'position-relative d-flex flex-column justify-content-center'}>
                            <h6 className="mb-md-0 mb-lg-2">Revenue</h6>
                            <h5 className="text-700 m-0">
                                <CountUp prefix={'KES '} end={data.total_revenue} separator=","/>
                            </h5>
                            <div className={'position-absolute top-0 end-0 m-3'}>
                                <Badge bg={'success'} pill>
                                    <CountUp prefix={'KES '} end={data.total_revenue_today} separator=","/>
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TransactionSummaries;
