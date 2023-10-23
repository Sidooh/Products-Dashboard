import { Card, Col, Row } from "react-bootstrap";
import { useGetDashboardSummariesQuery } from "features/apis/dashboardApi";
import CountUp from 'react-countup';
import { Badge, ComponentLoader, IconButton, SectionError } from "@nabcellent/sui-react";
import CardBgCorner from 'components/CardBgCorner';
import { CacheKey } from "../../../utils/enums";
import { useState } from "react";
import { TbRefresh } from "react-icons/tb";

const TransactionSummaries = () => {
    const [bypassCache, setBypassCache] = useState('')
    const {
        data,
        isError,
        error,
        isLoading,
        isSuccess,
        refetch,
        isFetching
    } = useGetDashboardSummariesQuery(bypassCache);

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    const handleRefetch = (cacheKey: CacheKey) => {
        if (cacheKey !== bypassCache) setBypassCache(cacheKey)

        refetch()
    }

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
                            <div className={'position-absolute d-flex align-items-center top-0 end-0 m-2'}>
                                <IconButton size="sm" color={'secondary'} className={'me-1'}
                                            loading={isFetching && bypassCache === CacheKey.TOTAL_TRANSACTIONS_COUNT}
                                            onClick={() => handleRefetch(CacheKey.TOTAL_TRANSACTIONS_COUNT)}>
                                    <TbRefresh/>
                                </IconButton>
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
                            <div className={'position-absolute d-flex align-items-center top-0 end-0 m-2'}>
                                <IconButton size="sm" color={'secondary'} className={'me-1'}
                                            loading={isFetching && bypassCache === CacheKey.TOTAL_REVENUE}
                                            onClick={() => handleRefetch(CacheKey.TOTAL_REVENUE)}>
                                    <TbRefresh/>
                                </IconButton>
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
