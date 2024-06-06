import TransactionsSLOs from './TransactionsSLOs';
import Revenue from './Revenue';
import Transactions from './Transactions';
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
    Tooltip,
} from 'chart.js';
import TelcoTransactions from './TelcoTransactions';
import TelcoRevenue from './TelcoRevenue';
import ProductTransactions from './ProductTransactions';
import ProductRevenue from './ProductRevenue';
import VendorsSLO from './VendorsSLO';
import ProductsSLO from './ProductsSLO';

Chart.register(Title, SubTitle, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);
Chart.defaults.color = '#fff';
Chart.defaults.font.weight = 700;
Chart.defaults.font.family = "'Avenir', sans-serif";

const Analytics = () => {
    return (
        <div className={'grid grid-cols-1 gap-3'}>
            <h5 className="text-primary text-center relative">
                <span className="bg-200 px-3">TRANSACTIONS BY TELCO</span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>
            <TelcoTransactions />
            <TelcoRevenue />

            <h5 className="text-primary text-center relative">
                <span className="bg-200 px-3">TRANSACTIONS BY PRODUCT</span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>
            <ProductTransactions />
            <ProductRevenue />

            <h5 className="text-primary text-center relative">
                <span className="bg-200 px-3">TRANSACTIONS</span>
                <span className="border absolute top-50 translate-middle-y w-100 start-0 z-index--1" />
            </h5>
            <Transactions />
            <Revenue />

            <TransactionsSLOs />
            <ProductsSLO />
            <VendorsSLO />
        </div>
    );
};

export default Analytics;
