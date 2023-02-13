import React, {Fragment, useEffect, useState} from 'react'
import axios from 'axios'
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { waitFor } from '@testing-library/react';
import { wait } from '@testing-library/user-event/dist/utils';
import Recipe from './Recipe.js'

export default function RecipePage(props) {

    const [recipes, setRecipes] = useState();
    const [recipeData, setRecipeData] = useState();

    const setCurrPage = props.setCurrPage;

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
            url:"http://localhost:8000/api/mealrecipes/" + pk + '/'
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
        }
    ]

    if (recipes === undefined) {
        return (
            <>loading...</>
        )
    }
    else {
        if (!(recipeData === undefined))
            setCurrPage(<Recipe recipeData={recipeData} setCurrPage={setCurrPage}></Recipe>);
    }

    const handleRowClick = (params) => {
        getDBRecipeData(params.row.r_num);
        return (
            <>loading...</>
        );
        // setCurrPage(<Recipe recipeData={recipeData}></Recipe>)
    }

    return(
        <Box sx={{height: '80vh'}}>
            <DataGrid onRowClick={handleRowClick} rows={recipes} columns={columns} getRowId={(row) => row.r_num}>
            </DataGrid>
        </Box>
    )
}