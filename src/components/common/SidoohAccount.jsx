import { CONFIG } from 'config';
import PhoneChip from 'components/chips/PhoneChip';
import {ReadMore} from "@mui/icons-material";
import {Link} from "react-router-dom";

const SidoohAccount = ({ account }) => {
    if (!account) return null;

    return (
        <span>
            {account?.user?.name} {account?.user?.name && <br/>}
            <Link to={`/accounts/${account.id}/details`}>{account.phone}</Link>
            {/*<a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${account.id}`} target={'_blank'}>*/}
            {/*    <PhoneChip phone={account.phone} textOnly/>*/}
            {/*</a>*/}
        </span>
    );
};

export default SidoohAccount;
