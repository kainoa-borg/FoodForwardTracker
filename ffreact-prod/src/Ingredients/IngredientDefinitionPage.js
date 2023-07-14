import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@mui/system';
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import IngUnitTable from './IngUnitTable.js';
import CellDialog from '../components/CellDialog.js'
import { Typography } from '@mui/material';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';
import IngredientDefForm from './IngredientDefForm.js';
import EditableIngUnitTable from './EditableIngUnitTable.js';

// Ingredients List Component
export default function IngredientDefinitionPage(props) {
    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};

    // Structs
    const [ingredientDefs, setIngredientDefs] = useState([]);

    if (ingredientDefs === undefined) {
        return (
            <>loading...</>
        )
    }
    
    // Columns and formatting to be sent to DataGrid 
    const columns = [
        { field: 'ing_name', headerName: 'Ingredient', width: 140, type: 'text', editable: true},
        { field: 'ing_units', headerName: 'Units', width: 150, editable: true,
            renderCell: (params) => {
                if (params.value && params.value.length > 0)
                    return <div style={{margin: 'auto'}}><CellDialog buttonText={'View Units'} dialogTitle={'Units'} component={<IngUnitTable ing_units={params.value}/>}/></div>
                else 
                    return <div style={{margin: 'auto'}}><Typography variant='p'>No Units</Typography></div>
            },
            renderEditCell: (params) => {
                const api = useGridApiContext();
                const updateCellValue = (fieldName, newValue) => {
                    const {id, field} = params;
                    api.current.setEditCellValue({id, field, value: newValue, debounceMs: 200})
                }
                return <div style={{margin: 'auto'}}><CellDialog buttonText={'Edit Units'} dialogTitle={'Edit Units'} component={<EditableIngUnitTable ing_units={params.value} updateEditForm={updateCellValue}/>}/></div>
            },
        },
    ]

    // Page view; calls NewModularDataGrid
    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Ingredients</Typography>
            <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
            loginState={loginState}
            rows={ingredientDefs}
            columns={columns}
            apiEndpoint='ing-name-definitions'
            apiIP='localhost'
            keyFieldName='ing_name_id'
            entryName='Ingredient Definition'
            searchField='ing_name'
            searchLabel='Ingredient Names'
            AddFormComponent={IngredientDefForm}
            >
            </NewModularDatagrid>
        </Box>
        {/* Add entry notice */}
        </div>
    )
}
