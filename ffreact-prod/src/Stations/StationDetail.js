import React, { useEffect, useState } from 'react'
import {Formik} from "formik";
import { Grid, TextField, Typography, Paper, Button, Box } from "@mui/material";
import * as yup from "yup";
import { Link, useNavigate }from "react-router-dom";

export default function StationDetails () {
    const [initialValuse, setInitialValues] = useState({
        name: "",
        item: ""
    });

    return (
        <Paper sx={{
            borderRadius: "2px",
            boxShadow: (theme) => theme.
            shadow[5],
            padding: (theme) => theme.
            spacing(2, 4, 3)
        }}>
                <Formik>
                    return (
                        <form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                    fullWidthid="name"
                                    label="Name"
                                    {...formik.getFieldProps
                                    ("name")}
                                    error={formik.errors.name 
                                        && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name 
                                        && formik.errors.name}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    )
                </Formik>
            </Paper>
    )
}