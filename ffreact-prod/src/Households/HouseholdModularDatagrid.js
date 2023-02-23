import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, useGridApiContext, gridClasses} from '@mui/x-data-grid'
import { wait } from '@testing-library/user-event/dist/utils';
import './HouseholdList.css'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import HouseholdList from './HouseholdList.js'
import AllergiesList from './AllergiesList';
// import Dropdown from './components/Dropdown'
import ModularDatagrid from '../components/ModularDatagrid';

// Packaging List Component
export default function HouseholdModularDatagrid() {
    
    const [households, setHousehold] = useState([]);

    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false}/>
    }
    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (a, b) => {
            const newAllergies = b[0];
            const {id, value, field} = params;
            api.current.setEditCellValue({id, field, value: newAllergies, debounceMs: 200})
        }
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue}/>
    }

    const columns = [
        { field: 'hh_name', headerName: 'Name', type: 'text', width: 150 },
        { field: 'num_adult', headerName: 'Adults', type: 'number', width: 90 },
        { field: 'num_child_lt_6', headerName: 'Children 0-6', type: 'number', width: 50 },
        { field: 'num_child_gt_6', headerName: 'Children 7-17', type: 'number', width: 90, type: 'number' },
        { field: 'phone', headerName: 'Phone Number', width: 90, type: 'phoneNumber' },
        { field: 'street', headerName: 'Street', width: 180, type: 'text' },
        { field: 'city', headerName: 'City', width: 120, type: 'text' },
        { field: 'state', headerName: 'State', width: 140, type: 'state' },
        { field: 'pcode', headerName: 'Postal Code', width: 100, type: 'date', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'hh_allergies', headerName: 'Allergies', width: 200, type: 'string', editable: true, 
            renderCell: AllergyListCell,
            renderEditCell: (params) => <AllergyListEditCell {...params}/>
        },
        { field: 'paused_flag', headerName: 'Paused', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
    ]
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80vh'}}>
            <ModularDatagrid columns={columns} getRowHeight={() => 'auto'} sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }} getEstimatedRowHeight={() => 300} keyFieldName={'hh_name'} apiEndpoint={'households'}></ModularDatagrid>
        </Box>
        </div>
    )
}
