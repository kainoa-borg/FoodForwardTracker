import { Button, Typography, Box, Grid, Checkbox, Snackbar, FormControlLabel } from "@mui/material";
import React, {useState, useEffect, createRef} from 'react';
import { DataGrid, useGridApiContext } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import axios from 'axios'
// import FormData from 'axios'
import RecipePage from './RecipePage.js'
import ModularRecipeDatagrid from "../components/ModularRecipeDatagrid.js";
import RecipeIngForm from "./RecipeIngForm.js"
import RecipePkgForm from "./RecipePkgForm.js"
import RecipeInstForm from './RecipeInstForm.js'
import RecipeIngList from "./RecipeIngList.js"

import DataGridDialog from '../components/DatagridDialog.js'

export default function Recipe(props) {
    // const [recipeData, setRecipeData] = useState(props.recipeData);
    const recipeData = props.recipeData;
    const setRecipeData = props.setRecipeData;
    const setCurrPage = props.setCurrPage;
    const getDBRecipeData = props.getDBRecipeData;

    const IngredientNameEditCell = (params) => {
        const api = useGridApiContext();
        const [selectDialogOpen, setSelectDialogOpen] = useState(false);

        const setIngID = (ingName, ingID, unit) => {
            //api.current.updateRows([{ri_id: params.id, ingredient_name: ingName, ri_ing: ingID, unit: unit}]);
            const {id, value, field} = params;
            api.current.setEditCellValue({id, field: 'ingredient_name', value: ingName});
            api.current.setEditCellValue({id, field: 'ri_ing', value: ingID});
            api.current.setEditCellValue({id, field: 'unit', value: unit});
        }


        var ing_name = params.value;
        if (!ing_name) ing_name = 'ingredient';

        return (
            <div>
                <Button variant='outlined' sx={{width: '100%'}}onClick={() => setSelectDialogOpen(true)}>{ing_name}</Button>
                <DataGridDialog DataGridComponent={RecipeIngList} setID={setIngID} open={selectDialogOpen} setOpen={setSelectDialogOpen}/>
            </div>
        )
    }

    const ingredientsColumns = [
        {
            field: 'ingredient_name',
            headerName: 'Ingredient',
            width: 100,
            type: 'string',
            editable: true,
            // renderEditCell: (params) => {
            //     return (
            //         <IngredientNameEditCell {...params}/>
            //     )
            // }
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
        },
        {
            field: 'ri_ing',
            headerName: '',
            width: 0,
            type: 'number',
            editable: true
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
    const [m_s, setM_S] = useState(recipeData.m_s);
    const dietRows = recipeData.r_diets
    const allergyRows = recipeData.r_allergies

    // Boolean 'request made' message state
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    // Boolean 'request success' message state
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);

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
            getDBRecipeData(recipeData.r_num);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    const handleUpdateRecipe = () => {
        console.log(recipeData);
        const r_data = {...recipeData, r_ingredients: ingredientRows, r_packaging: packagingRows, r_instructions: instructionRows, m_s: m_s}
        console.log(JSON.stringify(r_data));
        setUpdateSBOpen(true);
        axios({
            method: "PATCH",
            url:"http://localhost:8000/api/mealrecipes/" + recipeData.r_num + '/',
            data: r_data,
        }).then((response)=>{
            console.log('success!')
            setUpdateDoneSBOpen(true);
            getDBRecipeData(recipeData.r_num);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleMealSnackChange = (event) => {
        setM_S(event.target.checked ? 1 : 0);
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
                <FormControlLabel control={<Checkbox checked={m_s ? 1 : 0} onChange={handleMealSnackChange}/>} label="Meal Recipe?"/>
                <RecipeImage image_source={recipeData.r_img_path}/>
                <Button color='lightGreen' variant='contained' component='label'>
                    Upload Image
                    <input id='recipe_image' type='file' accept='.jpg' onChange={(event) => handleImageUpload(event, 'mealrecipe-image')} hidden></input>
                </Button>
                <RecipeImage image_source={recipeData.r_card_path}/>
                <Button color='lightGreen' variant='contained' component='label'>
                    Upload Recipe Card
                    <input id='recipe_card' type='file' accept='.jpg,.pdf,.doc,.docx' onChange={(event) => handleImageUpload(event, 'mealrecipe-card')} hidden></input>
                </Button>
            </Stack>

            {/* Recipe Info Lists Stack */}
            <Stack item spacing={10}>
                <Box>
                    <Typography variant='h6'>Ingredients</Typography>
                    <Box sx={{height: '40%', width: {md: '45vw', sm: '80vw'}}}>
                        <ModularRecipeDatagrid 
                            rows={ingredientRows} 
                            setRows={setIngredientRows}
                            columns={ingredientsColumns}
                            addFormComponent={RecipeIngForm}
                            keyFieldName={'ri_id'}
                        ></ModularRecipeDatagrid>
                    </Box>
                </Box>
                <Box>
                    <Typography variant='h6'>Packaging</Typography>
                    <Box sx={{height: '40%', width: {md: '45vw', sm: '80vw'}}}>
                        <ModularRecipeDatagrid 
                            rows={packagingRows}
                            columns={packagingColumns}
                            setRows={setPackagingRows}
                            addFormComponent={RecipePkgForm}
                            keyFieldName={'rp_id'}
                        ></ModularRecipeDatagrid>
                    </Box>    
                </Box>
                <Box>
                    <Typography variant='h6'>Instructions</Typography>
                    <Box sx={{height: '40%', width: {md: '45vw', sm: '80vw'}}}>
                        <ModularRecipeDatagrid 
                            rows={instructionRows}
                            columns={instructionColumns} 
                            setRows={setInstructionRows}
                            addFormComponent={RecipeInstForm}
                            keyFieldName={'step_no'}
                        ></ModularRecipeDatagrid>
                    </Box>
                </Box>
            </Stack>
        </Grid>
        {/* Save Click 'request sent' Notice */}
        <Snackbar
            open={updateSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateSBOpen)}
            message="Saving..."
        />
        {/* Save Complete 'request success' Notice */}
        <Snackbar
            open={updateDoneSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateDoneSBOpen)}
            message="Changes saved!"
        />
        </div>
    )
}