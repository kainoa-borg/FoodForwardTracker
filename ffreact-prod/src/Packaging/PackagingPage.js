import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
//import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './PackagingList.css'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {GridRowModes, DataGridPro, GridToolbarContainer, GridActionsCellItem} from '@mui/x-data-grid-pro';
//import {randomCreatedDate, randomTraderName, randomUpdatedDate, randomId} from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;
  
    const handleClick = () => {
      setRows((oldRows) => [...oldRows, { p_id, name: '', unit: '', qty_holds: '', returnable: '', 
      unit_cost: '', pref_psupplier: '', in_date: '', in_qty: '', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [p_id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }
  
  EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
  };

// Packaging List Component
export default function PackagingPage() {
    
    const [packaging, setPackaging] = useState([]);
    const [rows, setRows] = React.useState(packaging);
    const [rowModesModel, setRowModesModel] = React.useState({});
  
    const handleRowEditStart = (params, event) => {
      event.defaultMuiPrevented = true;
    };
  
    const handleRowEditStop = (params, event) => {
      event.defaultMuiPrevented = true;
    };
  
    const handleEditClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    const handleSaveClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    const handleDeleteClick = (id) => () => {
      setRows(rows.filter((row) => row.id !== id));
    };
  
    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };
  
    const processRowUpdate = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };

    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150 },
        { field: 'unit', headerName: 'Unit', width: 90 },
        { field: 'qty_holds', headerName: 'Size', width: 50 },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean' },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_psupplier', headerName: 'Supplier', width: 180, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date' },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140 },
        { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
        { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true }
    ]

    useEffect(() => {
        getDBPackaging();
    }, []);

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
        <Box sx={{height: '80vh',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        }}>
            <DataGrid 
            components={{ Toolbar: /*GridToolbar,*/ EditToolbar }}
            onRowClick={handleRowClick} 
            rows={packaging} 
            columns={columns} 
            getRowId={(row) => row.p_id}
            pageSize={10}
            //rowsPerPageOptions={[7]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            componentsProps={{toolbar: { setRows, setRowModesModel },}}
            />
        </Box>
        </div>
    )
}
