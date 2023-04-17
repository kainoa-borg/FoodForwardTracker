import React from 'react'
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid'
import './HouseholdList.css'
import { Box, Typography } from '@mui/material'
import AllergiesList from './AllergiesList';
import NewModularDatagrid from '../components/NewModularDatagrid';
import CellDialog from '../components/CellDialog.js';
import HouseholdForm from './HouseholdForm.js';
// import ModularSelect from '../components/ModularSelect';
// import axios from 'axios';

// Households/Clients List Component
export default function HouseholdPage() {
    
    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false}/>
    }
    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (a, b) => {
            const newAllergies = b[0];
            const {id, field} = params;
            api.current.setEditCellValue({id, field, value: newAllergies, debounceMs: 200})
        }
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue}/>
    }

    const columns = [
        { field: 'hh_last_name', headerName: 'Last Name', defaultValue:"Last Name", type: 'string', width: 120, editable: true},
        { field: 'hh_first_name', headerName: 'First Name', defaultValue: 'First Name', type: 'string', width: 120, editable: true},
        { field: 'num_adult', headerName: 'Adults', type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            width: 70, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17',  type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            description: 'Number of children from age 7 to 17', width: 70, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            description: 'Number of children from age 0 to 6', width: 70, editable: true },
        { field: 'phone', headerName: 'Phone', defaultValue:'xxx-xxx-xxxx', width: 130, type: 'phone', editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 50, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 50, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 150, editable: true },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', description: 'Vegetarian', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', description: 'Gluten Free', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'hh_allergies', headerName: 'Allergies', width: 130, type: 'string', editable: true, 
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    return <CellDialog buttonText={'View Allergies'} dialogTitle={'Allergies'} component={<AllergyListCell {...params}/>}/>
                }
                else {
                    return <Typography variant='p'>No Allergies</Typography>
                }
            },
            renderEditCell: (params) => <CellDialog buttonText={'Edit Allergies'} dialogTitle={'Edit Allergies'} component={<AllergyListEditCell {...params} sx={{height: 'auto', minHeight: 200, maxHeight: 1000}}/>}/>
        },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => {return value ? 1 : 0} },
        { field: 'paying', headerName: 'Paying', width: 70, type: 'boolean', editable: true, valueParser: (value) => {return value ? 1 : 0} },
    ]
    
    const columnGroupingModel = [
        { field: 'hh_first_name' }, { field: 'hh_last_name'},
        {
            groupId: 'ages',
            headerName: 'Member Ages',
            description: 'Number of members per household in each age range',
            children: [{ field: 'num_adult' }, { field: 'num_child_gt_6' }, { field: 'num_child_lt_6' }],
        },
        {
            groupId: 'contact_details',
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
            groupId: 'diet',
            headerName: 'Dietary Requirements',
            children:[{ field: 'veg_flag' }, { field: 'gf_flag'}, { field: 'hh_allergies'}]
        },
        { field: 'paused_flag' }, { field: 'paying'}
    ];

    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Clients</Typography>
        <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 300} 
                keyFieldName={'hh_id'}
                apiEndpoint={'households'}
                entryName={'Client'}
                searchField={'hh_last_name'}
                searchLabel={'Client Names'}
                AddFormComponent={HouseholdForm}
                experimentalFeatures={{ columnGrouping: true }}>
            </NewModularDatagrid>
        </Box>
        </div>
    )
}
