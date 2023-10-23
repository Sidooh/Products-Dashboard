import { Card, Col, Row } from "react-bootstrap";
import { useGetProvidersBalancesQuery } from "features/apis/dashboardApi";
import CountUp from 'react-countup';
import { ComponentLoader, IconButton, SectionError } from "@nabcellent/sui-react";
import CardBgCorner from 'components/CardBgCorner';
import { useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { CacheKey } from "../../../utils/enums";

const ProviderBalances = () => {
    const [bypassCache, setBypassCache] = useState('')
    const {
        data,
        isError,
        error,
        isLoading,
        isSuccess,
        isFetching,
        refetch
    } = useGetProvidersBalancesQuery(bypassCache);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const handleRefetch = (cacheKey: CacheKey) => {
        if(cacheKey !== bypassCache) setBypassCache(cacheKey)

        refetch()
    }

    return (
        <Row className="g-3 h-100">
            <Col md={4} className={'mb-xxl-2'}>
                <Card className={'bg-line-chart-gradient'}>
                    <CardBgCorner/>
                    <Card.Body className={'position-relative'}>
                        <IconButton size="sm" color={'primary'} className={'position-absolute top-0 end-0 m-2'}
                                    loading={isFetching && bypassCache === CacheKey.TANDA_FLOAT_BALANCE}
                                    onClick={() => handleRefetch(CacheKey.TANDA_FLOAT_BALANCE)}>
                            <TbRefresh/>
                        </IconButton>

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
                        <IconButton size="sm" color={'primary'} className={'position-absolute top-0 end-0 m-2'}
                                    loading={isFetching && bypassCache === CacheKey.KYANDA_FLOAT_BALANCE}
                                    onClick={() => handleRefetch(CacheKey.KYANDA_FLOAT_BALANCE)}>
                            <TbRefresh/>
                        </IconButton>

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
                        <IconButton size="sm" color={'primary'} className={'position-absolute top-0 end-0 m-2'}
                                    loading={isFetching && bypassCache === CacheKey.AT_AIRTIME_BALANCE}
                                    onClick={() => handleRefetch(CacheKey.AT_AIRTIME_BALANCE)}>
                            <TbRefresh/>
                        </IconButton>

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
