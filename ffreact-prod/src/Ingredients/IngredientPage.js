import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@mui/system';
import IngredientForm from './IngredientForm.js'
import IngUsageTable from './IngUsageTable.js'
import EditableIngUsageTable from './EditableIngUsageTable.js';
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import ModularSelect from '../components/ModularSelect.js'
import './IngredientList.css'
import CellDialog from '../components/CellDialog.js'
import { Typography } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import moment from 'moment';

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
    
    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 140, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'ingredient_name'} value={params.value} required/> },
        { field: 'storage_type', headerName: 'Category', width: 100, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'storage_type'} value={params.value}/> },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'pkg_type'} value={params.value}/> },
        { field: 'unit', headerName: 'Measure', width: 100, editable: true, renderEditCell: (params) => <ModularSelect options={ingredients} searchField={'unit'} value={params.value}/> },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier_id', headerName: 'Supplier', type: 'singleSelect', valueOptions: supplierOptions, width: 170, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true, valueFormatter: params => moment(params.value).format('MM/DD/YYYY'), valueParser: value => moment(value).format("YYYY-MM-DD") },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'exp_date', headerName: 'Expiration Date', width: 140, type: 'date', editable: true, valueFormatter: params => moment(params.value).format('MM/DD/YYYY'), valueParser: value => moment(value).format("YYYY-MM-DD")},
        { field: 'ingredient_usage', headerName: 'Usages', width: 150, editable: true,
            renderCell: (params) => {
                if (params.value && params.value.length > 0)
                    return <CellDialog buttonText={'View Usages'} dialogTitle={'Usages'} component={<IngUsageTable ingredient_usages={params.value}/>}/>
                else 
                    return <Typography variant='p'>No Usages</Typography>
            },
            renderEditCell: (params) => {
                const api = useGridApiContext();
                const updateCellValue = (fieldName, newValue) => {
                    const {id, field} = params;
                    api.current.setEditCellValue({id, field, value: newValue, debounceMs: 200})
                }
                return <CellDialog buttonText={'Edit Usages'} dialogTitle={'Edit Usages'} component={<EditableIngUsageTable ingredient_usage={params.value} updateEditForm={updateCellValue}/>}/>
            },
        },
        { field: 'qty_on_hand', headerName: 'Amt On Hand', width: 100, type: 'number', editable: false}
    ]

    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Ingredients</Typography>
            <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
            rows={ingredients}
            columns={columns}
            apiEndpoint='ingredient-inventory'
            keyFieldName='i_id'
            entryName='Ingredient'
            searchField='ingredient_name'
            searchLabel='Ingredient Names'
            AddFormComponent={IngredientForm}
            >
            </NewModularDatagrid>
        </Box>
        {/* Add entry notice */}
        </div>
    )
}
