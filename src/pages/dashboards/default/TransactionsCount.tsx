import { Card, Col, Row } from 'react-bootstrap';
import CountUp from 'react-countup';
import CardBgCorner from '../../../components/CardBgCorner';
import { Chip } from '@mui/material';

const TransactionsCount = ({total, total_today}: { total: number, total_today: number }) => {
    return (
        <Card style={{'height': '150px'}}>
            <CardBgCorner corner={2}/>
            <Card.Body>
                <Row className="flex-between-center">
                    <Col className="d-md-flex d-lg-block flex-between-center">
                        <h5 className="mb-md-0 mb-lg-2">Transactions</h5>
                        <Chip sx={{px: .5}} variant={'outlined'} color={'success'} className={`mt-2 mb-3`}
                              label={<CountUp end={total_today} />}/>
                        <h4 className="fs-3 fw-normal text-700"><CountUp end={total}/></h4>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default TransactionsCount;
