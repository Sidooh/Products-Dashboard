import { ComponentLoader } from "@nabcellent/sui-react";
import { Suspense } from "react";
import SLA from "./SLA";

const Dashboard = () => {
    return (
        <Suspense fallback={<ComponentLoader/>}><SLA/></Suspense>
    );
};

export default Dashboard;
