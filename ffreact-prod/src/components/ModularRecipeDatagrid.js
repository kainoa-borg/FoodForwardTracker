import React, {Fragment, useState, useEffect, Suspense, useRef, createRef, useMemo} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem, useGridApiRef, gridSortedRowEntriesSelector, useGridApiContext} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { Button, Popover, Snackbar, Typography } from '@mui/material';

// Modularized Datagrid with prompts/notifications
// Takes:
    // apiEndpoint -- string -- Name of the API endpoint to send requests to (Only supports 1 api endpoint per table)
    // keyFieldName -- string -- Name of the primary key to use in API requests
    // columns -- array -- Array of column definitions for the datagrid
// Returns:
    // Datagrid component with table data
export default function ModularRecipeDatagrid(props) {    
    const apiIP = props.apiIP;
    // const apiEndpoint = props.apiEndpoint;
    const keyFieldName = props.keyFieldName;
    const setRows = props.setRows;
    const columns = [...props.columns, 
        { field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
            getActions: (params) => modularActions(params, rowModesModel, setRowModesModel, setUpdateSBOpen)
        }                     
    ];

    const [tableData, setTableData] = useState(props.rows);

    // Boolean 'request made' message state
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    // Boolean 'request success' message state
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);
    
    // Struct of row modes (view/edit)
    const [rowModesModel, setRowModesModel] = useState({});

    // (PROBLEM AREA) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Somehow call this when new rows are added/deleted/updated (when state changes)
    // => Save rows using the setRows prop function
    const handleStateChange = () => {
        return null; // Stop this broken function from being called for now
        
        // // export state of this data grid using the api reference
        // const rowStates = dataGridApiRef.current.exportState()
        
        // // (assuming state contains a list of objects with a row data (model) field)
        // // create an array of just the row data (model) of each row
        // const allRowData = rowStates.map((state) => state.model);

        // // use setter from parent component to update the state of its data with new row data
        // setRows(allRowData);
    }

    // Helper function closes Snackbar notification
    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    // Generalized Delete Row
    const deleteEntry = (params) => {
        // Open saving changes notification
        // setUpdateSBOpen(true);
        setTableData(tableData.filter((row) => row[keyFieldName] !== params.id));
        // setRows(tableData.filter((row) => row[keyFieldName] !== params.id));
        // updatedRows = updatedRows.map((dataGridRow) => updatedRows[dataGridRow.id, ])

        // axios({
        //     method: "DELETE",
        //     url:"http://4.236.185.213:8000/api/" + apiEndpoint + "/"+params.id+'/',
        //   }).then((response)=>{
        //     getDBData();
        //     // Open saving changes success notification
        //     setUpdateDoneSBOpen(true);
        //   }).catch((error) => {
        //     if (error.response) {
        //       console.log(error.response);
        //       console.log(error.response.status);
        //       console.log(error.response.headers);
        //       }
        //   });
    }

    // Generalized Update Row
    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};
        // console.log(updatedRow);
        
        // axios({
        //     method: "PATCH",
        //     url:"http://4.236.185.213:8000/api/" + apiEndpoint + "/" + newRow[keyFieldName] +'/',
        //     data: newRow
        //     }).then((response)=>{
        //     getDBData();
        //     setUpdateDoneSBOpen(true);
        //     }).catch((error) => {
        //     if (error.response) {
        //         console.log(error.response);
        //         console.log(error.response.status);
        //         console.log(error.response.headers);
        //         }
        // });

        return updatedRow;
    }

    // Get table data from database
    // Set tableData state variable with ingredient data
    const getDBData = () => {
        // axios({
        //     method: "GET",
        //     url:"http://4.236.185.213:8000/api/" + apiEndpoint
        // }).then((response)=>{
        // setTableData(response.data);
        // }).catch((error) => {
        // if (error.response) {
        //     console.log(error.response);
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        //     }
        // });
    }

    // On page load
    // Get table data
    useEffect(() => {
        getDBData();
    }, []);

    // Wait until table data is loaded to render datagrid
    if (tableData === undefined) {
        return (
            <>loading...</>
        )
    }

    const [popoverAnchors, setPopoverAnchors] = useState({confirmDeleteAnchor: null, confirmCancelAnchor: null});

    const handleRowEditStop = (params, event) => {
        console.log(params.reason);
        if (params.reason === 'escapeKeyDown') {event.defaultMuiPrevented = true; setPopoverAnchors({...popoverAnchors, confirmCancelAnchor: event.target})};
    }

    // Takes rowModesModel getter and setter, setUpdateSBOpen ('request sent' message) setter 
    // Returns actions column definition with Popover confirmation prompts
    const modularActions = (params, rowModesModel, setRowModesModel, setUpdateSBOpen) => {
        // Struct with all popover anchors
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
                    <Typography>Delete this entry?</Typography>
                    {/* Confirm button fires deleteIngredient using row params state */}
                    <Button variant='contained' onClick={() => deleteEntry(deleteParams)}>Confirm</Button>
                </Popover>
            ]
        }
    }

    // The HTML structure of this component
    return(
        <div class='table-div'>
        <Box sx={{height: 'auto', overflow: 'auto'}}>
            <DataGrid
            components={{ Toolbar: GridToolbar }}
            rows={tableData}
            columns={columns}
            autoHeight={true}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => {setRowModesModel(newModel)}}
            onRowEditStop={handleRowEditStop}
            onStateChange={handleStateChange}
            getRowId={(row) => row[keyFieldName]}
            pageSize={10}
            processRowUpdate={processRowUpdate}
            //rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableVirtualization
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
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
