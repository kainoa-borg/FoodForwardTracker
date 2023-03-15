import React, { useState, useEffect} from 'react'
import axios from 'axios'
// import IngredientForm from './IngredientForm.js'
// import IngredientRow from './IngredientRow.js'
// import EditableIngredientRow from './EditableIngredientRow'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { FitScreen, Toolbar } from '@mui/icons-material';
import ReusableTable from '../ReusableTable.js'
// import Error from '../Error.js'
// import DisplayMessage from '../DisplayMessage.js'
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Ingredient List Component
export default function IngredientReport() {
    const [ingredients, setIngredients] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    

    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    const getDBIngredients = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ingredients-report"
          }).then((response)=>{
            const ingData = response.data
            setIngredients(ingData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Get suppliers from database
    // Set supplier variable with supplier data
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


    const columns = [
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
        { field: 'storage_type', headerName: 'Category', width: 150, editable: true },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'exp_date', headerName: 'Expiration Date', width: 140, editable: true},
        { field: 'ingredient_usage', headerName: 'Date Used', width: 100, type: 'date', editable: true, valueFormatter: (params) => {if (params.value) {
            if (params.value.length > 0) return params.value[params.value.length - 1].used_date}}},
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
        { field: 'ingredient_usage2', headerName: 'Units Used', width: 100, type: 'number', editable: true, valueFormatter: (params) => {if (params.value) {
            if (params.value.length > 0) return params.value[params.value.length - 1].used_qty}}},
        
    ]

    if (ingredients === undefined || suppliers === undefined) {
        return (<>loading</>);
    }

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport
            csvOptions={{
                fileName: 'Ingredients Report',
                delimeter: ';'
            }} />
          </GridToolbarContainer>
        );
    }

    // The HTML structure of this component
    return (
        <Box sx={{height: '80%'}}>
            {/* Show a row for each ingredient in ingredientts.*/}
            <DataGrid
                columns={columns}
                rows={ingredients}
                components = {{Toolbar:CustomToolbar}}
                getRowId={(row) => row.i_id}
                autoHeight = {5}
            >
            </DataGrid>
        </Box>
    )
}