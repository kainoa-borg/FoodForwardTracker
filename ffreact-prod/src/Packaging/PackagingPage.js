import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams, GridActionsCell, GridRowModes, GridActionsCellItem} from '@mui/x-data-grid'
import {Cancel, Delete, Edit, Save} from '@mui/icons-material'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import PackagingForm from './PackagingForm.js'
import EditablePackagingRow from './EditablePackagingRow.js'
import PackagingRow from './PackagingRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
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
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);
    const [editPackagingID, setEditPackagingID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        p_id: '',
        package_type: "",
        unit_qty: '',
        qty_holds: '',
        unit: "",
        returnable: '',
        in_date: '',
        in_qty: '',
        packaging_usage: [],
        qty_on_hand: '',
        unit_cost: '',
        flat_fee: '',
        psupplier_id: '',
        pref_psupplier_id: ''
    });

    useEffect(() => {
        getDBPackaging();
        getDBSuppliers();
    }, []);

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

    const postDBPackaging = () => {
        axios({
            method: "POST",
            url:"/packaging/",
            data: packaging
          }).then((response)=>{
            getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
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

    const handleEditClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.Edit}});
    }
    const handleSaveClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View}})
    }
    const handleCancelClick = (params) => {
        setRowModesModel({...rowModesModel, [params.id]: {mode: GridRowModes.View, ignoreModifications: true}});
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
            getActions: (params) => {
                let isInEditMode = false;
                if (rowModesModel[params.id]) isInEditMode = rowModesModel[params.id].mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<Save/>} onClick={() => {handleSaveClick(params)}}/>,
                        <GridActionsCellItem icon={<Cancel/>} onClick={() => {handleCancelClick(params)}}/>
                    ];
                }
                else {
                    return [
                        <GridActionsCellItem icon={<Edit/>} onClick={() => handleEditClick(params)} color="inherit"/>,
                        <GridActionsCellItem icon={<Delete/>} onClick={() => deletePackaging(params)}/>
                    ]
                }
            }
        }
    ]

    const handleRowClick = (params) => {
        getDBPackaging(params.row.p_id);
        wait(300);
        console.log(packaging);
    }

    if (packaging === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    
    return(
        <div class='table-div'>
        <h3>Packaging</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick} 
            rows={packaging} 
            columns={columns} 
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => {setRowModesModel(newModel)}}
            getRowId={(row) => row.p_id}
            pageSize={10}
            processRowUpdate={processRowUpdate}
            //rowsPerPageOptions={[5]}
            //checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
            <PackagingForm addPackaging={addPackaging} suppliers={suppliers}></PackagingForm>
            <button onClick={postDBPackaging}>Submit Changes</button>
        </div>
    )
}
