import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEye } from '@fortawesome/free-regular-svg-icons';

const TableActions = ({ entity, entityId }: { entity: string, entityId: number }) => {
    const entityPlural = pluralize(entity);

    return <Link to={`/${entityPlural}/${entityId}`}><FontAwesomeIcon icon={faEye}/></Link>;
};

export default TableActions;
