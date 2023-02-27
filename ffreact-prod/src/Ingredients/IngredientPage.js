import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { Button, Popover, Snackbar, Typography } from '@mui/material';
import { wait } from '@testing-library/user-event/dist/utils';
import IngredientForm from './IngredientForm.js'
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import './IngredientList.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Ingredients List Component
export default function IngredientPage() {
    
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState(undefined);
    // Struct of option definitions for Supplier dropdown
    const [supplierOptions, setSupplierOptions] = useState();


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

    // Get ingredients from database
    // Set ingredients variable with ingredient data
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

    // On page load
    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    // On suppliers set
    useEffect(() => {
        if (suppliers)
            setSupplierOptions(suppliers.map((supplier) => {return {value: supplier.s_id, label: supplier.s_name}}));
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

    const supplierNameFormatter = (value) => {
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
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false}
    ]

    return(
        <div class='table-div'>
        <h3>Ingredients</h3>
        <Box sx={{display: 'flex', height: '60%', width: '100%'}}>
            <div style={{flexGrow: 1}}>
                <NewModularDatagrid 
                rows={ingredients}
                columns={columns}
                apiEndpoint='ingredient-inventory'
                keyFieldName='i_id'
                AddFormComponent={IngredientForm}
                >
                </NewModularDatagrid>
            </div>
        </Box>
        {/* Add entry notice */}
        </div>
    )
}
