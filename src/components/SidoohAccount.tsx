import { Link } from "react-router-dom";
import { Account, PhoneChip } from "@nabcellent/sui-react";
import { CONFIG } from "../config";

const SidoohAccount = ({ account }: { account: Account }) => {
    if (!account) return null;

    return (
        <span>
            <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${account.id}`}>
                {account.user?.name} {account.user?.name && <br/>}
            </a>
            <Link to={`/accounts/${account.id}/details`}>
                <PhoneChip phone={account.phone}/>
            </Link>
        </span>
    );
};

export default SidoohAccount;
