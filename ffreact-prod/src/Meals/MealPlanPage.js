import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {DataGrid} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './MealList.css'

// mealPlan List Component
export default function MealPlanPage() {
    const [mealPlan, setMealPlan] = useState(undefined);
    const [recipeList, setRecipeList] = useState(undefined);
    const columns = [
        { field: 'm.m_s', headerName: 'Meal/Snack', width: 100 },
        { field: 'meal_name', headerName: 'Name', width: 170 },
        { field: 'm_date', headerName: 'Date', width: 120 },
        { field: 'm_latest', headerName: 'Latest', width: 120 },
       // { field: 'm', headerName: 'Last Date', width: 120, valueFormatter: ({ value }) => value.mdate },
       // { field: 'm', headerName: 'Planned Date', width: 120 },

       // { field: 'pkg_type', headerName: 'Package Type', width: 120 },
       // { field: 'unit', headerName: 'Measure', width: 90 },
       // { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value) },
       // { field: 'pref_isupplier', headerName: 'Supplier', width: 180, valueFormatter: ({ value }) => value.s_name },
       //  { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date' },
       //  { field: 'in_qty', headerName: 'Purchased Amount', width: 140 },
       //  { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
       //  { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true }
    ]

    useEffect(() => {
        getDBMealPlan();
        getDBRecipeList();
    }, []);

    const getDBMealPlan = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:"http://localhost:8000/api/meals-list/"
          }).then((response)=>{
            const mealData = response.data
            setMealPlan(mealData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const getDBRecipeList = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/recipe-list/"
          }).then((response)=>{
            const recipeData = response.data
            setRecipeList(recipeData);
            console.log(recipeData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const handleRowClick = (params) => {
        getDBMealPlan(params.row.m_id);
        wait(300);
        console.log(mealPlan);
    }

    if (mealPlan === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    
    return(
        <div class='table-div'>
        <h3>Meal Plan</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            onRowClick={handleRowClick} 
            rows={mealPlan} 
            columns={columns} 
            getRowId={(row) => row.m_id}
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
