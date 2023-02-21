import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './IngredientList.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Ingredients List Component
export default function IngredientPage() {
    
    const [ingredients, setIngredients] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    // Add ingredient from form
    const addIngredient = (ingredient) => {
        const lastID = ingredients[ingredients.length - 1]['i_id'];
        ingredient['i_id'] = lastID + 1;
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/ingredient-inventory/",
            data: ingredient
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Delete Ingredient Row
    const deleteIngredient = (params) => {
        console.log(params.id);
        axios({
            method: "DELETE",
            url:"http://4.236.185.213:8000/api/ingredient-inventory/"+params.id+'/',
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Update Ingredient Row
    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};

        console.log(updatedRow);
        
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/ingredient-inventory/"+ newRow.i_id +'/',
            data: newRow
            }).then((response)=>{
            getDBIngredients();
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
        });

        return updatedRow;
    }

    const handleEditClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.Edit}});
    }
    const handleSaveClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View}})
    }
    const handleCancelClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View, ignoreModifications: true}});
    }

    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
        { field: 'storage_type', headerName: 'Category', width: 150, editable: true },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true },
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier', headerName: 'Supplier', width: 180, editable: true, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
        { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true},
        { field: 'actions', type: 'actions', width: 100,
            getActions: (params) => {
                let isInEditMode = false;
                if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<Save/>} onClick={() => {handleSaveClick(params)}}/>,
                        <GridActionsCellItem icon={<Cancel/>} onClick={() => {handleCancelClick(params)}}/>
                    ];
                }
                else {
                    return [
                        <GridActionsCellItem icon={<Edit/>} onClick={() => handleEditClick(params)} color="inherit"/>,
                        <GridActionsCellItem icon={<Delete/>} onClick={() => deleteIngredient(params)}/>
                    ]
                }
            }
        }
    ]

    useEffect(() => {
        getDBIngredients();
    }, []);

    const getDBIngredients = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ingredient-inventory"
        }).then((response)=>{
        setIngredients(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleRowClick = (params) => {
        getDBIngredients(params.row.i_id);
        wait(300);
        console.log(ingredients);
    }

    if (ingredients === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component


    
    return(
        <div class='table-div'>
        <h3>Ingredients</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick}
            rows={ingredients}
            columns={columns}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => {setRowModesModel(newModel)}}
            getRowId={(row) => row.i_id}
            pageSize={10}
            processRowUpdate={processRowUpdate}
            //rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        </div>
    )
}
