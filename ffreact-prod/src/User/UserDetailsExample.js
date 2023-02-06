import React, { useEffect, useState } from 'react'
import {Formik} from "formik";
import { Grid, TextField, Typography, Paper, Button, Box, IconButton } from "@mui/material";
import * as yup from "yup";
import { Link, useNavigate }from "react-router-dom";

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

        <Paper sx={{
            borderRadius: "2px",
            boxShadow: (theme) => theme.shadows[5],
            padding: (theme) => theme.spacing(2, 4, 3)
        }}>
            <Typography variants="h3" mb={4}>
                Admin Title
            </Typography>
            <Formik>
                {(formik) => {
                    return (
                        <form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="u.u_id"
                                    label="ID"
                                    {...formik.getFieldProps
                                    ("u_id")}
                                    error={formik.errors.u_id 
                                        && Boolean(formik.errors.u_id)}
                                    helperText={formik.touched.u_id 
                                        && formik.errors.u_id}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="username"
                                    label="User Name"
                                    {...formik.getFieldProps
                                    ("username")}
                                    error={formik.errors.username 
                                        && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username 
                                        && formik.errors.username}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="password"
                                    label="Password"
                                    {...formik.getFieldProps
                                    ("password")}
                                    error={formik.errors.password 
                                        && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password 
                                        && formik.errors.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="admin_flag"
                                    label="User Level"
                                    {...formik.getFieldProps
                                    ("admin_flag")}
                                    error={formik.errors.admin_flag 
                                        && Boolean(formik.errors.admin_flag)}
                                    helperText={formik.touched.admin_flag 
                                        && formik.errors.admin_flag}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="email"
                                    label="Email"
                                    {...formik.getFieldProps
                                    ("email")}
                                    error={formik.errors.email 
                                        && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email 
                                        && formik.errors.email}
                                    />
                                </Grid>
                                <Grid item>
                                    <Box sx={{ display: "flex",
                                    margin: (theme) => theme.spacing(1),
                                    marginTop: (theme) => theme.spacing(3)}}>
                                        {/* When edit is clicked, handleEditClick is called with this row's key */}
                                        <IconButton size="large"
                                            onClick={()=> handleEditClick(key)}>Edit
                                        </IconButton>
                                        {/* When delete is clicked, deleteUser is called with this row's key */}
                                        <IconButton size="large"
                                            onClick={() => deleteUser(key)}>delete
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>  
                    )
                }}  
            </Formik>
        </Paper>
        </tr>
    )
}

export default UserRow;