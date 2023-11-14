import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@mui/system';
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import CellDialog from '../components/CellDialog.js'
import { Button, Card, Grid, Input, InputLabel, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';

const PkgSizeTable = (props) => {
    // If props.updateEditForm is set => editable
    const editable = props.updateEditForm != undefined;
    const [pkgSizes, setPkgSizes] = useState(props.pkg_sizes);
    const [currSize, setCurrSize] = useState({pkg_size: '', pkg_holds: 0});

    const handleKeyUnitChange = (event) => {
        const key = event.target.getAttribute('dataKey');
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        let newUnit = {...pkgSizes[key]};
        newUnit[fieldName] = fieldValue;
        let newIngUnits = [...pkgSizes];
        newIngUnits[key] = newUnit;
        setPkgSizes(newIngUnits);
        props.updateEditForm('pkg_sizes', newIngUnits);
      }
  
      const handleUnitChange = (event) => {
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newUnit = {...currSize};
        newUnit[fieldName] = fieldValue;
        setCurrSize(newUnit);
      }
  
      const handleAddUnit = (event) => {
        event.preventDefault();
        const newUnits = [...pkgSizes, currSize];
        setPkgSizes(newUnits);
        setCurrSize({pkg_size: '', pkg_holds: 0});
        props.updateEditForm('pkg_sizes', newUnits);
      }
  
      const handleDeleteUnit = (thisKey) => {
          const newUnits = [...pkgSizes];
          newUnits.splice(thisKey, 1);
          setPkgSizes(newUnits);
          props.updateEditForm('pkg_sizes', newUnits);
      }

    return (
        <TableContainer component={Paper}>
            <Table>
              <TableHead>
                  <TableCell>Pkg Size</TableCell>
                  <TableCell>Cups Held</TableCell>
              </TableHead>
              {pkgSizes.map((size, thisKey) => {
          return (
              <TableRow key={thisKey}>
                  <TableCell>
                    {editable ? <Input inputProps={{dataKey:thisKey}} name="pkg_size" type="text" value={String(size.pkg_size)} onChange={handleKeyUnitChange}/>
                              : <Typography>{size.pkg_size}</Typography>}
                  </TableCell>
                  <TableCell>
                    {editable ? <Input inputProps={{dataKey:thisKey}} name="pkg_holds" type='number' value={size.pkg_holds} onChange={handleKeyUnitChange}/>
                              : <Typography>{size.pkg_holds}</Typography>}
                  </TableCell>
                  {editable ? <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUnit(thisKey)}>Delete</Button></TableCell> : <></>}
              </TableRow>
              )
              })
          }
              <TableRow>
                {editable ? <TableCell><Input name="pkg_size" type="text" placeholder="XS, S, M, L" value={String(currSize.pkg_size)} onChange={handleUnitChange}/></TableCell> : <></>}
                {editable ? <TableCell><Input name="pkg_holds" type='number' placeholder="0.00" value={currSize.pkg_holds} onChange={handleUnitChange}/></TableCell> : <></>}
                {editable ? <TableCell><Button color='lightBlue' variant='contained' onClick={handleAddUnit}>Add</Button></TableCell> : <></>}
              </TableRow>
            </Table>
          </TableContainer>
    )
}

const PkgTypeForm = (props) => {
  // Structs
  const addEntry = props.addEntry;
  const handleClose = props.handleClose;

  // Clear Size Form data between uses.
  const clearPkgType = () => {
        return {
        pkg_type: "",
    }
  }
  // The state of this Size Form with each attribute of Size
   const [pkgType, setPkgType] = useState(clearPkgType());

  // Handle form submission (prevent refresh, pass pkgType to addPkgSize, and clear form state)
  // Takes submit event information (form submission)
  // Returns none
  const handleSubmit = (event) => {
    // Prevent refresh
    event.preventDefault();
    // Pass pkgType object to SizeList callback
    // props.addSize(pkgType)
    addEntry(pkgType);
    handleClose();
    // Clear the form state
    setPkgType(clearPkgType());
  }

  // Updates field values before the new data is sent to be saved in the database
  const updateEditForm = (names, values) => {
    const newType = {...pkgType};
    for (let i = 0; i < names.length; i++) {
      newType[names[i]] = values[i];
    }
    setPkgType(newType);
  }

  // Handle the data inputted to each form input and set the state with the new values
  // General solution, input verification is tricky with this implementation
  // Takes input change event information (name, type, and value)
  // Returns None
  const handleFormChange = (event) => {
    // Get the name and value of the changed field
    const fieldName = event.target.name;
    const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    // Create new pkgType object before setting state
    updateEditForm([fieldName], [fieldValue]);
    // updateEditForm('aFlag', true);
  }

  // HTML structure of this component
  // Returns the popup view of the Add Size Form
  return (
    <form onSubmit={handleSubmit}>
        {/* Basic pkgType info */}
        <Card sx={{marginTop: '1em', padding: '1em'}}>
          <Typography variant='h5'>Add Packaging Type</Typography>
          <Typography component='h6' variant='h6'>Required * </Typography>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              <InputLabel htmlFor="pkg_size">Pkg Type*: </InputLabel>
              <Input name="pkg_type" value={pkgType.pkg_type} required onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
            </Grid>
          </Grid>
        </Card>
    </form>
  );
}

// Packaging List Component
export default function PackagingDefinitionPage(props) {
    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};

    // Structs
    const [packagingDefs, setPackagingDefs] = useState([]);

    if (packagingDefs === undefined) {
        return (
            <>loading...</>
        )
    }
    
    // Columns and formatting to be sent to DataGrid 
    let columns = [
        { field: 'pkg_type', headerName: 'Package Type', width: 300, editable: true },
        { field: 'pkg_sizes', headerName: 'Sizes', width: 300, editable: true,
            renderCell: (params) => {
                if (params.value && params.value.length > 0)
                    return <div style={{margin: 'auto'}}><CellDialog buttonText={'View Sizes'} dialogTitle={'Pkg Sizes'} component={<PkgSizeTable pkg_sizes={params.value}/>}/></div>
                else 
                    return <div style={{margin: 'auto'}}><Typography variant='p'>No Sizes</Typography></div>
            },
            renderEditCell: (params) => {
                const api = useGridApiContext();
                const updateCellValue = (fieldName, newValue) => {
                    const {id, field} = params;
                    api.current.setEditCellValue({id, field, value: newValue, debounceMs: 200})
                }
                return <div style={{margin: 'auto'}}><CellDialog buttonText={'Edit Sizes'} dialogTitle={'Edit Sizes'} component={<PkgSizeTable pkg_sizes={params.value} updateEditForm={updateCellValue}/>}/></div>
            },
        },
    ]

    // Page view; calls NewModularDataGrid
    return(
        <div className='table-div'>
        <Typography id='page-header' variant='h5'>Packaging Definitions</Typography>
            <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
            loginState={loginState}
            rows={packagingDefs}
            columns={columns}
            apiEndpoint='packaging-type-definitions'
            // apiIP='localhost'
            keyFieldName='pkg_type_id'
            entryName='Packaging Definitions'
            searchField='pkg_type'
            searchLabel='Packaging Types'
            AddFormComponent={PkgTypeForm}
            >
            </NewModularDatagrid>
        </Box>
        {/* Add entry notice */}
        </div>
    )
}
