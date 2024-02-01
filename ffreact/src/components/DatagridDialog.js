import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function DataGridDialog(props) {
//   const [open, setOpen] = React.useState(false);

  const open = props.open;
  const setOpen = props.setOpen;
  const DataGridComponent = props.DataGridComponent;
  const setID = props.setID;

  /*const handleClickOpen = () => {
    setOpen(true);
  };*/

  const handleClose = () => {
    setOpen(false);
  };

  if (!DataGridComponent) {
    return (
        <div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Entry</DialogTitle>
            <DialogContent>
                {/* <AddForm addEntry={addEntry} handleClose={handleClose} latestKey={latestKey}/> */}
                <Typography variant='h6'>Placeholder</Typography>
            </DialogContent>
            <DialogActions>
            {/* <Button onClick={handleClose}>Cancel</Button> */}
            {/* <Button onClick={handleClose}>Add</Button> */}
            </DialogActions>
        </Dialog>
        </div>
    )
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select</DialogTitle>
        <DialogContent>
            <DataGridComponent setID={setID} handleClose={handleClose}/>
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