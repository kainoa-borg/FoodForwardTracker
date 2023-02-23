import React, { useState } from 'react'
import { useGridApiContext, gridClasses} from '@mui/x-data-grid'
import './HouseholdList.css'
import { Box } from '@mui/material'
import AllergiesList from './AllergiesList';
import ModularDatagrid from '../components/ModularDatagrid';

// Packaging List Component
export default function HouseholdModularDatagrid() {

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
        { field: 'hh_name', headerName: 'Name', type: 'string', width: 120, editable: true },
        { field: 'num_adult', headerName: 'Adults', type: 'number', width: 50, editable: true },
        { field: 'num_child_lt_6', headerName: '# Child 0-6', type: 'number', width: 50, editable: true },
        { field: 'num_child_gt_6', headerName: '# Child 7-17', type: 'number', width: 50, editable: true },
        { field: 'phone', headerName: 'Phone Number', width: 110, type: 'number', editable: true, valueFormatter: (value) => {return value} },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 70, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Postal Code', width: 80, type: 'number', editable: true, valueFormatter: (value) => {return value} },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'string', editable: true, 
            renderCell: AllergyListCell,
            renderEditCell: (params) => <AllergyListEditCell {...params} sx={{height: 'auto', minHeight: 200, maxHeight: 1000}}/>
        },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
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
