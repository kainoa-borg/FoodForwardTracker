import { Button, Typography, Box, Grid, Checkbox, Snackbar, FormControlLabel, TextField, InputLabel, Paper } from "@mui/material";
import React, {useState, useEffect, useCallback, Fragment, useRef} from 'react';
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
import { number } from "yup";
import ModularSelect from "../components/ModularSelect.js";

export default function Recipe({recipeData, setRecipeData, ingredientOptions, packagingOptions, setCurrPage, getDBRecipeData, isAdding}) {
    // If recipeData prop is passed, use that, otherwise use empty recipeData
    // const [recipeName, setRecipeName] = useState(recipeData.r_name);
    const nameField = useRef();

    const IngredientNameEditCell = (params) => {
        const api = useGridApiContext();
        const [selectDialogOpen, setSelectDialogOpen] = useState(false);

        const setIngID = (ingName, ingID, unit) => {
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
    // 4.236.185.213

    const ingredientsColumns = [
        {
            field: 'ingredient_name',
            headerName: 'Ingredient',
            width: 100,
            type: 'string',
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} noDuplicates options={ingredientOptions} searchField={'ingredient_name'}/>
            }
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
        // {
        //     field: 'prep',
        //     headerName: 'Prep',
        //     width: 80,
        //     type: 'string',
        //     editable: true,
        // },
        {
            field: 'ri_ing',
            headerName: '',
            width: 0,
            type: 'number',
            editable: false
        }
    ]

    const packagingColumns = [
        {
            field: 'pkg_type',
            headerName: 'Packaging',
            width: 200,
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} options={packagingOptions} searchField={'package_type'}/>
            }
        },
        {
            field: 'ing_name',
            headerName: 'Ingredient',
            width: 200,
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} options={ingredientRows} searchField={'ingredient_name'}/>
            }
        }
    ]

    const stationColumns = [
        {
            field: 'stn_name',
            headerName: 'Station Name',
            width: 200,
            editable: true
        },
        {
            field: 'stn_desc',
            headerName: 'Description',
            width: 300,
            editable: true
        },
        // {
        //     field: 'stn_num',
        //     headerName: '',
        //     width: 0,
        //     editable: false
        // },
    ]

    const [ingredientRows, setIngredientRows] = useState(recipeData.r_ingredients);
    const [packagingRows, setPackagingRows] = useState(recipeData.r_packaging)
    const [stationRows, setStationRows] = useState(recipeData.r_stations ? recipeData.r_stations : []);
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

    const handleImageUpload = (event, apiEndpoint) => {
        // Send file in request to api
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUpdateSBOpen(true);
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/" + apiEndpoint + "/" + recipeData.r_num + '/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    const handleSaveClick = () => {
        // console.log(recipeData);
        const r_data = {...recipeData, r_name: nameField.current.value, r_ingredients: ingredientRows, r_packaging: packagingRows, r_stations: stationRows, m_s: m_s}
        // console.log(JSON.stringify(r_data));
        setUpdateSBOpen(true);
        if (isAdding) {
            axios({
                method: "POST",
                url:"http://4.236.185.213:8000/api/mealrecipes/",
                data: r_data,
            }).then((response)=>{
                console.log('success!')
                setUpdateDoneSBOpen(true);
                // getDBRecipeData(recipeData.r_num);
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
        else {
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/mealrecipes/" + recipeData.r_num + '/',
                data: r_data,
            }).then((response)=>{
                console.log('success!')
                setUpdateDoneSBOpen(true);
                // getDBRecipeData(recipeData.r_num);
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
    }

    const handleNameChange = (event) => {
        // setRecipeName(event.target.value);
    }

    const handleMealSnackChange = (event) => {
        setM_S(event.target.checked ? 1 : 0);
    }

    const RecipeImage = (props) => {
        // console.log(props.image_source);
        // Replace image with a prompt if undefined
        if (props.image_source) {
            return (<img style={{width: '30vw'}} src={`${props.image_source}?${Date.now()}`} key={props.image_source}></img>);
        }
        else {
            return (<Typography>Enter a recipe image</Typography>)
        }
    }

    const RecipeCard = (props) => {
        // console.log(props.card_source)
        // Replace image with a prompt if undefined
        if (props.card_source) {
            return (<iframe style={{height: '40vh', width: '30vw'}} src={`${props.card_source}?${Date.now()}`} key={props.card_source} type='application/pdf'/>);
        }
        else {
            return (<Typography>Enter a recipe card</Typography>)
        }
    }

    return (
        <Fragment>
            
            {/* Recipe Header */}
            <Box component={Paper} elevation={5} sx={{paddingLeft: '2%', paddingRight: '2%', paddingTop: '2%', paddingBottom: '2%'}}>
            <form onSubmit={(event) => event.preventDefault()}>
            
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h5'>{isAdding ? 'Add ' : 'Edit '}Recipe</Typography>
                <div>
                    {/* 'Save' button that saves recipe data */}
                    <Button color='lightGreen' variant='contained' type={'submit'} onClick={handleSaveClick}><Typography variant='h6'>Save</Typography></Button>
                    {/* 'Close' button that goes back to recipe list */}
                    <Button color='lightGreen' variant='contained' onClick={handleCloseClick}><Typography variant='h6'>Close</Typography></Button>    
                </div>
            </div>
            

            {/* Recipe Info Lists */}
            <Grid container justifyContent='space-between' direction='row' sx={{paddingTop: '2%'}}>
                
                {/* Recipe Image and Card Stack */}
                <Stack item spacing={3}>
                    <TextField required inputProps={{ref: nameField}} label={'Recipe Name'} defaultValue={recipeData.r_name}/>
                    <FormControlLabel control={<Checkbox checked={m_s===1 ? true : false} onChange={handleMealSnackChange}/>} label="Meal Recipe?"/>
                    <RecipeImage image_source={recipeData.r_img_path}/>
                    <Button color='lightBlue' variant='contained' component='label'>
                        Upload Image
                        <input id='recipe_image' type='file' accept='.jpg' onChange={(event) => handleImageUpload(event, 'mealrecipe-image')} hidden></input>
                    </Button>
                    <RecipeCard card_source={recipeData.r_card_path}/>
                    <Button color='lightBlue' variant='contained' component='label'>
                        Upload Recipe Card
                        <input id='recipe_card' type='file' accept='.jpg,.pdf,.doc,.docx' onChange={(event) => handleImageUpload(event, 'mealrecipe-card')} hidden></input>
                    </Button>
                </Stack>

                {/* Recipe Info Lists Stack */}
                <Stack item spacing={10}>
                    <Box>
                        <Typography variant='h6'>Ingredients</Typography>
                        <Box sx={{height: '50vh', width: {md: '45vw', sm: '80vw'}}}>
                            <ModularRecipeDatagrid 
                                rows={ingredientRows} 
                                setRows={setIngredientRows}
                                columns={ingredientsColumns}
                                addFormComponent={RecipeIngForm}
                                addFormProps={{ingredients: ingredientOptions}}
                                keyFieldName={'ri_id'}
                                searchField={'ingredient_name'}
                                entryName={'Recipe Ingredient'}
                            ></ModularRecipeDatagrid>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant='h6'>Packaging</Typography>
                        <Box sx={{height: '50vh', width: {md: '45vw', sm: '80vw'}}}>
                            <ModularRecipeDatagrid 
                                rows={packagingRows}
                                columns={packagingColumns}
                                setRows={setPackagingRows}
                                addFormComponent={RecipePkgForm}
                                addFormProps={{packaging: packagingOptions, ingRows: ingredientRows}}
                                keyFieldName={'rp_id'}
                                searchField={'pkg_type'}
                                entryName={'Recipe Packaging'}
                            ></ModularRecipeDatagrid>
                        </Box>    
                    </Box>
                    <Box>
                        <Typography variant='h6'>Station</Typography>
                        <Box sx={{height: '50vh', width: {md: '45vw', sm: '80vw'}}}>
                            <ModularRecipeDatagrid 
                                rows={stationRows}
                                columns={stationColumns} 
                                setRows={setStationRows}
                                addFormComponent={RecipeInstForm}
                                keyFieldName={'stn_num'}
                                searchField={'stn_name'}
                                entryName={'Station'}
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
            </form>
            </Box>
        </Fragment>
        
    )
}