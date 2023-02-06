import React, { useEffect, useState } from 'react'
import {Formik} from "formik";
import { TableCell, TextField, Typography, Paper, Button, Box, IconButton } from "@mui/material";
import * as yup from "yup";
import { Link, useNavigate }from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

// User Row component
// Takes: key of current row, the state of the User Page's u list, deleteUser callback, handleEditClick callback
// Returns a User table row component 
const UserRow = (props) => {
    const { thisKey, user, deleteUser, handleEditClick} = props;
    const key = thisKey;
    const u = user;

    // HTML structure of this component
    return (
        <tr key={key}>
            <TableCell align="left">
                {u.u_id}
            </TableCell>
            <TableCell align="left">
                {u.username}
            </TableCell>
            <TableCell align="left">
                <text>*****</text>
            </TableCell>
            <TableCell align="left">
                {u.admin_flag}  
            </TableCell>
            <TableCell align="left">
                {u.email}
            </TableCell>
            <TableCell align="right">
                <Box sx={{ display: "flex",
                justifyContent: "flex-end"}}>
                    {/* When edit is clicked, handleEditClick is called with this row's key */}
                    <IconButton size="large"
                        onClick={()=> handleEditClick(key)}>
                        <EditIcon />
                    </IconButton>
                    {/* When delete is clicked, deleteUser is called with this row's key */}
                    <IconButton size="large"
                        onClick={() => deleteUser(key)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </TableCell>
        </tr>
    )
}

export default UserRow;