import { Button, Typography, Box, Grid } from "@mui/material";
import React, {useState, useEffect, createRef} from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import axios from 'axios'
// import FormData from 'axios'
import RecipePage from './RecipePage.js'
import ModularRecipeDatagrid from "../components/ModularRecipeDatagrid.js";

export default function Recipe(props) {
    const [recipeData, setRecipeData] = useState(props.recipeData);
    const setCurrPage = props.setCurrPage;
    const gridRef = createRef();

    const ingredientsColumns = [
        {
            field: 'ingredient_name',
            headerName: 'Ingredient',
            width: 100,
            type: 'string',
            editable: true
        },
        {
            field: 'amt',
            headerName: 'Amount',
            width: 80,
            type: 'number',
            editable: true,
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 70,
            type: 'string',
            editable: true,
        },
        {
            field: 'prep',
            headerName: 'Prep',
            width: 80,
            type: 'string',
            editable: true,
        }
    ]

    const packagingColumns = [
        {
            field: 'pkg_type',
            headerName: 'Packaging',
            width: 200,
            editable: true
        },
        {
            field: 'amt',
            headerName: 'Qty',
            width: 70,
            editable: true
        },
    ]

    const instructionColumns = [
        {
            field: 'step_no',
            headerName: 'Step #',
            width: 80,
            editable: true
        },
        {
            field: 'step_inst',
            headerName: 'Instruction',
            width: 200,
            editable: true
        },
        {
            field: 'stn_name',
            headerName: 'Station',
            width: 100,
            editale: true
        },
    ]

    const [ingredientRows, setIngredientRows] = useState(recipeData.r_ingredients);
    const [packagingRows, setPackagingRows] = useState(recipeData.r_packaging)
    const [instructionRows, setInstructionRows] = useState(recipeData.r_instructions)
    const dietRows = recipeData.r_diets
    const allergyRows = recipeData.r_allergies

    console.log(ingredientRows)

    const handleCloseClick = () => {
        // Return to recipe list when close is clicked
        setCurrPage(<RecipePage setCurrPage={setCurrPage}></RecipePage>)
    }

    const RecipeImage = (props) => {
        // Replace image with a prompt if undefined
        if (!(props.image_source === undefined)) {
            return (<img style={{width: '30vw'}} src={props.image_source}></img>);
        }
        else {
            return (<Typography>Enter a recipe image</Typography>)
        }
    }

    const handleImageUpload = (event, apiEndpoint) => {
        // Send file in request to api
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/" + apiEndpoint + "/" + recipeData.r_num + '/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            console.log('success!')
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleUpdateRecipe = () => {
        const r_data = {...recipeData, r_ingredients: ingredientRows, r_packaging: packagingRows, r_instructions: instructionRows}
        console.log(r_data);
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/mealrecipes/" + recipeData.r_num + '/',
            data: r_data,
        }).then((response)=>{
            console.log('success!')
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    return (
        <div>
        
        {/* 'Close' button that goes back to recipe list */}
        <Button color='lightGreen' variant='contained' onClick={handleCloseClick}><Typography variant='h6'>Close</Typography></Button>
        
        {/* 'Save' button that saves recipe data */}
        <Button color='lightGreen' variant='contained' onClick={handleUpdateRecipe}><Typography variant='h6'>Save</Typography></Button>

        {/* Recipe Page */}
        <Grid container justifyContent='space-between' direction='row'>
            
            {/* Recipe Image and Card Stack */}
            <Stack item spacing={3}>
                <Typography variant='h4' sx={{textDecoration: 'underline'}}>{recipeData.r_name}</Typography>
                <RecipeImage image_source={recipeData.r_img_path}/>
                <Button color='lightGreen' variant='contained' component='label'>
                    Upload Image
                    <input id='recipe_image' type='file' accept='.jpg' onChange={(event) => handleImageUpload(event, 'mealrecipe-image')} hidden></input>
                </Button>
                <RecipeImage image_source={recipeData.r_card_path}/>
                <Button color='lightGreen' variant='contained' component='label'>
                    Upload Recipe Card
                    <input id='recipe_card' type='file' accept='.jpg' onChange={(event) => handleImageUpload(event, 'mealrecipe-card')} hidden></input>
                </Button>
            </Stack>

            {/* Recipe Info Lists Stack */}
            <Stack item spacing={10}>
                <Box>
                    <Typography variant='h6'>Ingredients</Typography>
                    <Box sx={{height: '40vh', width: {md: '40vw', sm: '70vw'}}}>
                        <ModularRecipeDatagrid 
                            ref={gridRef}
                            rows={ingredientRows} 
                            setRows={setIngredientRows}
                            columns={ingredientsColumns} 
                            keyFieldName={'ri_ing'}
                        ></ModularRecipeDatagrid>
                    </Box>
                </Box>
                <Box>
                    <Typography variant='h6'>Packaging</Typography>
                    <Box sx={{height: '40vh', width: {md: '40vw', sm: '70vw'}}}>
                        <ModularRecipeDatagrid 
                            rows={packagingRows}
                            columns={packagingColumns}
                            setRows={setPackagingRows}
                            keyFieldName={'rp_pkg'}
                        ></ModularRecipeDatagrid>
                    </Box>    
                </Box>
                <Box>
                    <Typography variant='h6'>Instructions</Typography>
                    <Box sx={{height: '40vh', width: {md: '40vw', sm: '70vw'}}}>
                        <ModularRecipeDatagrid 
                            rows={instructionRows}
                            columns={instructionColumns} 
                            setRows={setInstructionRows}
                            keyFieldName={'step_no'}
                        ></ModularRecipeDatagrid>
                    </Box>
                </Box>
            </Stack>

        </Grid>
        </div>
    )
}