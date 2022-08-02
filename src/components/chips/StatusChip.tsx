import { Status } from 'utils/enums';
import { Chip, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Check, Error, EventBusy, Info, Pending } from '@mui/icons-material';
import { useState } from 'react';

const statusProps = (status: Status, colorIcon = true) => {
    let color: undefined | 'success' | 'warning' | 'info' | 'error' = undefined, icon;

    if ([Status.COMPLETED, Status.ACTIVE].includes(status)) {
        color = 'success';
        icon = <Check color={colorIcon ? color : 'disabled'}/>;
    } else if (status === Status.PENDING) {
        color = 'warning';
        icon = <Pending color={colorIcon ? color : 'disabled'}/>;
    } else if (status === Status.REFUNDED) {
        color = 'info';
        icon = <Info color={colorIcon ? color : 'disabled'}/>;
    } else if ([Status.FAILED].includes(status)) {
        color = 'error';
        icon = <Error color={colorIcon ? color : 'disabled'}/>;
    } else if ([Status.EXPIRED].includes(status)) {
        icon = <EventBusy color={colorIcon ? color : 'disabled'}/>;
    }

    return {color, icon};
};

type StatusChipType = {
    status?: Status
    bg?: boolean
    entity: string,
    entityId: number
}

const StatusChip = ({status, bg = true, entity, entityId}: StatusChipType) => {
    if (!status) status = Status.FAILED;

    const {color, icon} = statusProps(status, false);

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | undefined>(undefined);
    const open = Boolean(anchorEl);
    const handleClose = () => setAnchorEl(undefined);

    /*TODO: Handle update with redux*/
    const handleUpdate = (status: Status) => {
        console.log(entity, entityId, status);
    };

    const menuItems = Object.values(Status).map(status => {
        const {icon} = statusProps(status);

        return {title: `Mark as ${status}`, icon, status};
    });

    return (
        <>
            <Chip sx={{px: .5}} onClick={e => setAnchorEl(e.currentTarget)}
                  variant={bg ? 'filled' : 'outlined'}
                  color={color} className={`fw-bold fs-7`}
                  label={<span>{status}</span>}
                  icon={icon}
            />
            <Menu
                anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'left',}}
                transformOrigin={{vertical: 'top', horizontal: 'left',}}>
                {
                    menuItems.map((item, i) => {
                        return (
                            <MenuItem key={`item-${i}`} onClick={() => handleUpdate(item.status)}>
                                <ListItemIcon>{item.icon}</ListItemIcon> {item.title}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </>
    );
};

export default StatusChip;
