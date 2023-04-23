import { Card, Col, Row } from "react-bootstrap";
import { useGetProvidersBalancesQuery } from "features/products/productsAPI";
import CountUp from 'react-countup';
import { ComponentLoader, SectionError } from "@nabcellent/sui-react";
import CardBgCorner from 'components/CardBgCorner';

const ProviderBalances = () => {
    const { data, isError, error, isLoading, isSuccess } = useGetProvidersBalancesQuery();

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    return (
        <Row className="g-3 h-100">
            <Col md={4} className={'mb-xxl-2'}>
                <Card className={'bg-line-chart-gradient'}>
                    <CardBgCorner/>
                    <Card.Body className={'position-relative'}>
                        <h6 className="mb-md-0 mb-lg-2 text-light">Tanda Float Balance</h6>
                        <h4 className="m-0 fs-2 fw-normal text-white">
                            <CountUp end={data.tanda_float_balance} separator="," prefix={'KES '} decimals={2}/>
                        </h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className={'mb-xxl-2'}>
                <Card style={{ backgroundColor: 'rgba(20, 20, 20, .8)' }}>
                    <CardBgCorner corner={2}/>
                    <Card.Body className={'position-relative'}>
                        <h6 className="mb-md-0 mb-lg-2 text-secondary">Kyanda Float Balance</h6>
                        <h4 className="m-0 fs-2 fw-normal text-secondary">
                            <CountUp end={data.kyanda_float_balance} separator="," prefix={'KES '} decimals={2}/>
                        </h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className={'mb-xxl-2'}>
                <Card style={{ backgroundColor: 'rgba(20, 20, 20, .8)' }}>
                    <CardBgCorner corner={3}/>
                    <Card.Body className={'position-relative'}>
                        <h6 className="mb-md-0 mb-lg-2 text-secondary">AT Airtime Balance</h6>
                        <h4 className="m-0 fs-2 fw-normal text-secondary">
                            <CountUp end={data.at_airtime_balance} separator="," prefix={'KES '} decimals={2}/>
                        </h4>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ProviderBalances;
