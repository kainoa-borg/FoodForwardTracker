import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@mui/system';
import IngredientForm from './IngredientForm.js'
import IngUsageTable from './IngUsageTable.js'
import EditableIngUsageTable from './EditableIngUsageTable.js';
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import ModularSelect from '../components/ModularSelect.js'
import CellDialog from '../components/CellDialog.js'
import { Typography } from '@mui/material';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';
import moment from 'moment';
import { PropaneSharp } from '@mui/icons-material';

// Formats data into $0.00 format
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Ingredients List Component
export default function IngredientPage(props) {
    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};

    // Structs
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState(undefined);
    // Struct of option definitions for Supplier dropdown
    const [supplierOptions, setSupplierOptions] = useState();

    const parentCategories = [
        { value: 0, label: 'No Category' },
        { value: 1, label: 'Fruits' },
        { value: 2, label: 'Vegetables' },
        { value: 3, label: 'Dairy' },
        { value: 4, label: 'Protein' },
        { value: 5, label: 'Grains' },
        { value: 6, label: 'Specialty' },
        { value: 7, label: 'Condiments' }
    ];

    const specificCategoriesMap = {
        0: [{ value: 0, label: 'No Category' }],
        1: [ // Fruits
            { value: 1, label: 'Melons' },
            { value: 2, label: 'Berries' },
            { value: 3, label: 'Other Fruits' }
        ],
        2: [ // Vegetables
            { value: 4, label: 'Darkgreen Vegetables' },
            { value: 5, label: 'Red Orange Vegetables' },
            { value: 6, label: 'Starchy Vegetables' },
            { value: 7, label: 'Beans Peas Lentils' },
            { value: 8, label: 'Other Vegetables' }
        ],
        3: [ // Dairy
            { value: 9, label: 'Milk' },
            { value: 10, label: 'Cheese' },
            { value: 11, label: 'Yogurt' },
            { value: 12, label: 'Non-Dairy Calcium Alternatives' }
        ],
        4: [ // Protein
            { value: 13, label: 'Meats' },
            { value: 14, label: 'Poultry' },
            { value: 15, label: 'Seafood' },
            { value: 16, label: 'Eggs' },
            { value: 17, label: 'Nuts Seeds' },
            { value: 18, label: 'Beans Peas Lentils (Protein)' }
        ],
        5: [ // Grains
            { value: 19, label: 'Whole Grains' },
            { value: 20, label: 'Refined Grains' },
            { value: 21, label: 'Gluten Free' }
        ],
        6: [ // Specialty
            { value: 22, label: 'Vegan' },
            { value: 23, label: 'Allergies' }
        ],
        7: [ // Condiments
            { value: 24, label: 'Sauces' },
            { value: 25, label: 'Seasonings' },
            { value: 26, label: 'Broths' }
        ]
    };

    // Get suppliers from database
    // Set supplier variable with supplier data
    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url: process.env.REACT_APP_API_URL + "suppliers"
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
    // Set dropdown effect
    useEffect(() => {
        // console.log('SUPPLIER OPTIONS ===> ' + supplierOptions);
    }, [supplierOptions])

    if (ingredients === undefined || suppliers === undefined) {
        return (
            <>loading...</>
        )
    }
    
    // Columns and formatting to be sent to DataGrid 
    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 140, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'ingredient_name'} value={params.value} required/> },
        { field: 'storage_type', headerName: 'Category', width: 100, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'storage_type'} value={params.value}/> },
        { field: 'pkg_type', headerName: 'Package Type', width: 120, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={ingredients} searchField={'pkg_type'} value={params.value}/> },
        { field: 'unit', headerName: 'Measure', width: 100, editable: true, renderEditCell: (params) => <ModularSelect options={ingredients} searchField={'unit'} value={params.value}/>,
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ min: 0,}}/>) },
        { field: 'unit_cost', headerName: 'Unit Cost', align: 'right', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value),
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ min: 0,}}/>)},
        { field: 'pref_isupplier_id', headerName: 'Supplier', type: 'singleSelect', valueOptions: supplierOptions, width: 170, editable: true, valueFormatter: (params) => { if (params.value != undefined) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true, valueFormatter: params => moment(params.value).format('MM/DD/YYYY'), valueParser: value => moment(value).format("YYYY-MM-DD") },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 1000, min: 0,}}/>), editable: true },
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
        { field: 'qty_on_hand', headerName: 'Amt On Hand', width: 100, type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>), editable: false},
        { 
            field: 'parent_category', 
            headerName: 'Food Group', 
            width: 130, 
            type: 'singleSelect',
            valueOptions: parentCategories,
            editable: true,
            valueFormatter: (params) => {
                const category = parentCategories.find(cat => cat.value === params.value);
                return category ? category.label : 'No Category';
            }
        },
        { 
            field: 'specific_category', 
            headerName: 'Specific Category', 
            width: 150, 
            type: 'singleSelect',
            editable: true,
            valueOptions: (params) => {
                const parentCategory = params && params.row ? 
                    (params.row.parent_category || 0) : 0;
                return specificCategoriesMap[parentCategory] || specificCategoriesMap[0];
            },
            valueFormatter: (params) => {
                // If no value, return No Category
                if (params.value === null || params.value === undefined) {
                    return 'No Category';
                }

                // Search through all category lists to find the matching value
                for (const categoryList of Object.values(specificCategoriesMap)) {
                    const found = categoryList.find(cat => cat.value === params.value);
                    if (found) {
                        return found.label;
                    }
                }
                
                return 'No Category';
            },
            preProcessEditCellProps: (params) => {
                const parentCategory = params && params.row ? 
                    (params.row.parent_category || 0) : 0;
                const validOptions = specificCategoriesMap[parentCategory] || specificCategoriesMap[0];
                const isValid = validOptions.some(opt => opt.value === params.props.value);
                return { ...params.props, value: isValid ? params.props.value : 0 };
            }
        },
    ]

    // Page view; calls NewModularDataGrid
    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Ingredients</Typography>
            <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
            loginState={loginState}
            rows={ingredients}
            columns={columns}
            apiEndpoint='ingredient-inventory'
            // apiIP='localhost'
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
