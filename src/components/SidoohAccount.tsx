import { CONFIG } from '@/config';
import { Account, Phone } from '@nabcellent/sui-react';
import { Link } from 'react-router-dom';

const SidoohAccount = ({ account }: { account?: Account }) => {
    if (!account) return <>-</>;

    return (
        <p>
            {account?.user?.name} {account?.user?.name && <br />}
            <Link
                className={'text-sm'}
                to={`${CONFIG.services.accounts.dashboard.url}/accounts/${account.id}`}
                target={'_blank'}
            >
                <Phone phone={account.phone} />
            </Link>
        </p>
    );
};

export default SidoohAccount;
