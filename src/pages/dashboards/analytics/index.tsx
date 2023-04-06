import TransactionsSLA from "./TransactionsSLA";
import Revenue from "./Revenue";
import Transactions from "./Transactions";
import { Row } from "react-bootstrap";
import {
    CategoryScale,
    Chart,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    SubTitle,
    Title,
    Tooltip
} from "chart.js";
import TelcoTransactions from "./TelcoTransactions";
import TelcoRevenue from "./TelcoRevenue";
import ProductTransactions from "./ProductTransactions";
import ProductRevenue from "./ProductRevenue";
import ProductsSLA from "./ProductsSLA";

Chart.register(Title, SubTitle, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)
Chart.defaults.color = '#fff'
Chart.defaults.font.weight = '700'
Chart.defaults.font.family = "'Avenir', sans-serif"

const Analytics = () => {
    return (
        <Row className={'g-3'}>
            <h5 className="text-primary text-center position-relative">
                <span className="bg-200 px-3">TRANSACTIONS BY TELCO</span>
                <span className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"/>
            </h5>
            <TelcoTransactions/>
            <TelcoRevenue/>

            <h5 className="text-primary text-center position-relative">
                <span className="bg-200 px-3">TRANSACTIONS BY PRODUCT</span>
                <span className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"/>
            </h5>
            <ProductTransactions/>
            <ProductRevenue/>

            <h5 className="text-primary text-center position-relative">
                <span className="bg-200 px-3">TRANSACTIONS</span>
                <span className="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"/>
            </h5>
            <Transactions/>
            <Revenue/>

            <TransactionsSLA/>
            <ProductsSLA/>

            {/*<TransactionNumbers/>*/}
        </Row>
    );
};

export default Analytics;
