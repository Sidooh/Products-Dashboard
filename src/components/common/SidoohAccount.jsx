import { CONFIG } from 'config';
import PhoneChip from 'components/chips/PhoneChip';

const SidoohAccount = ({ account }) => {
    if (!account) return null;

    return (
        <span>
            {account?.user?.name} {account?.user?.name && <br/>}
            <a href={`${CONFIG.sidooh.services.accounts.dashboard.url}/accounts/${account.id}`} target={'_blank'}>
                <PhoneChip phone={account.phone} textOnly/>
            </a>
        </span>
    );
};

export default SidoohAccount;
