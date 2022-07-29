import { Card, Col, Row } from 'react-bootstrap';
import CountUp from 'react-countup';
import { Chip } from '@mui/material';
import CardBgCorner from "../../../../../components/CardBgCorner";

const Revenue = ({total, total_today}: { total: number, total_today: number }) => {
    return (
        <Card style={{'height': '150px'}}>
            <CardBgCorner/>
            <Card.Body>
                <Row className="sflex-between-center">
                    <Col className="d-md-flex d-lg-block flex-between-center">
                        <h5 className="mb-md-0 mb-lg-2">Revenue</h5>
                        <Chip sx={{px: .5}} variant={'outlined'} color={'success'} className={`mt-2 mb-3`}
                              label={<CountUp end={total_today} prefix={' KES '} separator=","/>}/>
                        <h4 className="fs-3 fw-normal text-700 align-text-bottom">
                            <CountUp end={total} prefix={'KES '} separator=","/>
                        </h4>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default Revenue;
