import { Button, Typography, Box, Grid, Snackbar, Stack, TextField, 
    InputLabel, Paper, MenuItem, Select, FormControl } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import React, {useState, useEffect, Fragment, useRef} from 'react';
import { useGridApiContext } from "@mui/x-data-grid";
import axios from 'axios';
import RecipePage from './RecipePage.js';
import ModularRecipeDatagrid from "../components/ModularRecipeDatagrid.js";
import RecipeIngForm from "./RecipeIngForm.js";
import RecipePkgForm from "./RecipePkgForm.js";
import RecipeInstForm from './RecipeInstForm.js';
import RecipeIngList from "./RecipeIngList.js";
import DataGridDialog from '../components/DatagridDialog.js';
import ModularSelect from "../components/ModularSelect.js";
import { useNavigate } from "react-router-dom";
// import food_placeholder from '../Images/food_placeholder.jpg'

export default function Recipe({recipeData, setRecipeData, ingredientOptions, packagingOptions, setCurrPage, getDBRecipeData, isAdding}) {
    // If recipeData prop is passed, use that, otherwise use empty recipeData
    // const [recipeName, setRecipeName] = useState(recipeData.r_name);
    const nameField = useRef();
    const navigate = useNavigate();

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
            width: 200,
            type: 'string',
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} noDuplicates options={ingredientOptions} searchField={'ingredient_name'}/>
            }
        },
        {
            field: 'amt',
            headerName: 'Amount',
            width: 100,
            type: 'number',
            editable: true,
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 100,
            type: 'string',
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} noDuplicates options={ingredientOptions} searchField={'unit'}/>
            }
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
            width: 250,
            editable: true,
            renderEditCell: (params) => {
                return <ModularSelect {...params} options={packagingOptions} searchField={'package_type'}/>
            }
        },
        {
            field: 'pkg_contents',
            headerName: 'Contents',
            width: 400,
            editable: true,
            type: 'string'
        }
    ]

    const stationColumns = [
        {
            field: 'stn_name',
            headerName: 'Station Name',
            width: 250,
            editable: true
        },
        {
            field: 'stn_desc',
            headerName: 'Description',
            width: 350,
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
    // Boolean error popup state
    const [errorSBOpen, setErrorSBOpen] = useState(false);
    // Error message
    const [errorMessage, setErrorMessage] = useState();

    const [imageFile, setImageFile] = useState();
    const [cardFile, setCardFile] = useState();

    const [imagePath, setImagePath] = useState(recipeData.r_img_path);
    const [cardPath, setCardPath] = useState(recipeData.r_card_path);

    const [tempImagePath, setTempImagePath] = useState();
    const [tempCardPath, setTempCardPath] = useState();

    const [deleteImage, setDeleteImage] = useState(false);
    const [deleteCard, setDeleteCard] = useState(false);

    const handleCloseClick = () => {
        // Return to recipe list when close is clicked
        handleClearTempFiles();
        setCurrPage(<RecipePage/>);
    }

    const handleTempUpload = (file, apiEndpoint) => {
        const formData = new FormData();
        formData.append('file', file);
        // setUpdateSBOpen(true);
        axios({
            method: "POST",
            url:"http:///4.236.185.213:8000/api/" + apiEndpoint + '/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            if (apiEndpoint === 'tempimageupload')
                setTempImagePath(response.data);
            if (apiEndpoint === 'tempcardupload')
                setTempCardPath(response.data);
            // console.log(apiEndpoint, 'temp upload success')
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleDeleteRecipeImage = (imgOrCard) => {
        console.log(recipeData.r_num);
        if (recipeData.r_img_path || recipeData.r_card_path) {
            axios({
                method: "DELETE",
                url:"http://4.236.185.213:8000/api/" + (imgOrCard==='image' ? 'mealrecipe-image' : 'mealrecipe-card') + "/" + recipeData.r_num + '/'
            }).then((response)=>{
                setUpdateDoneSBOpen(true);
                // console.log(imgOrCard, 'delete recipe image success!')
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
    }

    const handleClearTempFiles = () => {
        if (tempImagePath) {
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/" + ('tempimageupload') + '/' + 0 + '/',
                data: {path: tempImagePath}
            }).then((response)=>{
                // console.log(imgOrCard, 'temp image delete success!')
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
        if (tempCardPath) {
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/" + ('tempcardupload') + '/' + 0 + '/',
                data: {path: tempCardPath}
            }).then((response)=>{
                // console.log(imgOrCard, 'temp image delete success!')
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        } 
    }

    const handleDeleteImageClick = (imgOrCard) => {
        // if (imgOrCard === 'image' && recipeData.r_img_path) setDeleteImage(true);
        // if (imgOrCard === 'card' && recipeData.r_card_path) setDeleteCard(true);
        // console.log('handleDeleteImageClick: ', tempImagePath, tempCardPath);
        if (tempImagePath || tempCardPath) {
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/" + (imgOrCard==='image' ? 'tempimageupload' : 'tempcardupload') + '/' + 0 + '/',
                data: (imgOrCard==='image') ? {path: tempImagePath} : {path: tempCardPath}
            }).then((response)=>{
                // console.log(imgOrCard, 'temp image delete success!')
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
        if (imgOrCard==='image') {
            setImageFile();
            setTempImagePath();
            setImagePath();
            setDeleteImage(true);
        }
        else if (imgOrCard==='card') {
            setCardFile();
            setTempCardPath();
            setCardPath();
            setDeleteCard(true);
        }
    }

    const handleImageUpload = (file, r_num, apiEndpoint) => {
        // console.log('handleImageUpload', apiEndpoint, file);
        if (!file) {
            return;
        }
        // Send file in request to api
        const formData = new FormData();
        formData.append('file', file);
        // setUpdateSBOpen(true);
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/" + apiEndpoint + "/" + r_num + '/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            // console.log(apiEndpoint, 'image upload success!')
            apiEndpoint==='mealrecipe-image' ? setImageFile() : setCardFile();
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

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    const handleErrorMessage = (error) => {
        // if (error.response.data) {
        //     console.log(error.response.data)
        //     let error_field = ''
        //     let error_text = ''
        //     let error_keys = Object.keys(error.response.data);
        //     error_keys.forEach((error_key) => {
        //         error_field = error_key
        //         error_text = error.response.data[error_key]
        //     })
        //     setErrorMessage('Save Failed!' + error_field + ' ' + error_text);
        // }
        setErrorMessage('Save failed! ' + error.response.statusText);
    }
    useEffect(() => {
        console.log(errorMessage);
        if (errorMessage)
            setErrorSBOpen(true);
    }, [errorMessage])

    const handleSaveClick = () => {
        // console.log(recipeData);
        const r_data = {...recipeData, r_name: nameField.current.value, r_ingredients: ingredientRows, r_packaging: packagingRows, r_stations: stationRows, m_s: m_s}
        // console.log(JSON.stringify(r_data));
        setUpdateSBOpen(true);

        // console.log('deleteImage: ', deleteImage, 'deleteCard: ', deleteCard)

        if (deleteImage) {
            handleDeleteRecipeImage('image')
            setDeleteImage(false);
        }
        if (deleteCard) {
            handleDeleteRecipeImage('card')
            setDeleteCard(false);
        }

        if (isAdding) {
            axios({
                method: "POST",
                url:"http://4.236.185.213:8000/api/mealrecipes/",
                data: r_data,
            }).then((response)=>{
                if (imageFile) {
                    handleImageUpload(imageFile, response.data, 'mealrecipe-image');
                }
                if (cardFile) {
                    handleImageUpload(cardFile, response.data, 'mealrecipe-card');
                }
                // console.log('post success!')
                setUpdateDoneSBOpen(true);
                setCurrPage(<RecipePage updateDone={true}/>);
            }).catch((error) => {
            if (error.response) {
                handleErrorMessage(error);
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
        else {
            if (imageFile) {
                handleImageUpload(imageFile, recipeData.r_num, 'mealrecipe-image');
            }
            if (cardFile) {
                handleImageUpload(cardFile, recipeData.r_num, 'mealrecipe-card');
            }
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/mealrecipes/" + recipeData.r_num + '/',
                data: r_data,
            }).then((response)=>{
                // console.log('patch success!')
                setUpdateDoneSBOpen(true);
                setCurrPage(<RecipePage updateDone={true}/>);
            }).catch((error) => {
            if (error.response) {
                handleErrorMessage(error);
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
        setM_S(event.target.value);
    }

    const RecipeImage = (props) => {
        // console.log(props.image_source);
        // Replace image with a prompt if undefined
        if (props.image_source) {
            return (
                <Box sx={{position: 'relative'}}>
                    <Button color='lightBlue' variant='contained' sx={{position: 'absolute', right: '0%'}} onClick={() => handleDeleteImageClick('image')}>
                        <HighlightOff/>
                    </Button>
                    <Box sx={{height: '100%', width: '100%'}}>
                        <iframe style={{height: '50vh', width: '30vw'}} src={`${props.image_source}?${Date.now()}`} key={props.image_source}></iframe>
                    </Box>
                </Box>                
            );
        }
        else {
            return (<Typography>Enter a recipe image</Typography>)
        }
    }

    const RecipeCard = (props) => {
        // console.log(props.card_source)
        // Replace image with a prompt if undefined
        if (props.card_source) {
            return (
                <Box sx={{position: 'relative'}}>
                    <Button color='lightBlue' variant='contained' sx={{position: 'absolute', right: '0%'}} onClick={() => {handleDeleteImageClick('card')}}>
                        <HighlightOff/>
                    </Button>
                    <Box sx={{height: '100%', width: '100%'}}>
                        <iframe style={{height: '50vh', width: '30vw'}} src={`${props.card_source}?${Date.now()}`} key={props.card_source} type='application/pdf'/>
                    </Box>
                </Box>
            );
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
                <Box sx={{backgroundColor: '#9AB847'}}>
                    {/* 'Save' button that saves recipe data */}
                    <Button color='lightGreen' variant='contained' sx={{boxShadow:'0'}} type={'submit'} onClick={handleSaveClick}><Typography variant='h6'>Save</Typography></Button>
                    {/* 'Close' button that goes back to recipe list */}
                    <Button color='lightGreen' variant='contained' sx={{boxShadow:'0'}} onClick={handleCloseClick}><Typography variant='h6'>Close</Typography></Button>    
                </Box>
            </div>
            

            {/* Recipe Info Lists */}
            <Grid container justifyContent='space-between' direction='row' sx={{paddingTop: '2%'}}>
                
                {/* Recipe Image and Card Stack */}
                <Stack item spacing={3}>
                        {/* <InputLabel id='recipeNameLabel'>Recipe Name</InputLabel> */}
                        <TextField label='Recipe Name' required inputProps={{ref: nameField}} defaultValue={recipeData.r_name}/>
                    <FormControl>
                        <InputLabel id='mealOrSnackLabel'>Meal Or Snack?</InputLabel>
                        <Select labelID='mealOrSnackLabel' required value={m_s} label={'Meal Or Snack'} onChange={handleMealSnackChange}>
                            <MenuItem value={undefined} disabled>Meal/Snack</MenuItem>
                            <MenuItem value={1}>Meal</MenuItem>
                            <MenuItem value={0}>Snack</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Recipe Image */}
                    <RecipeImage image_source={tempImagePath ? tempImagePath : imagePath}/>
                    <Button color='lightBlue' variant='contained' component='label'>
                        Upload Image
                        <input id='recipe_image' type='file' accept='.jpg,.png,.bmp' onChange={(event) => {handleTempUpload(event.target.files[0], 'tempimageupload'); setImageFile(event.target.files[0])}} hidden></input>
                    </Button>

                    {/* Recipe Card */}
                    <RecipeCard card_source={tempCardPath ? tempCardPath : cardPath}/>
                    <Button color='lightBlue' variant='contained' component='label'>
                        Upload Recipe Card
                        <input id='recipe_card' type='file' accept='.pdf,.doc,.docx' onChange={(event) => {handleTempUpload(event.target.files[0], 'tempcardupload'); setCardFile(event.target.files[0])}} hidden></input>
                    </Button>
                </Stack>

                {/* Recipe Info Tables Stack */}
                <Stack item spacing={10}>
                    
                    {/* Ingredient Table */}
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

                    {/* Packaging Table */}
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
                    
                    {/* Station Table */}
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
            <Snackbar
                open={errorSBOpen}
                autoHideDuration={3000}
                onClose={(event, reason) => handleSBClose(event, reason, setErrorSBOpen)}
                message={errorMessage}
            />
            </form>
            </Box>
        </Fragment>
        
    )
}