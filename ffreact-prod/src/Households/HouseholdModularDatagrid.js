import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { wait } from '@testing-library/user-event/dist/utils';
import './HouseholdList.css'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import HouseholdList from './HouseholdList.js'
// import Dropdown from './components/Dropdown'
import ModularDatagrid from '../components/ModularDatagrid';

// Packaging List Component
export default function HouseholdModularDatagrid() {
    
    const [households, setHousehold] = useState([]);
    const columns = [
        { field: 'hh_name', headerName: 'Name', width: 150 },
        { field: 'num_adult', headerName: 'Adults', width: 90 },
        { field: 'num_child_lt_6', headerName: 'Children 0-6', width: 50 },
        { field: 'num_child_gt_6', headerName: 'Children 7-17', width: 90, type: 'number' },
        { field: 'phone', headerName: 'Phone Number', width: 90, /*valueFormatter: ({ value }) => currencyFormatter.format(value)*/ },
        { field: 'street', headerName: 'Street', width: 180 },
        { field: 'city', headerName: 'City', width: 120 },
        { field: 'state', headerName: 'State', width: 140 },
        { field: 'pcode', headerName: 'Postal Code', width: 100, type: 'date', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 100, type: 'date', type: 'boolean' },
        { field: 'veg_flag', headerName: 'Veg', width: 100, type: 'date', type: 'boolean' },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 100, type: 'date', type: 'boolean'},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'date', valueFormatter: ({ value }) => value.a_type },
        { field: 'paused_flag', headerName: 'Paused', width: 100, type: 'date', editable: true },
        { field: 'delete', headerName: 'Action', width: 100, type: 'date', editable: true },
    ]
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80vh'}}>
            <ModularDatagrid columns={columns} keyFieldName={'hh_name'} apiEndpoint={'households'}></ModularDatagrid>
        </Box>
        </div>
    )
}
