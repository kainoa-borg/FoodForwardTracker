import AllergiesList from './AllergiesList.js'
import React, { useEffect, useState } from 'react'

//import Button from 'react-bootstrap/Button'
import { Formik } from "formik"
import { Grid, TextField, Typography, Paper, Button, TableRow, TableCell } from "@mui/material"
import * as yup from "yup"
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
    // HTML structure of this component
    return (
        <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align='right'>{hh.hh_name}</TableCell>
            <TableCell align='right'>{hh.num_adult}</TableCell>
            <TableCell align='right'>{hh.num_child_lt_6}</TableCell>
            <TableCell align='right'>{hh.num_child_gt_6}</TableCell>
            <TableCell align='right'>{String(Boolean(hh.veg_flag))}</TableCell>
            <TableCell align='right'>{String(Boolean(hh.gf_flag))}</TableCell>
            
            <TableCell align='right'>{String(Boolean(hh.sms_flag))}</TableCell>
            <TableCell align='right'>{String(Boolean(hh.paused_flag))}</TableCell>
            <TableCell align='right'>{hh.phone}</TableCell>
            <TableCell align='right'>{hh.street}</TableCell>
            <TableCell align='right'>{hh.city}</TableCell>
            <TableCell align='right'>{hh.pcode}</TableCell>
            <TableCell align='right'>{hh.state}</TableCell>
            <TableCell align='right'>{hh.delivery_notes}</TableCell>
            <TableCell align='right'><AllergiesList allergies={hh.hh_allergies} isEditable={false}/></TableCell>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <TableCell align='right'><button onClick={()=> handleEditClick(key)}>Edit</button></TableCell>
            {/* When delete is clicked, deleteHousehold is called with this row's key */}
            <TableCell align='right'><button onClick={() => deleteHousehold(key)}>X</button></TableCell>
        </TableRow>
    )
}

export default HouseholdRow;