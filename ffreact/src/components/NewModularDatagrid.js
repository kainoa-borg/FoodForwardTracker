import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import {DataGrid, GridRowModes, GridActionsCellItem, GridToolbarContainer} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/material';
import { Button, Popover, Snackbar, Stack, Typography } from '@mui/material';

import FormDialog from './FormDialog.js'
import SearchToolBar from './SearchToolBar.js'

// Modularized Datagrid with prompts/notifications
// Takes:
    // apiEndpoint -- string -- Name of the API endpoint to send requests to (Only supports 1 api endpoint per table)
    // keyFieldName -- string -- Name of the primary key to use in API requests
    // columns -- array -- Array of column definitions for the datagrid
// Returns:
    // Datagrid component with table data
export default function NewModularDatagrid(props) {
    
    // const apiIP = props.apiIP;
    // Name of the api endpoint to send requests to
    const apiEndpoint = props.apiEndpoint;
    // IP of the api to send requests to
    var apiIP = props.apiIP;
    // If apiIP prop not defined, default to server 
    if (!apiIP) apiIP = process.env.REACT_APP_API_URL;
    // Field name of the row key/id
    const keyFieldName = props.keyFieldName;
    // Add entry form to be passed to FormDialog
    const AddFormComponent = props.AddFormComponent;
    const addFormProps = props.addFormProps;

    const searchField = props.searchField;
    const searchLabel = props.searchLabel;
    const loginState = props.loginState;

    // Entry Name
    const entryName = props.entryName;

    // Append passed columns with default actions
    const columns = [...props.columns, loginState.isAuthenticated ?
        { field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
            getActions: (params) => modularActions(params, rowModesModel, setRowModesModel, setUpdateSBOpen)
        } :
        {}
    ];

    const columnGroupingModel = props.columnGroupingModel;
    
    // Row data of the table
    const [tableData, setTableData] = useState([]);

    // Boolean 'request made' message state
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    // Boolean 'request success' message state
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);
    // Boolean error popup state
    const [errorSBOpen, setErrorSBOpen] = useState(false);
    // Error message state
    const [errorMessage, setErrorMessage] = useState();
    
    // Struct of row modes (view/edit)
    const [rowModesModel, setRowModesModel] = useState({});

    // Struct of filterModel items (How to filter datagrid)
    const [filterModel, setFilterModel] = useState();

    // Open state of the Add form popup
    const [addFormOpen, setAddFormOpen] = useState(false);

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    // Helper function gets the latest key value of the table
    const getLatestKey = () => {
        return Math.max(...tableData.map(row => row[keyFieldName])) // Get the max id of all rows
    }

    // Generalized Add Row
    const addEntry = (formData) => {
        // console.log(formData);
        // If a form doesn't take the latest key, it should be added for the datagrid
        // console.log(formData);
        if (!formData[keyFieldName])
            formData[keyFieldName] = getLatestKey() + 1;
        // console.log(formData);
        let addStatus = false;
        axios({
            method: 'POST',
            url:apiIP + apiEndpoint + '/',
            data: formData
        }).then((response)=>{
            getDBData();
            // Open saving changes success notification
            setUpdateDoneSBOpen(true);
            setAddFormOpen(false);
          }).catch((error) => {
            handleErrorMessage("Save Failed!", error)
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          });
    }

    // Generalized Delete Row
    const deleteEntry = (params) => {
        // Open saving changes notification
        setUpdateSBOpen(true);
        
        axios({
            method: "DELETE",
            url:apiIP+ apiEndpoint + "/"+params.id+'/',
          }).then((response)=>{
            getDBData();
            // Open saving changes success notification
            setUpdateDoneSBOpen(true);
          }).catch((error) => {
            handleErrorMessage("Save Failed!", error)
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Generalized Update Row
    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false}; 
        
        // console.log(newRow);

        axios({
            method: "PATCH",
            url:apiIP + apiEndpoint + "/" + newRow[keyFieldName] +'/',
            data: newRow
            }).then((response)=>{
            getDBData();
            setUpdateDoneSBOpen(true);
            }).catch((error) => {
            if (error.response) {
                handleErrorMessage("Save Failed!", error)
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
        });

        return updatedRow;
    }

    // Get table data from database
    // Set tableData state variable with ingredient data
    const getDBData = () => {
        // console.log('REFRESHING')
        axios({
            method: "GET",
            url:apiIP + apiEndpoint
        }).then((response)=>{
            // console.log(response.data);
            setTableData(response.data);
        }).catch((error) => {
        if (error.response) {
            handleErrorMessage("Couldn't get data.", error)
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    // On page load
    // Get table data
    useEffect(() => {
        getDBData();
    }, []);

    const handleErrorMessage = (message, error) => {
        if (error.response.status === 400) {
            if (error.response.data['errorText']) {
                setErrorMessage(message + ' ' + error.response.data['errorText'])
            }
            else {
                setErrorMessage(message + ' Please check inputs and try again.');
            }
        }
        else if (error.response.status === 500) {
            setErrorMessage(message + ' System error. Please try again or contact support');
        }
        else {
            setErrorMessage(message + ' ' + error.response.status + ' ' + error.response.statusText);
        }
    }
    useEffect(() => {
        if (errorMessage)
            setErrorSBOpen(true);
    }, [errorMessage])

    useEffect(() => {
        // If the error message popup was just open, but also just closed
        if (errorMessage && errorSBOpen === false) {
            getDBData();
            // setErrorMessage();
        }
    }, [errorSBOpen])

    // Wait until table data is loaded to render datagrid
    if (tableData === undefined) {
        return (
            <>loading...</>
        )
    }

    // const [popoverAnchors, setPopoverAnchors] = useState({confirmDeleteAnchor: null, confirmCancelAnchor: null});

    // const handleRowEditStop = (params, event) => {
    //     // console.log(params.reason);
    //     // console.log(event);
    //     if (params.reason === 'escapeKeyDown') {event.defaultMuiPrevented = true; setPopoverAnchors({confirmDeleteAnchor: null, confirmCancelAnchor: event.target})};
    // }

    // Takes rowModesModel getter and setter, setUpdateSBOpen ('request sent' message) setter 
    // Returns actions column definition with Popover confirmation prompts
    const modularActions = (params, rowModesModel, setRowModesModel, setUpdateSBOpen) => {
        // Struct with all popover anchors
        const [popoverAnchors, setPopoverAnchors] = useState({confirmDeleteAnchor: null, confirmCancelAnchor: null});
        // Control state of row data to be deleted
        const [deleteParams, setDeleteParams] = useState(null);
        let isInEditMode = false;
        if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;

        // Set this row to edit mode
        const handleEditClick = (params) => {
            setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.Edit}});
        }

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
                <GridActionsCellItem icon={<Edit/>} onClick={() => handleEditClick(params)} color="darkBlue"/>,
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
                    <Typography onClick={(params) => {console.log(deleteParams)}}>Delete this entry?</Typography>
                    {/* Confirm button fires deleteIngredient using row params state */}
                    <Button variant='contained' onClick={() => deleteEntry(deleteParams)}>Confirm</Button>
                </Popover>

            ]
        }
    }

    function CustomToolbar() {
        const e_name = entryName ? entryName : 'Entry'
        return (
          <GridToolbarContainer>
            {
                loginState.isAuthenticated 
                ?
                <Button color='lightBlue' variant='contained' onClick={() => {setAddFormOpen(true)}}>Add {e_name}</Button>
                :
                <></>
            }
            {/* <GridToolbarExport color='lightBlue'/> */}
          </GridToolbarContainer>
        );
    }
    
    if (tableData === undefined) {
        return (
            <>loading...</>
        )
    }

    // The HTML structure of this component
    return(
        <Fragment>
            <Stack direction='row' sx={{width: '100%'}}>
                {searchField ? <SearchToolBar setFilterModel={setFilterModel} searchField={searchField} searchLabel={searchLabel}/> : <></>}
            </Stack>
            <Box sx={{display: 'flex', height: '100%'}}>
                <Box sx={{flexGrow: 1}}>
                    <DataGrid
                    components={{ Toolbar: CustomToolbar}}
                    rows={tableData}
                    columns={columns}
                    // autoHeight={true}
                    editMode='row'
                    rowModesModel={rowModesModel}
                    filterModel={filterModel}
                    onRowModesModelChange={(newModel) => {setRowModesModel(newModel)}}
                    // onRowEditStop={handleRowEditStop}
                    getRowId={(row) => row[keyFieldName]}
                    pageSize={10}
                    processRowUpdate={processRowUpdate}
                    onRowEditStop={
                        (params, event) => {
                            if (params.reason === 'escapeKeyDown' || params.reason === 'enterKeyDown') {
                                event.defaultMuiPrevented = true;
                            }
                        }
                    }
                    //rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    // disableVirtualization
                    experimentalFeatures={{ newEditingApi: true , columnGrouping: true }}
                    columnGroupingModel={columnGroupingModel}>
                    </DataGrid>
                </Box>
                {/* Add Form Dialog */}
                <FormDialog open={addFormOpen} setOpen={setAddFormOpen} AddFormComponent={AddFormComponent} addFormProps={addFormProps} addEntry={addEntry} latestKey={getLatestKey()}/>
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
            </Box>
        </Fragment>
        
    )
}