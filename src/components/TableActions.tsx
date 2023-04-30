import { Link } from 'react-router-dom';
import { IconButton, Tooltip, toPlural } from "@nabcellent/sui-react";
import { FaRegEye } from "react-icons/all";

const TableActions = ({ entity, entityId }: { entity: string, entityId: number }) => {
    const entityPlural = toPlural(entity);

    return (
        <Link to={`/${entityPlural}/${entityId}`}>
            <Tooltip title={'View'}>
                <IconButton size={'sm'}><FaRegEye/></IconButton>
            </Tooltip>
        </Link>
    );
};

export default TableActions;
