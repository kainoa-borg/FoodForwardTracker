import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { Snackbar } from '@mui/material';
import { wait } from '@testing-library/user-event/dist/utils';
import IngredientForm from './IngredientForm.js'
import EditableIngredientRow from './EditableIngredientRow.js'
import IngredientRow from './IngredientRow.js'
import './IngredientList.css'
import IngredientForm from './IngredientForm';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Ingredients List Component
export default function IngredientPage() {
    
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState(undefined);
    const [rowModesModel, setRowModesModel] = useState({});
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);
    const [supplierOptions, setSupplierOptions] = useState();

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

    const postDBIngredients = () => {
        axios({
            method: "POST",
            url:"/ingredients/",
            data: ingredients
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
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
            setUpdateDoneSBOpen(true);
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
        setUpdateSBOpen(true);
    }
    const handleCancelClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View, ignoreModifications: true}});
    }

    const supplierNameFormatter = (value) => {
        console.log('FORMATTING: ' + value);
        if (value) {
            let idx = suppliers.findIndex((suppliers.s_id === value));
            console.log(idx);
            if (idx) return suppliers[idx].s_name;
        }
    }

    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
        { field: 'storage_type', headerName: 'Category', width: 150, editable: true },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true },
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier_id', headerName: 'Supplier', type: 'singleSelect', valueOptions: supplierOptions, width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'exp_date', headerName: 'Expiration Date', width: 140, editable: true},
        { field: 'ingredient_usage', headerName: 'Date Used', width: 100, type: 'date', editable: true, valueFormatter: (params) => {if (params.value) {
            if (params.value.length > 0) return params.value[params.value.length - 1].used_date}}},
        { field: 'ingredient_usage2', headerName: 'Units Used', width: 100, type: 'number', editable: true, valueFormatter: (params) => {if (params.value) {
            if (params.value.length > 0) return params.value[params.value.length - 1].used_qty}}},
        { field: 'actions', type: 'actions', width: 100,
            getActions: (params) => {
                let isInEditMode = false;
                if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<Save/>} onClick={() => {handleSaveClick(params)}} color="darkBlue"/>,
                        <GridActionsCellItem icon={<Cancel/>} onClick={() => {handleCancelClick(params)}} color="darkBlue"/>
                    ];
                }
                else {
                    return [
                        <GridActionsCellItem icon={<Edit/>} onClick={() => handleEditClick(params)} color="darkBlue"/>,
                        <GridActionsCellItem icon={<Delete/>} onClick={() => deleteIngredient(params)} color="darkBlue"/>
                    ]
                }
            }
        }
    ]

    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/suppliers"
          }).then((response)=>{
            setSuppliers(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

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

    // On page load
    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    // On suppliers set
    useEffect(() => {
        setSupplierOptions(suppliers.map((supplier) => {return {value: supplier.s_id, label: supplier.s_name}}))
    }, [suppliers])

    useEffect(() => {
        // console.log('SUPPLIER OPTIONS ===> ' + supplierOptions);
    }, [supplierOptions])

    if (ingredients === undefined || suppliers === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component

    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }
    
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
        <IngredientForm addIngredient={addIngredient} suppliers={suppliers}></IngredientForm>
        {/* Save Click Notice */}
        <Snackbar
            open={updateSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateSBOpen)}
            message="Saving..."
        />
        {/* Save Complete Notice */}
        <Snackbar
            open={updateDoneSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateDoneSBOpen)}
            message="Changes saved!"
        />
        </div>
    )
}
