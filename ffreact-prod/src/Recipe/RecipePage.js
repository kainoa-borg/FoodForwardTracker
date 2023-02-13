import React, {Fragment, useEffect, useState} from 'react'
import axios from 'axios'
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { waitFor } from '@testing-library/react';
import { wait } from '@testing-library/user-event/dist/utils';

export default function RecipePage() {

    const [recipes, setRecipes] = useState();
    const [recipeData, setRecipeData] = useState();

    const getDBRecipes = () => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/recipe-list"
        }).then((response)=>{
        setRecipes(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const getDBRecipeData = (pk) => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/mealrecipes/" + pk
        }).then((response)=>{
        setRecipeData(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    useEffect(() => {
        getDBRecipes();
    }, [])

    const columns = [
        {
            field: 'r_name',
            headerName: 'Select a Recipe',
            width: 400,
            editable: true,
        }
    ]

    if (recipes === undefined) {
        return (
            <>loading...</>
        )
    }

    const handleRowClick = (params) => {
        getDBRecipeData(params.row.r_num);
        wait(300);
        console.log(recipeData);
    }

    return(
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            onRowClick={handleRowClick} 
            rows={recipes} 
            columns={columns} 
            getRowId={(row) => row.r_num}>
            </DataGrid>
        </Box>
    )
}