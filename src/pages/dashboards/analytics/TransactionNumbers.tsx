import { Card, Col, Row } from "react-bootstrap";
import BubbleChart, { BubbleChartData } from "../../../components/charts/BubbleChart";
import { ComponentLoader, getTelcoColor, LoadingButton, SectionError, Telco, Tooltip } from "@nabcellent/sui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { useGetProductTransactionsQuery, useGetTelcoTransactionsQuery } from "../../../features/analytics/analyticsApi";
import { useEffect, useState } from "react";
import { Product } from "../../../utils/enums";
import { getProductColor } from "../../../utils/helpers";
import CardBgCorner from "../../../components/CardBgCorner";

const TelcoChart = () => {
    const [telcoData, setTelcoData] = useState<BubbleChartData[]>([])

    const { data, isError, error, isLoading, isSuccess } = useGetTelcoTransactionsQuery();

    useEffect(() => {
        if (data) {
            const telco = Object.keys(data).map(d => ({
                name: d,
                v: data[d as Telco].reduce((p, c) => p += c.count, 0),
                color: String(getTelcoColor(d as Telco))
            }))

            setTelcoData(telco)

            console.log(telco)
        }
    }, [data])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    return <BubbleChart data={telcoData}/>
}
const ProductChart = () => {
    const [productData, setTelcoData] = useState<BubbleChartData[]>([])

    const { data, isError, error, isLoading, isSuccess } = useGetProductTransactionsQuery();

    useEffect(() => {
        if (data) {
            const product = Object.keys(data).map(d => ({
                name: d,
                v: data[d as Product].reduce((p, c) => p += c.count, 0),
                color: String(getProductColor(d as Product))
            }))

            setTelcoData(product)
        }
    }, [data])

    if (isError) return <SectionError error={error}/>;
    if (isLoading || !isSuccess || !data) return <ComponentLoader/>;

    return <BubbleChart data={productData}/>
}

const TransactionNumbers = () => (
    <Col xs={12}>
        <h5 className="text-primary text-center position-relative">
                <span className="bg-200 px-3">
                    TRANSACTION NUMBERS
                    <Tooltip title="Refresh SLAs" placement="left">
                        <LoadingButton loading={false} className="btn btn-sm border-0 py-2"
                                       spinner-position="replace">
                            <FontAwesomeIcon icon={faSync}/>
                        </LoadingButton>
                    </Tooltip>
                </span>
            <span className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"/>
        </h5>

        <Card>
            <CardBgCorner corner={4}/>
            <Card.Body style={{ backgroundImage: 'linear-gradient(-45deg, rgba(65, 75, 167, 1), rgba(74, 38, 19, 1))' }}>
                <Row>
                    <Col><TelcoChart/></Col>
                    <Col><ProductChart/></Col>
                </Row>
            </Card.Body>
        </Card>
    </Col>
)

export default TransactionNumbers;