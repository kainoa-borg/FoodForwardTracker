import React, { useEffect, useState } from 'react'
import { useGridApiContext } from '@mui/x-data-grid'
import './HouseholdList.css'
import { Box } from '@mui/material'
import AllergiesList from './AllergiesList';
import NewModularDatagrid from '../components/NewModularDatagrid';
import HouseholdForm from './HouseholdForm.js'
import ModularSelect from '../components/ModularSelect';
import axios from 'axios';

// Households/Clients List Component
export default function HouseholdPage() {
    
    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false}/>

    }
    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (a, b) => {
            const newAllergies = b[0];
            // const {id, value, field} = params;
            const {id, field} = params;
            api.current.setEditCellValue({id, field, value: newAllergies, debounceMs: 200})
        }
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue}/>
    }

    const columns = [
        { field: 'hh_name', headerName: 'Name', type: 'string', width: 120, editable: false},
        { field: 'num_adult', headerName: 'Adults', type: 'number', width: 70, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17',  type: 'number', width: 70, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', width: 70, editable: true },
        { field: 'phone', headerName: 'Phone', width: 110, type: 'phone', editable: true },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 70, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'string', editable: true, 
            renderCell: AllergyListCell,
            renderEditCell: (params) => <AllergyListEditCell {...params} sx={{height: 'auto', minHeight: 200, maxHeight: 1000}}/>
        },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'paying', headerName: 'Paying', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
    ]
    
    const columnGroupingModel = [
        { field: 'hh_name' },
        {
            groupId: 'ages',
            headerName: 'Member Ages',
            description: 'Number of members per household in each age range',
            children: [{ field: 'num_adult' }, { field: 'num_child_gt_6' }, { field: 'num_child_lt_6' }],
        },
        {
            headerName: 'Contact Details',
            children: [{field: 'phone' }, { field: 'sms_flag'}]
        },
        {
            groupId: 'contact',
            headerName: 'Address',
            children: [{ field: 'street' }, { field: 'city' }, { field: 'state' }, { field: 'pcode' }],
        },
        { field: 'delivery_notes'},
        {
            headerName: 'Dietary Requirements',
            children:[{ field: 'veg_flag' }, { field: 'gf_flag'}, { field: 'hh_allergies'}]
        },
        { field: 'paused_flag' }, { field: 'paying'}
    ];

    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 300} 
                keyFieldName={'hh_name'}
                apiEndpoint={'households'}
                entryName={'Client'}
                searchField={'hh_name'}
                searchLabel={'Client Names'}
                AddFormComponent={HouseholdForm}
                experimentalFeatures={{ columnGrouping: true }}>
            </NewModularDatagrid>
        </Box>
        </div>
    )
}
