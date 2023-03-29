import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReportsPage from './ReportsPage';
import { DataGrid } from '@mui/x-data-grid'
import { ToolBar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Box, Button, Input, InputLabel, Snackbar, Typography, Stack, FormControl} from '@mui/material';


// Ingredients Purchasing List Component
export default function PurchasingReport() {
    const [ingredients, setIngredients] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [ingPurchasing, setIngPurchasing] = useState(undefined);
    const [mealPlans, setMealPlans] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    const getDBIngPurchaseList = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ing-purchase-report/",
            params: dateRange
          }).then((response)=>{
            if (response.data.length > 0) setResultsFoundSBOpen(true);
            else setNoResultsSBOpen(true);
            
            setIngPurchasing(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const getDBIngredients = () => {
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

    const getDBMealPlanReport = (dateRange) => {
        setSearchingSBOpen(true);
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/mealplanreport/",
            params: dateRange
          }).then((response)=>{
            // console.log(response.data);
            if (response.data.length > 0) setResultsFoundSBOpen(true);
            else setNoResultsSBOpen(true);
            setMealPlans(response.data);
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
        { field: 'meal_name', headerName: 'Meal Name', width: 200 },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_isupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
//        { field: 'total', headerName: 'Total', width: 90, editable: true },
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
            fileName: 'Ingredients Purchasing Report',
            delimeter: ';'
            }} />
        </GridToolbarContainer>
      );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getDBIngPurchaseList(dateRange);
    getDBMealPlanReport(dateRange);
  }

    // The HTML structure of this component
    return (
        <div>
          <Typography variant='h5'>Ingredient Purchasing Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Select for meals planned within a start and end date.</Typography>
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
        <Box sx={{height: '80%'}}>
        {/* Show a row for each ingredient in ingredients.*/}
        <DataGrid
          columns={columns}
          rows={ingredients}
          components = {{Toolbar:CustomToolbar}}
          getRowId={(row) => row.i_id}
          autoHeight = {true}
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