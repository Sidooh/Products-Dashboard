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

/*const payment = {
    all       : [4, 1, 6, 2, 7, 12, 4, 6, 5, 4, 5, 10],
    successful: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
    failed    : [1, 0, 2, 1, 2, 1, 1, 0, 0, 1, 0, 2]
};*/

const LinePayment = () => {
    const {data, isError, error, isLoading, isSuccess} = useGetRevenueDataQuery();
    console.log(data);

    const [paymentStatus, setPaymentStatus] = useState<string | Status>(Status.COMPLETED);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    return (
        <Card className="rounded-3 overflow-hidden h-100 shadow-none">
            <Card.Body className="bg-line-chart-gradient" as={Flex} justifyContent="between" direction="column">
                <Row className="align-items-center g-0">
                    <Col className="light">
                        <h4 className="text-white mb-0">Today $764.39</h4>
                        <p className="fs--1 fw-semi-bold text-white">
                            Yesterday <span className="opacity-50">$684.87</span>
                        </p>
                    </Col>
                    <Col xs="auto" className="d-none d-sm-flex align-items-center">
                        <button className="btn btn-sm btn-outline-light me-2 refresh-chart" type="button"
                                title="Update Chart">
                            <FontAwesomeIcon icon={faSync}/>
                        </button>
                        <Form.Select size="sm" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                            <option value="all">All Payments</option>
                            <option value="successful">Successful Payments</option>
                            <option value="failed">Failed Payments</option>
                        </Form.Select>
                    </Col>
                </Row>
                <RevenueChart data={data} labels={data.yesterday.labels} paymentStatus={paymentStatus} style={{height: '200px'}}/>
            </Card.Body>
        </Card>
    );
};

export default LinePayment;
