import React, { MouseEvent, MouseEventHandler} from 'react'
import { useEffect, useRef, useState } from "react";
import { Button, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EngineeringIcon from '@mui/icons-material/Engineering';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function DropdownButton() {
  const [anchorEl, setAnchorEl] = useState<null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttonComponent = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    setPosition(buttonComponent.current? (buttonComponent.current.getBoundingClientRect().right + 12): 0);
  }, [buttonComponent]);
  return (
    <>
      <Button ref={buttonComponent} onClick={handleClick} variant="outlined" sx={{ width: 200, backgroundColor: open ? 'rgba(0,0,0,0.2)' : "", "& .MuiButton-endIcon": { color: "gold"} }} endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>DropDown Button</Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            zIndex: 1,
            left: `${position}px !important`,
            overflow: 'visible',
            boxShadow: 9,
            mt: 1,
            ml: 3,
            '& .MuiListItemIcon-root': {
              mr: 1,
              color: "primary.main"
            },
            "& .MuiMenuItem-root ": {
              color: "rgba(0,0,0,0.8)"
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 14,
              left: -5,
              width: 10,
              height: 10,
              backgroundColor: "background.paper",
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem>
          Item 1
        </MenuItem>
        <MenuItem>
           Item 2
        </MenuItem>
        <MenuItem>
           Item 3
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          Scheduling
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EngineeringIcon />
          </ListItemIcon>
          Maintenance
        </MenuItem>
      </Menu>
    </>
  );
}