import { Button, Typography, Box, Grid } from "@mui/material";
import React, {useState, useEffect} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

import RecipePage from './RecipePage.js'

export default function Recipe(props) {
    let recipeData = props.recipeData;
    const setCurrPage = props.setCurrPage;

    const ingredientsColumns = [
        {
            field: 'ingredient_name',
            headerName: 'Ingredient',
            width: 100,
        },
        {
            field: 'amt',
            headerName: 'Amount',
            width: 80,
            editable: true,
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 70,
            editable: true,
        },
        {
            field: 'prep',
            headerName: 'Prep',
            width: 80,
            editable: true,
        }
    ]

    const packagingColumns = [
        {
            field: 'pkg_type',
            headerName: 'Packaging',
            width: 200,
        },
        {
            field: 'amt',
            headerName: 'Qty',
            width: 70,
        },
    ]

    const instructionColumns = [
        {
            field: 'step_no',
            headerName: 'Step #',
            width: 80,
        },
        {
            field: 'step_inst',
            headerName: 'Instruction',
            width: 200,
        },
        {
            field: 'stn_name',
            headerName: 'Station',
            width: 100,
        },
    ]

    const ingredientRows = recipeData.r_ingredients
    const packagingRows = recipeData.r_packaging
    const instructionRows = recipeData.r_instructions
    const dietRows = recipeData.r_diets
    const allergyRows = recipeData.r_allergies

    console.log(ingredientRows)

    const handleCloseClick = () => {
        setCurrPage(<RecipePage setCurrPage={setCurrPage}></RecipePage>)
    }

    return (
        <div>
        <Button color='lightGreen' variant='contained' onClick={handleCloseClick}><Typography variant='h6'>Close</Typography></Button>
        <Grid container justifyContent='space-between' direction='row'>
            <Stack item spacing={3}>
                <Typography variant='h4' sx={{textDecoration: 'underline'}}>{recipeData.r_name}</Typography>
                <img style={{width: '30vw'}} src='https://deliexpress.com/wp-content/uploads/2021/05/0029_DE_WDG_Smk_Ham_Ch-1.jpg'></img>
                <Button color='lightGreen' variant='contained'>Upload Image</Button>
                <img style={{width: '30vw', marinLeft: '1em'}} src='https://www.papertraildesign.com/wp-content/uploads/2017/10/Recipe-Card-3x5.jpg'></img>
                <Button color='lightGreen' variant='contained'>Upload PDF</Button>
            </Stack>
            <Stack item spacing={1}>
                <Box>
                    <Typography variant='h6'>Ingredients</Typography>
                    <Box sx={{height: '30vh', width: {md: '40vw', sm: '70vw'}}}>
                        <DataGrid rows={ingredientRows} columns={ingredientsColumns} getRowId={(row)=> row.ri_ing}></DataGrid>
                    </Box>
                </Box>
                <Box>
                    <Typography variant='h6'>Packaging</Typography>
                    <Box sx={{height: '30vh', width: {md: '40vw', sm: '70vw'}}}>
                        <DataGrid rows={packagingRows} columns={packagingColumns} getRowId={(row)=> row.rp_pkg}></DataGrid>
                    </Box>    
                </Box>
                <Box>
                    <Typography variant='h6'>Instructions</Typography>
                    <Box sx={{height: '30vh', width: {md: '40vw', sm: '70vw'}}}>
                        <DataGrid rows={instructionRows} columns={instructionColumns} getRowId={(row)=> row.step_no}></DataGrid>
                    </Box>
                </Box>
            </Stack>
        </Grid>
        </div>
    )
}