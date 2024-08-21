import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import {DataGrid, GridRowModes, GridActionsCellItem, GridToolbarContainer} from '@mui/x-data-grid' //GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport,
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import Recipe from './Recipe.js'
import { Button, Popover, Snackbar, Stack, Typography } from '@mui/material';
import { Outlet, Routes, Route, useNavigate } from 'react-router-dom';
import SearchToolBar from '../components/SearchToolBar.js';

export default function RecipePage(props) {
    const [currPage, setCurrPage] = useState();

    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};
    const handlePageClick = props.handlePageClick;        

    // Set the currPage to RecipePageComponent with necessary props
    useEffect(() => {
        setCurrPage(<RecipePageComponent loginState={loginState} handlePageClick={handlePageClick} setCurrPage={setCurrPage}/>)
    }, [loginState])

    return (
        <div>
            {currPage}
        </div>
    )
}

function RecipePageComponent(props) {
    const navigate = useNavigate();

    const loginState = props.loginState;


    const [addRecipeData, setAddRecipeData] = useState({
        "r_num": "",
        "r_name": "",
        "r_ingredients": [],
        "r_packaging": [],
        "r_diets": [],
        "r_instructions": [],
        "r_allergies": [],
        "m_s": 0
    });

    const [recipes, setRecipes] = useState();
    const [recipeData, setRecipeData] = useState();
    const [recipeEditID, setRecipeEditID] = useState();
    const [filterModel, setFilterModel] = useState();
    const setCurrPage = props.setCurrPage;

    const getDBRecipes = () => {
        console.log('request')
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "recipe-list"
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

    const [ingredients, setIngredients] = useState();
    const getDBIngredients = () => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "ing-name-definitions"
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

    const [packaging, setPackaging] = useState();
    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "packaging-inventory"
        }).then((response)=>{
            setPackaging(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    useEffect(() => {
        getDBIngredients();
        getDBPackaging();
    }, [])

    const getDBRecipeData = (pk) => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "mealrecipes/" + pk + '/'
        }).then((response)=>{
        // setRecipeData(response.data);
        setCurrPage(<Recipe
            loginState={loginState}
            recipeData={response.data} 
            setRecipeData={setRecipeData} 
            getDBRecipeData={getDBRecipeData} 
            setCurrPage={setCurrPage}
            ingredientOptions={ingredients}
            packagingOptions={packaging}
            ></Recipe>);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const deleteEntry = (params) => {
        // Open saving changes notification
        setUpdateSBOpen(true);

        axios({
            method: "DELETE",
            url:process.env.REACT_APP_API_URL + "mealrecipes/"+params.id+'/',
        }).then((response)=>{
            // Open saving changes success notification
            setUpdateDoneSBOpen(true);
        }).catch((error) => {
            if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });

        axios({
            method: "DELETE",
            url:process.env.REACT_APP_API_URL + "mealrecipe-image/"+params.id+'/',
        }).then((response)=>{
            // Open saving changes success notification
            setUpdateDoneSBOpen(true);
        }).catch((error) => {
            if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });

        axios({
            method: "DELETE",
            url:process.env.REACT_APP_API_URL + "mealrecipe-card/"+params.id+'/',
        }).then((response)=>{
            getDBRecipes();
            // Open saving changes success notification
            setUpdateDoneSBOpen(true);
        }).catch((error) => {
            if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    // Boolean 'request made' message state
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    // Boolean 'request success' message state
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);
    
    // Struct of row modes (view/edit)
    const [rowModesModel, setRowModesModel] = useState({});

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    useEffect(() => {
        if (props.updateDone) {
            setUpdateDoneSBOpen(true);
        }
    }, [props.updateDone])

    useEffect(() => {
        getDBRecipes();
    }, [])

    const columns = [
        {
            field: 'r_name', headerName: 'Recipe Name', width: 300, editable: false
        },
        {
            field: 'm_s', headerName: 'Meal/Snack', width: 150, editable: false, valueFormatter: (params) => {return params.value===1 ? 'Meal' : 'Snack'}
        },
        loginState.isAuthenticated ?
        { field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
            getActions: (params) => modularActions(params, rowModesModel, setRowModesModel, setUpdateSBOpen)
        }
        :
        {}
    ]

    const modularActions = (params, rowModesModel, setRowModesModel, setUpdateSBOpen) => {
        // Struct with all popover anchors
        const [popoverAnchors, setPopoverAnchors] = useState({confirmDeleteAnchor: null, confirmCancelAnchor: null});
        // Control state of row data to be deleted
        const [deleteParams, setDeleteParams] = useState(null);
        let isInEditMode = false;
        if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;

        // Set this row to edit mode
        // const handleEditClick = (params) => {
        //     setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.Edit}});
        // }

        // Set this row to view mode
        // Open 'request sent' snackbar
        const handleSaveClick = (params) => {
            setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View}})
            setUpdateSBOpen(true);
        }

        // Open 'confirm cancel' popover on the Cancel button
        const handleCancelClick = (event, params) => {
            setPopoverAnchors({...popoverAnchors, confirmCancelAnchor: event.currentTarget})
        }

        // Open 'confirm delete' popover on the Delete button
        // Save the params as state variable for the actual delete function
        const handleDeleteClick = (event, params) => {
            setPopoverAnchors({...popoverAnchors, confirmDeleteAnchor: event.currentTarget});
            setDeleteParams(params);
        }
    
    
        // confirmDeleteOpen flag/id
        // "Open the Delete prompt if the anchor is set"
        const confirmDeleteOpen = Boolean(popoverAnchors.confirmDeleteAnchor);
        const confirmDeleteID = confirmDeleteOpen ? 'simple-popover' : undefined;
        
        // confirmCancelOpen flag/id
        // "Open the Cancel prompt if the anchor is set"
        const confirmCancelOpen = Boolean(popoverAnchors.confirmCancelAnchor);
        const confirmCancelID = confirmCancelOpen ? 'simple-popover' : undefined;

        // Show Edit Actions
        if (isInEditMode) {
            return [
                <GridActionsCellItem icon={<Save/>} onClick={() => {handleSaveClick(params)}} color="darkBlue"/>,
                <GridActionsCellItem icon={<Cancel/>} onClick={(event) => {handleCancelClick(event, params)}} color="darkBlue"/>,
                <Popover
                    id={confirmCancelID}
                    open={confirmCancelOpen}
                    anchorEl={popoverAnchors.confirmCancelAnchor}
                    onClose={() => setPopoverAnchors({...popoverAnchors, confirmCancelAnchor: null})}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography>Canceling will revert all changes</Typography>
                    <Button variant='contained' onClick={() => {setPopoverAnchors({...popoverAnchors, confirmCancelAnchor: null}); setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View, ignoreModifications: true}});}}>Confirm</Button>
                </Popover>
            ];
        }
        // Show View Actions
        else {
            return [
                // <GridActionsCellItem icon={<Edit/>} onClick={() => handleEditClick(params)} color="darkBlue"/>,
                <GridActionsCellItem aria-describedby={confirmDeleteID} icon={<Edit/>} onClick={(event) => {handleEditRecipeClick(event, params)}} color="darkBlue"/>,
                <GridActionsCellItem aria-describedby={confirmDeleteID} icon={<Delete/>} onClick={(event) => {handleDeleteClick(event, params)}} color="darkBlue"/>,
                <Popover
                    id={confirmDeleteID}
                    open={confirmDeleteOpen}
                    anchorEl={popoverAnchors.confirmDeleteAnchor}
                    onClose={() => setPopoverAnchors({...popoverAnchors, confirmDeleteAnchor: null})}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography onClick={() => console.log(deleteParams)}>Delete this entry?</Typography>
                    {/* Confirm button fires deleteIngredient using row params state */}
                    <Button variant='contained' onClick={() => deleteEntry(deleteParams)}>Confirm</Button>
                </Popover>
            ]
        }
    }

    // Navigate when either addRecipeElement or recipeDetailElement is defined
    useEffect(() => {
        handleNavigate();
    }, [props.recipeDetailElement, props.addRecipeElement])
    
    const handleNavigate = () => {
        if (props.addRecipeElement) {
            navigate('add-recipe');
        }
        if (props.recipeDetailElement) {
            navigate('edit-recipe');
        }
    }

    // Only load the recipe list if necessary data has been fetched
    if (recipes === undefined || ingredients === undefined || packaging === undefined) {
        return (
            <>loading...</>
        )
    }

    // Get recipe details for this recipe, stop rendering the recipe list
    const handleEditRecipeClick = (event, params) => {
        getDBRecipeData(params.row.r_num);
        setRecipeEditID(params.row.r_num);
        return (
            <>loading...</>
        );
        // setCurrPage(<Recipe recipeData={recipeData}></Recipe>)
    }

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            { loginState.isAuthenticated ?
            <Button 
                color='lightBlue' 
                variant='contained' 
                onClick={() => {
                    setCurrPage(
                    <Recipe 
                        isAdding
                        loginState={loginState} 
                        recipeData={addRecipeData} 
                        setRecipeData={setAddRecipeData} 
                        setCurrPage={setCurrPage} 
                        ingredientOptions={ingredients}
                        packagingOptions={packaging}>
                    </Recipe>)}}
                >Add Recipe
            </Button>
            :
            <></>
            }
          </GridToolbarContainer>
        );
    }

    return(
        <Fragment>
            <Typography id='page-header' variant='h5'>Recipes</Typography>
            <Stack>
                <SearchToolBar setFilterModel={setFilterModel} searchField={'r_name'} searchLabel={'Recipes'}/>
            </Stack>
            <Box sx={{height: '80vh'}}>
                <DataGrid
                components={{Toolbar: CustomToolbar}}
                // onRowClick={handleRowClick}
                rows={recipes}
                columns={columns}
                filterModel={filterModel}
                rowModesModel={rowModesModel} 
                getRowId={(row) => row.r_num}>
                </DataGrid>
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
            </Box>
        </Fragment>
        
    )
}