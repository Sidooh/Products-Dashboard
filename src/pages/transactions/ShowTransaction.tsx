import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import StatusChip from 'components/chips/StatusChip';
import { Status } from 'utils/enums';
import CardBgCorner from 'components/CardBgCorner';
import { IMAGES } from '../../constants/images';
import MpesaPayment from './MpesaPayment';
import TandaTransaction from './TandaTransaction';

const ShowTransaction = () => {
    const {id} = useParams();
    console.log('Transaction ID:', id);

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner/>
                <Card.Body className="position-relative">
                    <h5>Transaction Details: #12612</h5>
                    <p className="fs--1">Jun 24, 2022, 04:29 PM</p>
                    <strong className="me-2">Status: </strong>
                    <StatusChip status={Status.COMPLETED} entity={'transaction'} entityId={Number(id)}/>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Body>
                    <Row>
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Account</h5>
                            <h6 className="mb-2">
                                <a href="https://sidooh-admin-dashboard-iw4itjwa5a-uc.a.run.app/admin/users/50">
                                    Michael Nabangi
                                </a>
                            </h6>
                            <p className="mb-0 fs--1">
                                <strong>Email: </strong>
                                <a href="mailto:miguelnabz@gmail.com">miguelnabz@gmail.com</a>
                            </p>
                            <p className="mb-0 fs--1">
                                <strong>Phone: </strong>
                                <a href="tel:254110039317">254110039317</a>
                            </p>
                        </Col>
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h5 className="mb-3 fs-0">Details</h5>
                            <h6 className="mb-2">Airtime Purchase - 254736388405</h6>
                            <p className="mb-0 fs--1"><strong>Type: </strong>PAYMENT</p>
                            <div className="fs--1"><strong>Amount: </strong>(KES&nbsp;100)</div>
                        </Col>
                        <Col lg={4}>
                            <h5 className="mb-3 fs-0">Payment</h5>
                            <div className="d-flex">
                                <img className="me-3" src={IMAGES.icons.cash} width="40" height="40" alt=""/>
                                <div className="flex-1">
                                    <h6 className="mb-0">MPESA STK</h6>
                                    <p className="mb-0 fs--1"><strong>Amount: </strong>KES&nbsp;100</p>
                                    <div className="fs--1">
                                        <strong className="me-2">Status: </strong>
                                        <StatusChip status={Status.COMPLETED} entity={'transaction'}
                                                    entityId={Number(id)}/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <MpesaPayment/>
            <TandaTransaction/>
        </>
    );
};

export default ShowTransaction;
