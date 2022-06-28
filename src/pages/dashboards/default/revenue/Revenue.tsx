import { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import RevenueChart from './RevenueChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Status } from 'utils/enums';
import { useGetRevenueDataQuery } from 'features/products/productsAPI';
import { SectionError } from 'components/common/Error';
import { SectionLoader } from 'components/common/Loader';
import CountUp from 'react-countup';

const Revenue = ({total_today, total_yesterday}: { total_today: number, total_yesterday: number }) => {
    const {data, isError, error, isLoading, isSuccess} = useGetRevenueDataQuery();
    console.log(data);

    const [paymentStatus, setPaymentStatus] = useState<string | Status>(Status.COMPLETED);

    return <SectionLoader/>;
    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    return (
        <Card className="rounded-3 overflow-hidden h-100 shadow-none">
            <Card.Body className="bg-line-chart-gradient" as={Flex} justifyContent="between" direction="column">
                <Row className="align-items-center g-0">
                    <Col className="light">
                        <h4 className="text-white mb-0">
                            Today <CountUp end={total_today} prefix={'KES '} decimals={2}/>
                        </h4>
                        <p className="fs--1 fw-semi-bold text-white">
                            Yesterday {' '}
                            <span className="opacity-50">
                                <CountUp end={total_yesterday} prefix={'KES '} decimals={2}/>
                            </span>
                        </p>
                    </Col>
                    <Col xs="auto" className="d-none d-sm-flex align-items-center">
                        <button className="btn btn-sm btn-outline-light me-2 refresh-chart" type="button"
                                title="Update Chart">
                            <FontAwesomeIcon icon={faSync}/>
                        </button>
                        <Form.Select size="sm" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                            <option value="ALL">All Payments</option>
                            {
                                Object.values(Status).map((status, i) => (
                                    <option key={`status-${i}`} value={status}>{status} Payments</option>
                                ))
                            }
                        </Form.Select>
                    </Col>
                </Row>
                <RevenueChart data={data} labels={data.yesterday["ALL"].labels} status={paymentStatus}
                              style={{height: '200px'}}/>
            </Card.Body>
        </Card>
    );
};

export default Revenue;
