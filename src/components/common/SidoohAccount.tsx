import { Link } from "react-router-dom";
import { Account, PhoneChip } from "@nabcellent/sui-react";

const SidoohAccount = ({ account }: { account: Account }) => {
    if (!account) return null;

    return (
        <span>
            {account?.user?.name} {account?.user?.name && <br/>}
            <Link to={`/accounts/${account.id}/details`}>
                <PhoneChip phone={account.phone}/>
            </Link>
        </span>
    );
};

export default SidoohAccount;
