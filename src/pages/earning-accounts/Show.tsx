import { useGetEarningAccountQuery } from '../../features/earning-accounts/earningAccountsApi';
import { Flex, SectionError, SectionLoader } from '@nabcellent/sui-react';
import CardBgCorner from '../../components/CardBgCorner';
import { Card, Col, Row } from 'react-bootstrap';
import moment from 'moment/moment';
import { useParams } from 'react-router-dom';
import SidoohAccount from '../../components/common/SidoohAccount';
import CountUp from 'react-countup';

const Show = () => {
    const id = Number(useParams().id);
    let { data: account, isLoading, isSuccess, isError, error } = useGetEarningAccountQuery(id);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !account) return <SectionLoader/>;

    console.log(account);

    return (
        <>
            <Card className={'mb-3'}>
                <CardBgCorner corner={2}/>
                <Card.Body className="position-relative">
                    <Flex justifyContent={'between'}>
                        <h5>Earning Account Details: #{account.id}</h5>
                        <div className={'text-end'}>
                            <h4 className={'m-0'}>Type</h4>
                            <small><b>{account.type}</b></small>
                        </div>
                    </Flex>
                    <SidoohAccount account={account.account}/>
                    <p className="fs--1 m-0 mt-4">{moment(account.created_at).format('MMM D, Y, hh:mm A')}</p>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col>
                    <Card className={'bg-line-chart-gradient'}>
                        <Card.Header className={'bg-transparent light'}>
                            <h6 className="text-white">SELF</h6>
                            <h4 className="text-white m-0">
                                <CountUp end={account.self_amount} prefix={'KES '} separator=","/>
                            </h4>
                        </Card.Header>
                    </Card>
                </Col>
                <Col>
                    <Card className={'bg-line-chart-gradient'}>
                        <Card.Header className={'bg-transparent light'}>
                            <h6 className="text-white">INVITES</h6>
                            <h4 className="text-white m-0">
                                <CountUp end={account.invite_amount} prefix={'KES '} separator=","/>
                            </h4>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Show;
