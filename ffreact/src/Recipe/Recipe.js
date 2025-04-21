import { Button, Typography, Box, Grid, Snackbar, Stack, TextField, 
    InputLabel, Paper, MenuItem, Select, FormControl, Input, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { HighlightOff, Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material";
import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom';
import axios from 'axios';
import RecipePage from './RecipePage.js';
import ModularRecipeDatagrid from "../components/ModularRecipeDatagrid.js";
import RecipeIngForm from "./RecipeIngForm.js";
import RecipePkgForm from "./RecipePkgForm.js";
import RecipeInstForm from './RecipeInstForm.js';
import DataGridDialog from '../components/DatagridDialog.js';
import NewModularSelect from "../components/NewModularSelect.js";
import { useNavigate } from "react-router-dom";

export default function Recipe({ loginState, recipeData, setRecipeData, ingredientOptions, packagingOptions, setCurrPage, getDBRecipeData, isAdding}) {
    const nameField = useRef();
    const servingField = useRef();
    const navigate = useNavigate();

    const SubstepsEditDialog = ({ params, onClose, onSave }) => {
        const [substeps, setSubsteps] = useState(params.value || []);
        const [newSubstep, setNewSubstep] = useState({ description: '' });
    
        const handleSave = () => {
            onSave(substeps);
            onClose();
        };
    
        const handleAddSubstep = () => {
            if (newSubstep.description) {
                setSubsteps([...substeps, { ...newSubstep }]);
                setNewSubstep({ description: '' });
            }
        };
    
        const handleRemoveSubstep = (index) => {
            setSubsteps(substeps.filter((_, i) => i !== index));
        };
    
        return (
            <Dialog open onClose={onClose}>
                <DialogTitle>Edit Substeps</DialogTitle>
                <DialogContent>
                    <Box sx={{ minWidth: 400, p: 2 }}>
                        {substeps.map((substep, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                <Typography>{`${index + 1}.`}</Typography>
                                <TextField
                                    value={substep.description}
                                    onChange={(e) => {
                                        const newSubsteps = [...substeps];
                                        newSubsteps[index].description = e.target.value;
                                        setSubsteps(newSubsteps);
                                    }}
                                    fullWidth
                                />
                                <IconButton onClick={() => handleRemoveSubstep(index)} size="small">
                                    <RemoveIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                            <TextField
                                label="New Substep"
                                value={newSubstep.description}
                                onChange={(e) => setNewSubstep({ description: e.target.value })}
                                fullWidth
                            />
                            <IconButton onClick={handleAddSubstep} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        );
    };

    const SubstepEditPortal = ({ isOpen, params, onClose, onSave }) => {
        if (!isOpen) return null;
        
        return createPortal(
            <SubstepsEditDialog params={params} onClose={onClose} onSave={onSave} />,
            document.body
        );
    };

    const SubstepEditCell = React.memo(({ params }) => {
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        const handleOpen = (event) => {
            event.stopPropagation();
            setIsDialogOpen(true);
        };

        const handleClose = () => {
            setIsDialogOpen(false);
        };

        const handleSave = (newSubsteps) => {
            params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newSubsteps
            }, true);
            handleClose();
        };

        return (
            <>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpen}
                        fullWidth
                        sx={{ height: '100%' }}
                    >
                        Edit Substeps ({(params.value || []).length})
                    </Button>
                </Box>
                <SubstepEditPortal
                    isOpen={isDialogOpen}
                    params={params}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            </>
        );
    });

    const ingredientsColumns = [
        {
            field: 'ingredient_name',
            headerName: 'Ingredient',
            width: 200,
            type: 'string',
            editable: true,
            renderEditCell: (params) => {
                return <NewModularSelect {...params} noDuplicates options={ingredientOptions} searchField={'ing_name'}/>
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
                let tempOptions = ingredientOptions.find((ing) => ing.ing_name === params.row.ingredient_name)
                if (!tempOptions) tempOptions = {ing_units: []};
                return <NewModularSelect {...params} noDuplicates options={tempOptions['ing_units']} searchField={'recipe_unit'}/>
            }
        },
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
                return <NewModularSelect {...params} options={packagingOptions} searchField={'package_type'}/>
            }
        },
        {
            field: 'pkg_contents',
            headerName: 'Contents',
            width: 250,
            editable: true,
            type: 'string'
        }
    ]

    const prepInstructionsColumns = [
        {
            field: 'step_num',
            headerName: 'Step',
            width: 100,
            editable: true,
            type: 'number'
        },
        {
            field: 'amount_per_serving',
            headerName: 'Amount/Serving',
            width: 120,
            editable: true,
            type: 'number'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 100,
            editable: true
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
            editable: true
        },
        {
            field: 'substeps',
            headerName: 'Substeps',
            width: 400,
            editable: true,
            renderCell: (params) => {
                if (!params.value) return null;
                return (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflow: 'auto',
                            '&:hover': {
                                position: 'absolute',
                                backgroundColor: 'white',
                                zIndex: 1000,
                                height: 'auto',
                                maxHeight: '300px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: '8px',
                                borderRadius: '4px'
                            }
                        }}
                    >
                        {params.value.map((substep, index) => (
                            <Typography key={index} sx={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                                {`${index + 1}. ${substep.description}`}
                            </Typography>
                        ))}
                    </Box>
                );
            },
            renderEditCell: (params) => <SubstepEditCell params={params} />
        },
        {
            field: 'notes',
            headerName: 'Notes',
            width: 200,
            editable: true
        }
    ];

    const cookingInstructionsColumns = [
        {
            field: 'step_num',
            headerName: 'Step',
            width: 100,
            editable: true,
            type: 'number'
        },
        {
            field: 'amount_per_serving',
            headerName: 'Amount/Serving',
            width: 120,
            editable: true,
            type: 'number'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            width: 100,
            editable: true
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
            editable: true
        },
        {
            field: 'substeps',
            headerName: 'Substeps',
            width: 400,
            editable: true,
            renderCell: (params) => {
                if (!params.value) return null;
                return (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflow: 'auto',
                            '&:hover': {
                                position: 'absolute',
                                backgroundColor: 'white',
                                zIndex: 1000,
                                height: 'auto',
                                maxHeight: '300px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: '8px',
                                borderRadius: '4px'
                            }
                        }}
                    >
                        {params.value.map((substep, index) => (
                            <Typography key={index} sx={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                                {`${index + 1}. ${substep.description}`}
                            </Typography>
                        ))}
                    </Box>
                );
            },
            renderEditCell: (params) => <SubstepEditCell params={params} />
        },
        {
            field: 'notes',
            headerName: 'Notes',
            width: 200,
            editable: true
        }
    ];

    const [ingredientRows, setIngredientRows] = useState(recipeData.r_ingredients);
    const [packagingRows, setPackagingRows] = useState(recipeData.r_packaging)
    const [prepInstructions, setPrepInstructions] = useState(recipeData.prep_instructions || []);
    const [cookingInstructions, setCookingInstructions] = useState(recipeData.cooking_instructions || []);
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
        setCurrPage(<RecipePage loginState={loginState}/>);
    }

    const handleTempUpload = (file, apiEndpoint) => {
        if (!file) {
        return
        }
    
        const reader = new FileReader()
    
        reader.onloadend = () => {
            if (apiEndpoint == 'tempimageupload') {
                setTempImagePath(reader.result)
            }
            else if (apiEndpoint == 'tempcardupload') {
                setTempCardPath(reader.result);
            }
        }
        reader.readAsDataURL(file)
    }

    const handleDeleteRecipeImage = (imgOrCard) => {
        console.log(recipeData.r_num);
        if (recipeData.r_img_path || recipeData.r_card_path) {
            axios({
                method: "DELETE",
                url:process.env.REACT_APP_API_URL + "" + (imgOrCard==='image' ? 'mealrecipe-image' : 'mealrecipe-card') + "/" + recipeData.r_num + '/'
            }).then((response)=>{
                setUpdateDoneSBOpen(true);
                // console.log(imgOrCard, 'delete recipe image success!')
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

    const handleClearTempFiles = () => {
        if (tempImagePath) {
            axios({
                method: "PATCH",
                url:process.env.REACT_APP_API_URL + "" + ('tempimageupload') + '/' + 0 + '/',
                data: {path: tempImagePath}
            }).then((response)=>{
                // console.log(imgOrCard, 'temp image delete success!')
            }).catch((error) => {
            if (error.response) {
                handleErrorMessage(error);
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
            });
        }
        if (tempCardPath) {
            axios({
                method: "PATCH",
                url:process.env.REACT_APP_API_URL + "" + ('tempcardupload') + '/' + 0 + '/',
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
        if (!file) {
            return;
        }
        // Send file in request to api
        const formData = new FormData();
        formData.append('file', file);
        axios({
            method: "PATCH",
            url:process.env.REACT_APP_API_URL + "" + apiEndpoint + "/" + r_num + '/',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            apiEndpoint==='mealrecipe-image' ? setImageFile() : setCardFile();
            setUpdateDoneSBOpen(true);
        }).catch((error) => {
        if (error.response) {
            handleErrorMessage(error);
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
        if (error.response.status === 400) {
            setErrorMessage('Save failed! ' + 'Please check inputs and try again!');
            console.log('error handled');
        }
        else {
            setErrorMessage('Save failed! ' + 'System error. Please try again or contact support');
        }
    }
    useEffect(() => {
        console.log(errorMessage);
        if (errorMessage)
            setErrorSBOpen(true);
    }, [errorMessage])

    const handleSaveClick = () => {
        const r_data = {...recipeData, 
            r_name: nameField.current.value, 
            r_servings: servingField.current.value, 
            r_ingredients: ingredientRows, 
            r_packaging: packagingRows, 
            prep_instructions: prepInstructions, 
            cooking_instructions: cookingInstructions, 
            m_s: m_s
        }
        setUpdateSBOpen(true);

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
                url:process.env.REACT_APP_API_URL + "mealrecipes/",
                data: r_data,
            }).then((response)=>{
                if (imageFile) {
                    handleImageUpload(imageFile, response.data, 'mealrecipe-image');
                }
                if (cardFile) {
                    handleImageUpload(cardFile, response.data, 'mealrecipe-card');
                }
                setUpdateDoneSBOpen(true);
                setCurrPage(<RecipePage loginState={loginState} updateDone={true}/>);
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
                url:process.env.REACT_APP_API_URL + "mealrecipes/" + recipeData.r_num + '/',
                data: r_data,
            }).then((response)=>{
                setUpdateDoneSBOpen(true);
                setCurrPage(<RecipePage loginState={loginState} updateDone={true}/>);
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
    }

    const handleMealSnackChange = (event) => {
        setM_S(event.target.value);
    }

    const RecipeImage = (props) => {
        if (props.image_source) {
            return (
                <Box sx={{position: 'relative'}}>
                    <Button color='lightBlue' variant='contained' sx={{position: 'absolute', right: '0%'}} onClick={() => handleDeleteImageClick('image')}>
                        <HighlightOff/>
                    </Button>
                    <Box sx={{height: '100%', width: '100%'}}>
                        <iframe style={{height: '50vh', width: '30vw'}} src={props.image_source} key={props.image_source}></iframe>
                    </Box>
                </Box>                
            );
        }
        else {
            return (<Typography>Enter a recipe image</Typography>)
        }
    }

    const RecipeCard = (props) => {
        if (props.card_source) {
            return (
                <Box sx={{position: 'relative'}}>
                    <Button color='lightBlue' variant='contained' sx={{position: 'absolute', right: '0%'}} onClick={() => {handleDeleteImageClick('card')}}>
                        <HighlightOff/>
                    </Button>
                    <Box sx={{height: '100%', width: '100%'}}>
                        <iframe style={{height: '50vh', width: '30vw'}} src={props.card_source} key={props.card_source} type='application/pdf'/>
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

                    <TextField label='Recipe Name' required inputProps={{ref: nameField, maxLength: 200}} defaultValue={recipeData.r_name}/>
                    <FormControl>
                        <InputLabel id='mealOrSnackLabel'>Recipe Type</InputLabel>
                        <Select labelID='mealOrSnackLabel' required value={m_s} label={'Recipe Type'} onChange={handleMealSnackChange}>
                            <MenuItem value={undefined} disabled>Select Type</MenuItem>
                            <MenuItem value={1}>Meal</MenuItem>
                            <MenuItem value={0}>Snack</MenuItem>
                            <MenuItem value={2}>Sauce/Dip</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Recipe Serving Amount Field */}
                    <TextField label="Recipe Servings" inputProps={{ref: servingField, maxLength: 100, min: 1}} type="number" defaultValue={recipeData.r_servings}/>

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
                                columns={ingredientsColumns}
                                setRows={setIngredientRows}
                                addFormComponent={RecipeIngForm}
                                addFormProps={{ingredients: ingredientOptions}}
                                keyFieldName={'ri_id'}
                                searchField={'ingredient_name'}
                                entryName={'Recipe Ingredient'}
                            />
                        </Box>
                    </Box>

                    {/* Prep Instructions Table */}
                    <Box>
                        <Typography variant='h6'>Kitchen Preparation Instructions</Typography>
                        <Box sx={{height: '50vh', width: {md: '45vw', sm: '80vw'}}}>
                            <ModularRecipeDatagrid 
                                rows={prepInstructions}
                                columns={prepInstructionsColumns}
                                setRows={setPrepInstructions}
                                addFormComponent={RecipeInstForm}
                                addFormProps={{type: 'Prep'}}
                                keyFieldName={'step_num'}
                                searchField={'description'}
                                entryName={'Prep Instruction'}
                            />
                        </Box>
                    </Box>

                    {/* Cooking Instructions Table */}
                    <Box>
                        <Typography variant='h6'>Home Cooking Instructions</Typography>
                        <Box sx={{height: '50vh', width: {md: '45vw', sm: '80vw'}}}>
                            <ModularRecipeDatagrid
                                rows={cookingInstructions}
                                columns={cookingInstructionsColumns}
                                setRows={setCookingInstructions}
                                addFormComponent={RecipeInstForm}
                                addFormProps={{type: 'Cooking'}}
                                keyFieldName={'step_num'}
                                searchField={'description'} 
                                entryName={'Cooking Instruction'}
                            />
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
                            />
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
                onClose={(event, reason) => {handleSBClose(event, reason, setErrorSBOpen); setErrorMessage()}}
                message={errorMessage}
            />
            </form>
            </Box>
        </Fragment>
        
    )
}