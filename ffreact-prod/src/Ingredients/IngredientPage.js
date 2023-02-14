import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './IngredientList.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  
  const usdPrice = {
    type: 'number',
    width: 80,
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: 'font-tabular-nums',
};

// Ingredients List Component
export default function IngredientPage() {
    
    const [ingredients, setIngredients] = useState([]);
    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120 },
        { field: 'storage_type', headerName: 'Category', width: 150 },
        { field: 'pkg_type', headerName: 'Package Type', width: 120 },
        { field: 'unit', headerName: 'Measure', width: 90 },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier', headerName: 'Supplier', width: 180, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date' },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140 },
        { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
        { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true }
    ]
    const [suppliers, setSuppliers] = useState();
    const [editIngredientID, setEditIngredientID] = useState(null);

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
            onRowClick={handleRowClick} 
            rows={ingredients} 
            columns={columns} 
            getRowId={(row) => row.i_id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        </div>
    )
}
