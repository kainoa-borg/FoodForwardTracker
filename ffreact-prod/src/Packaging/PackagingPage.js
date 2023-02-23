import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { Button, Popover, Snackbar, Typography } from '@mui/material';
import PackagingForm from './PackagingForm.js'
import './PackagingList.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Packaging List Component
export default function PackagingPage() {
    const [packaging, setPackaging] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [rowModesModel, setRowModesModel] = useState({});
    const [updateSBOpen, setUpdateSBOpen] = useState(false);
    const [updateDoneSBOpen, setUpdateDoneSBOpen] = useState(false);
    const [supplierOptions, setSupplierOptions] = useState();

    const handleSBClose = (event, reason, setOpen) => {
        if (reason === 'clickaway') {
            setOpen(false);
        }
        setOpen(false);
    }

    // Add Packaging from form
    const addPackaging = (pkg) => {
        const lastID = packaging[packaging.length - 1]['p_id'];
        pkg['p_id'] = lastID + 1;
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/packaging-inventory/",
            data: pkg
          }).then((response)=>{
            getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Delete Packaging Row
    const deletePackaging = (key) => {
        const pkgID = packaging[key]['p_id']; 
        axios({
            method: "DELETE",
            url:"http://4.236.185.213:8000/api/packaging-inventory/"+pkgID+'/',
          }).then((response)=>{
            getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Update Packaging Row
    const processRowUpdate = (newRow) => {
        const updatedRow = {...newRow, isNew: false};

        console.log(updatedRow);
        
        axios({
            method: "PATCH",
            url:"http://4.236.185.213:8000/api/packaging-inventory/"+ newRow.p_id +'/',
            data: newRow
            }).then((response)=>{
            getDBPackaging();
            }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                }
        });

        return updatedRow;
    }    

    // Get suppliers from database
    // Set supplier variable with supplier data
    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/suppliers"
          }).then((response)=>{
            setSuppliers(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Get packaging from database
    // Set packaging variable with packaging data    
    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/packaging-inventory"
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

    // On page load
    useEffect(() => {
        getDBPackaging();
        getDBSuppliers();
    }, []);

    // On suppliers set
    useEffect(() => {
        if (suppliers)
            setSupplierOptions(suppliers.map((supplier) => {return {value: supplier.s_id, label: supplier.s_name}}));
    }, [suppliers])

    useEffect(() => {
        // console.log('SUPPLIER OPTIONS ===> ' + supplierOptions);
    }, [supplierOptions])

    if (packaging === undefined || suppliers === undefined) {
        return (
            <>loading...</>
        )
    }

    const modularActions = (params, rowModesModel, setRowModesModel, setUpdateSBOpen) => {
        // Struct with all popover anchors
        const [popoverAnchors, setPopoverAnchors] = useState({confirmDeleteAnchor: null, confirmCancelAnchor: null});
        const [deleteParams, setDeleteParams] = useState(null);
        let isInEditMode = false;
        if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;

        const handleEditClick = (params) => {
            setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.Edit}});
        }
        const handleSaveClick = (params) => {
            setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View}})
            setUpdateSBOpen(true);
        }
        const handleCancelClick = (event, params) => {
            setPopoverAnchors({...popoverAnchors, confirmCancelAnchor: event.currentTarget})
        }
        const handleDeleteClick = (event, params) => {
            // Set the confirmDeleteAnchor in popoverAnchors to the delete button
            setPopoverAnchors({...popoverAnchors, confirmDeleteAnchor: event.currentTarget});
            // Save the params as state variable
            setDeleteParams(params);
        }
    
    
        // confirmDeleteOpen flag/id
        const confirmDeleteOpen = Boolean(popoverAnchors.confirmDeleteAnchor);
        const confirmDeleteID = confirmDeleteOpen ? 'simple-popover' : undefined;
        
        // confirmCancelOpen flag/id
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
                <GridActionsCellItem aria-describedby={confirmDeleteID} icon={<Delete/>} onClick={(event) => {handleDeleteClick(event, params); setPopoverAnchors({...popoverAnchors, confirmDeleteAnchor: null})}} color="darkBlue"/>,
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
                    {/* Confirm button fires deletePackaging using row params state */}
                    <Button variant='contained' onClick={() => deletePackaging(deleteParams)}>Confirm</Button>
                </Popover>
            ]
        }
    }

    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
        { field: 'unit', headerName: 'Unit', width: 6, editable: true },
        { field: 'qty_holds', headerName: 'Size', width: 5, editable: true },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean', editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },
        { field: 'pref_psupplier', headerName: 'Supplier', width: 80, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
        { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true },
        { field: 'actions', type: 'actions', width: 100,
            getActions: (params) => modularActions(params, rowModesModel, setRowModesModel, setUpdateSBOpen)
        }
    ]
    
    return(
        <div class='table-div'>
        <h3>Packaging</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            components={{ Toolbar: GridToolbar }}
            rows={packaging} 
            columns={columns} 
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => {setRowModesModel(newModel)}}
            getRowId={(row) => row.p_id}
            pageSize={10}
            processRowUpdate={processRowUpdate}
            //rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
            <PackagingForm addPackaging={addPackaging} suppliers={suppliers}></PackagingForm>
        {/* Save Click Notice */}
        <Snackbar
            open={updateSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateSBOpen)}
            message="Saving..."
        />
        {/* Save Complete Notice */}
        <Snackbar
            open={updateDoneSBOpen}
            autoHideDuration={3000}
            onClose={(event, reason) => handleSBClose(event, reason, setUpdateDoneSBOpen)}
            message="Changes saved!"
        />
        {/* Add entry notice */}
        </div>
    )
}
