import React, {Fragment, useState} from 'react'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

export default function CellDialog({buttonText, dialogTitle, component}) {
    
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }    

    return (
        <Fragment>
            <Button onClick={handleOpen}>{buttonText}</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {component}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}