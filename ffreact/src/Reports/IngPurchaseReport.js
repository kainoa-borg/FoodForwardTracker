import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid, GridToolbarExport, GridToolbarContainer, GridRowModes, useGridApiContext } from '@mui/x-data-grid'
import { Box, Button, Input, Snackbar, Typography, FormControl, Select, MenuItem} from '@mui/material';
import NewModularSelect from '../components/NewModularSelect';

// Formats data into $0.00 format
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Ingredients Purchasing List Component
export default function IngPurchasingReport() {
    const [suppliers, setSuppliers] = useState(undefined);
    const [ingPurchasing, setIngPurchasing] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        //getDBIngredients();
        getDBSuppliers();
    }, []); 

    const getDBIngPurchaseList = (dateRange) => {
        setSearchingSBOpen(true);
        axios({
          method: "GET",
          url:"http://4.236.185.213:8000/api/ing-purchase-report/",
          params: dateRange
        }).then((response)=>{
          // console.log(response.data);
          if (response.data.length > 0) setResultsFoundSBOpen(true);
          else setNoResultsSBOpen(true);
          setIngPurchasing(response.data);
          console.log(response.data);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
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

  /*  const getDBIngredients = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ingredients-report"
          }).then((response)=>{
            const ingData = response.data
            setIngredients(ingData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    } */

    // Get suppliers from database
    // Set supplier variable with supplier data
  /*  const getDBSuppliers = () => {
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
    } */

    const getRowUnitsData = (params, fieldName) => {
      return params.row.units[params.row.unit_index][fieldName]
    }

    

    const UnitSelect = (params) => {
      let api = useGridApiContext();

      const handleChange = async (event) => {
        await api.current.setRowMode(params.id, GridRowModes.Edit);
        await api.current.setEditCellValue({id: params.id, field: 'unit_index', value: event.target.value});
        await api.current.commitRowChange(params.id);
        await api.current.setRowMode(params.id, GridRowModes.View);
      }

      return (
        params.row.units.length > 1
        ?
        <Select
          style={{width: '100%'}}
          value={params.row.unit_index}
          onChange={handleChange}
        >
          {
            params.row.units.map((unitObj, index) => {
              return (
                <MenuItem value={index}>{unitObj.unit}</MenuItem>
                )
            })
          }
        </Select>
        :
        <p style={{paddingLeft: '1.2 rem'}}>{params.row.units[params.row.unit_index].unit}</p>
      )
    }

    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 250, editable: false },
        { field: 'unit_index', headerName: 'Measure', width: 130, editable: true, 
          renderCell: (params) => <UnitSelect {...params}/>, 
          renderEditCell: (params) => <p>{params.row.units[params.row.unit_index].unit}</p>,
          valueFormatter: (params) => params.api.getRowParams(params.id).row.units[params.value].unit
        },
        { field: 'to_purchase', headerName: 'To Purchase', width: 110, type: 'number', editable: false, valueGetter: (params) => getRowUnitsData(params, 'to_purchase')},
        { field: 'total_required', headerName: 'Total Required', width: 120, type: 'number', valueGetter: (params) => getRowUnitsData(params, 'total_required')},
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 100, type: 'number', editable: false, valueGetter: (params) => getRowUnitsData(params, 'qty_on_hand')},
        { field: 'converted', headerName: 'Converted', width: 120, type: 'boolean', editable: false}
        // { field: 'm_date', headerName: 'Planned Date', width: 150 },
        // { field: 'name', headerName: 'Meal Name', width: 120 }
      //  { field: 'pref_isupplier_id', headerName: 'Preferered Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
    ]

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport 
          csvOptions={{
            fileName: 'Ingredients Purchasing Report',
            delimeter: ';'
            }} />
        </GridToolbarContainer>
      );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getDBIngPurchaseList(dateRange);
    //getDBMealPlanReport(dateRange);
  }

    // The HTML structure of this component
    return (
        <div>
          <br />
          <Typography variant='h5'>Ingredient Purchasing Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Select a date rage. The ingredients required to make all meals and snacks within that time will be calculated below.</Typography><br /><br />
          <form onSubmit={handleSubmit}>
            {/* <Stack direction='row'> */}
              <FormControl sx={{ mr: 3 }}>
                <Typography htmlFor="startDate">Start Date: </Typography>
                <Input id="startDate" variant='outlined' type='date' value={dateRange.startDate} onChange={(event) => {setDateRange({...dateRange, startDate: event.target.value})}}/>
              </FormControl>
              <FormControl>
                <Typography htmlFor="endDate">End Date: </Typography>
                <Input id="endDate" variant='outlined' type='date' value={dateRange.endDate} onChange={(event) => {setDateRange({...dateRange, endDate: event.target.value})}}/>  
              </FormControl>  
            {/* </Stack> */}
            <FormControl sx={{ ml: 5 }}>
              <Button variant='contained' type='submit'>Submit</Button>
            </FormControl>
          </form>
        <Box sx={{height: '80%'}}>
        {/* Show a row for each ingredient in ingredients.*/}
        <DataGrid
          columns={columns}
          rows={ingPurchasing}
          components = {{Toolbar:CustomToolbar}}
          getRowId={(row) => row.id}
          autoHeight = {true}
          editMode={'row'}
          getCellClassName={(params) => {
            if (params.field === "converted" && !(params.row.converted)) {
              return "yellow-row"
            }
          }}
        >
        </DataGrid>
        </Box>
        <Snackbar
            open={searchingSBOpen}
            autoHideDuration={3000}
            onClose={() => setSearchingSBOpen(false)}
            message="Searching..."
          />
          <Snackbar
            open={resultsFoundSBOpen}
            autoHideDuration={3000}
            onClose={() => setResultsFoundSBOpen(false)}
            message="Search Complete!"
          />
          <Snackbar
            open={noResultsSBOpen}
            autoHideDuration={3000}
            onClose={() => setNoResultsSBOpen(false)}
            message="No Results Found."
          />
        </div>
    )
}