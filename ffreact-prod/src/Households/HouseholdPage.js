import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './HouseholdList.css'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import HouseholdList from './HouseholdList.js'
import Dropdown from './components/Dropdown'

// Packaging List Component
export default function HouseholdPage() {
    
    const [households, setHousehold] = useState([]);
    const columns = [
        { field: 'hh_name', headerName: 'Name', width: 150, type: 'string', editable: true },
        { field: 'num_adult', headerName: 'Adults', width: 90, type: 'string', editable: true },
        { field: 'num_child_lt_6', headerName: 'Children 0-6', width: 50, type: 'number', editable: true },
        { field: 'num_child_gt_6', headerName: 'Children 7-17', width: 90, type: 'number', editable: true },
        { field: 'phone', headerName: 'Phone Number', width: 90, type: 'number', editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'street', headerName: 'Street', width: 180, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 120, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 140, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Postal Code', width: 100, type: 'date', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, type: 'string', editable: true },
        { field: 'veg_flag', headerName: 'Veg', width: 100, type: 'boolean', editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 100, type: 'boolean', editable: true },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 100, type: 'boolean', editable: true},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'date', editable: true, valueFormatter: ({ value }) => value.s_name }
        { field: 'paused_flag', headerName: 'Paused', width: 100, type: 'boolean', editable: true },
    ]

    useEffect(() => {
        getDBHousehold();
    }, []);

    const getDBHousehold = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households"
        }).then((response)=>{
        setHousehold(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleRowClick = (params) => {
        getDBHousehold(params.row.p_id);
        wait(300);
        console.log(households);
    }

    if (households === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick} 
            rows={households} 
            columns={columns} 
            getRowId={(row) => row.p_id}
            pageSize={10}
            //rowsPerPageOptions={[7]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        </div>
    )
}
