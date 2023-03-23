import { useGetEarningAccountQuery } from '../../features/earning-accounts/earningAccountsApi';
import { Badge, SectionError, SectionLoader } from '@nabcellent/sui-react';
import CardBgCorner from '../../components/CardBgCorner';
import { Card, Col, Row } from 'react-bootstrap';
import moment from 'moment/moment';
import { useParams } from 'react-router-dom';
import SidoohAccount from '../../components/common/SidoohAccount';
import CountUp from 'react-countup';
import { logger } from 'utils/logger';

const Show = () => {
    const id = Number(useParams().id);
    let { data, isLoading, isSuccess, isError, error } = useGetEarningAccountQuery(id);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <SectionLoader/>;

    logger.log(data);

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner corner={2}/>
                <Card.Body className="position-relative">
                    <h5>Earning Account Details: #{data.account.id}</h5>
                    <SidoohAccount account={data.account}/>
                    <p className="fs--1 m-0 mt-4">{moment(data.account.created_at).format('MMM D, Y, hh:mm A')}</p>
                </Card.Body>
            </Card>

            <Row className="g-3">
                {data.earning_accounts.map(a => (
                    <Col>
                        <Card className={'bg-line-chart-gradient'}>
                            <Card.Body className={'position-relative'}>
                                <h6 className="text-white">{a.type}</h6>
                                <h4 className="text-white m-0">
                                    <CountUp end={a.self_amount} prefix={'KES '} separator=","/>
                                </h4>
                                <Badge bg={'success'} pill className={'position-absolute top-0 end-0 m-3'}>
                                    <CountUp end={a.invite_amount} prefix={'KES '}/>
                                </Badge>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Show;
