import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button, Input, Radio, RadioGroup, Snackbar, Typography, Stack, FormControl, FormControlLabel} from '@mui/material';


// Ingredients Purchasing List Component
export default function PurchasingReport() {
    const [ingredients, setIngredients] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [ingPurchasing, setIngPurchasing] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    const [value, setValue] = useState('Meals');
    const handleRadioChange = (event) => {setValue(event.target.value);};

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        //getDBIngredients();
        getDBSuppliers();
    }, []); 

    const getDBIngPurchaseList = (dateRange, value) => {
        setSearchingSBOpen(true);
        axios({
          method: "GET",
          url:"http://localhost:8000/api/ing-purchase-report/",
          params: dateRange
        }).then((response)=>{
          // console.log(response.data);
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

    const columns = [
        { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
        { field: 'm_date', headerName: 'Date Prepared', width: 150 },
        { field: 'name', headerName: 'Meal Name', width: 120 },
        { field: 'unit', headerName: 'Measure', width: 90, editable: true },
        { field: 'total_required', headerName: 'Total Required', width: 140, type: 'number', /*valueGetter: ({row}) => (row.unit_cost * row.in_qty),*/ },
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
        { field: 'to_purchase', headerName: 'To Purchase', width: 140, type: 'number', editable: false},
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
    getDBIngPurchaseList(dateRange, value);
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
              <FormControl sx={{ ml: 2 }}>
                <Typography htmlFor="endDate">Select: </Typography>
                <RadioGroup row id="select" defaultValue="Meals" name="radio-buttons-group" value={value} onChange={handleRadioChange}>
                  <FormControlLabel value="Meals" control={<Radio />} label="Meals" />
                  <FormControlLabel value="Snacks" control={<Radio />} label="Snacks" />
                </RadioGroup>
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