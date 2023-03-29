import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReusableTable from '../ReusableTable.js'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Input, InputLabel, Snackbar, Typography, Stack, FormControl} from '@mui/material';

// Packaging List Component
export default function MealPlanReport() {
    const [costTotals, setCostTotals] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState(undefined);
  
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const getCostTotalsList = (dateRange) => {
      axios({
          method: "GET",
          url:"http://4.236.185.213:8000/api/costtotals/",
          params: dateRange
        }).then((response)=>{
          if (response.data.length > 0) setResultsFoundSBOpen(true);
          else setNoResultsSBOpen(true);
          const costData = response.data
          setCostTotals(costData);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }
  
    const getDBIngredients = (dateRange) => {
      axios({
          method: "GET",
          url:"http://4.236.185.213:8000/api/ingredients",
          params: dateRange
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

    const columns = [
      { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
      { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
      { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
      { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
      { field: 'pref_isupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
//      { field: 'total', headerName: 'Total', width: 90, editable: true },
      { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
    ]

    if (ingredients === undefined) {
      return (<>loading</>);
    }

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport
            csvOptions={{
                fileName: 'Cost Totals Report',
                delimeter: ';'
            }} />
        </GridToolbarContainer>
      );
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      getCostTotalsList(dateRange);
      getDBIngredients();
      getDBSuppliers();
    }

    // The HTML structure of this component
    return (
        <div>
          <Typography variant='h5'>Cost Total Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Select date range to calculate the total costs from start date to end date.</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Only completed purchases are included, future totals do not project estimated costs.</Typography>
          
          <form onSubmit={handleSubmit}>
            {/* <Stack direction='row'> */}
              <FormControl>
                <Typography htmlFor="startDate">Start Date: </Typography>
                <Input id="startDate" variant='outlined' type='date' value={dateRange.startDate} onChange={(event) => {setDateRange({...dateRange, startDate: event.target.value})}}/>
              </FormControl>
              <FormControl>
                <Typography htmlFor="endDate">End Date: </Typography>
                <Input id="endDate" variant='outlined' type='date' value={dateRange.endDate} onChange={(event) => {setDateRange({...dateRange, endDate: event.target.value})}}/>  
              </FormControl>  
            {/* </Stack> */}
            <FormControl>
              <Button variant='contained' type='submit'>Submit</Button>
            </FormControl>
          </form>
          <Box sx={{height: '70vh'}}>
            <DataGrid
              columns={columns}
              rows={ingredients}
              getRowId={(row) => row ? row.i_id : 0}
              autoHeight={true}
              components={{Toolbar: CustomToolbar}}
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