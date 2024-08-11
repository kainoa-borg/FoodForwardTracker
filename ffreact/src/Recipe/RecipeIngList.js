import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {DataGrid} from '@mui/x-data-grid'
import { Box } from '@mui/system';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function RecipeIngList(props) {

    const [ingredients, setIngredients] = useState();
    const [suppliers, setSuppliers] = useState();
    const setIngID = props.setID;
    const handleClose = props.handleClose;

    const getDBIngredients = () => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "ingredient-inventory"
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

    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "suppliers"
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

/*    const supplierNameFormatter = (value) => {
        if (value) {
            let idx = suppliers.findIndex((suppliers.s_id === value));
            console.log(idx);
            if (idx) return suppliers[idx].s_name;
        }
    } */

    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, [])

    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
        { field: 'storage_type', headerName: 'Category', width: 150, editable: true },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true },
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'exp_date', headerName: 'Expiration Date', width: 140, editable: true},
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, editable: true},
    ]

    if (ingredients === undefined) {
        return (
            <>loading...</>
        )
    }

    const handleRowClick = (params) => {
        setIngID(params.row.ingredient_name, params.row.i_id, params.row.unit)
        handleClose();
        // setCurrPage(<Recipe recipeData={recipeData}></Recipe>)
    }

    return(
        <Box sx={{height: '80vh'}}>
            <DataGrid
            onRowClick={handleRowClick} 
            rows={ingredients} 
            columns={columns} 
            getRowId={(row) => row.i_id}>
            </DataGrid>
        </Box>
    )
}