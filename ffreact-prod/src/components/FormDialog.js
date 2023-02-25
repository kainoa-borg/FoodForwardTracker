import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function FormDialog(props) {
//   const [open, setOpen] = React.useState(false);

  const open = props.open;
  const setOpen = props.setOpen;
  const AddForm = props.AddFormComponent;
  const addEntry = props.addEntry;
  const latestKey = props.latestKey;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Entry</DialogTitle>
        <DialogContent>
            <AddForm addEntry={addEntry} handleClose={handleClose} latestKey={latestKey}/>
            {/* <Typography variant='h6'>Placeholder</Typography> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          {/* <Button onClick={handleClose}>Add</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}