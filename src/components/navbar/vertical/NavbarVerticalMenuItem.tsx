import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteChildType } from 'utils/types';
import { Badge, Flex } from '@nabcellent/sui-react';

export type NavbarVerticalMenuItemType = {
    route: RouteChildType
};

const NavbarVerticalMenuItem = ({route}: NavbarVerticalMenuItemType) => {
    return (
        <Flex alignItems="center">
            {route.icon && (
                <span className="nav-link-icon">
          <FontAwesomeIcon icon={route.icon}/>
        </span>
            )}
            <span className="nav-link-text ps-1">{route.name}</span>
            {route.badge && (
                <Badge soft pill bg={route.badge.type} className="ms-2">
                    {route.badge.text}
                </Badge>
            )}
        </Flex>
    );
};

export default React.memo(NavbarVerticalMenuItem);
