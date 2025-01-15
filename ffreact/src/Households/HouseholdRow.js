import AllergiesList from './AllergiesList.js'
import React, { useState } from 'react'
import { Grid, TextField, Typography, Paper, Button, IconButton, Box, TableRow, TableCell } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete' 
import { Check } from '@mui/icons-material';
//import { Link, useNavigate } from "react-router-dom"

// Household Row component
// Takes: key of current row, the state of the Household Page's hh list, deleteHousehold callback, handleEditClick callback
// Returns a household table row component 
const HouseholdRow = (props) => {
    const {thisKey, household, deleteHousehold, handleEditClick} = props;
    const key = thisKey;
    const hh = household;
    const [initialValues, setInitialValues] = useState({
        name: "",
        color: ""
    });

    const TrueMarker = ((bool) => {
        if (bool) {
            return <Check></Check>
        }
    });

    // HTML structure of this component
    return (
        <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align='left'>{hh.hh_name}</TableCell>
            <TableCell align='left'>{hh.num_adult}</TableCell>
            <TableCell align='left'>{hh.num_child_lt_6}</TableCell>
            <TableCell align='left'>{hh.num_child_gt_6}</TableCell>
            <TableCell align='left'>{hh.phone}</TableCell>
            <TableCell align='left'>{hh.street}</TableCell>
            <TableCell align='left'>{hh.city}</TableCell>
            <TableCell align='left'>{hh.state}</TableCell>
            <TableCell align='left'>{hh.pcode}</TableCell>
            <TableCell align='left'>{hh.delivery_notes}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.sms_flag))}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.veg_flag))}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.gf_flag))}</TableCell>
            <TableCell aligh='left'>{TrueMarker(Boolean(hh.ppMealKit_flag))}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.childrenSnacks_flag))}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.foodBox_flag))}</TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.rteMeal_flag))}</TableCell>

            <TableCell align='left'><AllergiesList allergies={hh.hh_allergies} isEditable={false}/></TableCell>
            <TableCell align='left'>{TrueMarker(Boolean(hh.paused_flag))}</TableCell>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <TableCell align='left'>
                <Box sx={{ display: "flex",
                justifyContent: "flex-end"}}>
                    {/* When edit is clicked, handleEditClick is called with this row's key */}
                    <IconButton size="large"
                        onClick={()=> handleEditClick(key)}>
                        <EditIcon />
                    </IconButton>
                    {/* When delete is clicked, deleteUser is called with this row's key */}
                    <IconButton size="large"
                        onClick={() => deleteHousehold(key)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    )
}

export default HouseholdRow;