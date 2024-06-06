import { Link } from 'react-router-dom';
import { IconButton, Str, Tooltip } from '@nabcellent/sui-react';
import { FaRegEye } from 'react-icons/fa6';

const TableActions = ({ entity, entityId }: { entity: string; entityId: number }) => {
    const entityPlural = Str.toPlural(entity);

    return (
        <Link to={`/${entityPlural}/${entityId}`}>
            <Tooltip title={'View'} asChild>
                <IconButton variant={'ghost'} className={'w-7 h-7'} icon={FaRegEye} iconSize={15} />
            </Tooltip>
        </Link>
    );
};

export default TableActions;
