import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Input, Radio, RadioGroup, Snackbar, Typography, FormControl, FormControlLabel} from '@mui/material';
//var totalSum = 0.00

// Packaging List Component
export default function costTotals() {
    const [costTotals, setCostTotals] = useState([]);
    const [suppliers, setSuppliers] = useState(undefined);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    const [value, setValue] = useState('Ingredients');
    const totalTotal = costTotals.map((item) => (item.in_qty*item.unit_cost)).reduce((a, b) => Number(a) + Number(b), 0);
    const handleRadioChange = (event) => {setValue(event.target.value);};

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    // Get Cost Total information from database tables
    // Set Cost Total variables with response data
    const getCostTotalsList = (dateRange, value) => {
      if (value === 'Ingredients'){
        setSearchingSBOpen(true);
        axios({
          method: "GET",
          url:"http://4.236.185.213:8000/api/ing-costtotals/",
          params: dateRange
        }).then((response)=>{
          if (response.data.length > 0) setResultsFoundSBOpen(true);
          else setNoResultsSBOpen(true);
          setCostTotals(response.data);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
      }
      if (value === 'Packaging') {
        setSearchingSBOpen(true);
        axios({
          method: "GET",
          url:"http://4.236.185.213:8000/api/pack-costtotals/",
          params: dateRange
        }).then((response)=>{
          if (response.data.length > 0) setResultsFoundSBOpen(true);
          else setNoResultsSBOpen(true);
          setCostTotals(response.data);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
      }
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

    // Defines columns to be displayed on Cost Totals Report page
    const ingColumns = [ 
      { field: 'ingredient_name', headerName: 'Ingredient', width: 120, editable: true },
      { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
      { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
      { field: 'unit_cost', headerName: 'Unit Cost', align: 'right', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
      { field: 'pref_isupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
      { field: 'unit', headerName: 'Measure', width: 90, editable: true },
      { field: 'total', headerName: 'Total', align: 'right', width: 100, groupable: false, valueGetter: ({row}) => (row.unit_cost * row.in_qty), valueFormatter: ({ value }) => currencyFormatter.format(value)},
    ] 
    
    // Defines columns to be displayed on Cost Totals Report page
    const packColumns = [ 
      { field: 'package_type', headerName: 'Packaging', width: 120, editable: true },
      { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
      { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
      { field: 'unit_cost', headerName: 'Unit Cost', align: 'right', width: 90, editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
      { field: 'pref_psupplier_id', headerName: 'Supplier', width: 180, editable: true, valueFormatter: (params) => { if (params.value) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}}},
      { field: 'unit', headerName: 'Measure', width: 90, editable: true },
      { field: 'total', headerName: 'Total', align: 'right', width: 100, groupable: false, valueGetter: ({row}) => (row.unit_cost * row.in_qty), valueFormatter: ({ value }) => currencyFormatter.format(value)},
    ] 

    // Defines the file name the DataGrd Export function will use 
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

    // Actions to be taken upon a click of the Submit button
    const handleSubmit = (event) => {
      event.preventDefault();
      getCostTotalsList(dateRange, value);
    }
    
    // Required to get Supplier names 
    useEffect(() => {
      getDBSuppliers();
    }, [])

    // The HTML structure of this component
    if(value === 'Ingredients'){
    return (
        <div>
          <br />
          <Typography variant='h5'>Cost Total Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Select date range to calculate the total costs.</Typography><br />
          <Typography variant='p' sx={{marginBottom: '5%'}}>Only completed ingredient and packaging entries are included.</Typography><br /><br />
          
          <form onSubmit={handleSubmit}>
            {/* <Stack direction='row'> */}
              <FormControl sx={{ mr: 2 }} >
                <Typography htmlFor="startDate">Start Date: </Typography>
                <Input id="startDate" variant='outlined' type='date' value={dateRange.startDate} onChange={(event) => {setDateRange({...dateRange, startDate: event.target.value})}}/>
              </FormControl>
              <FormControl>
                <Typography htmlFor="endDate">End Date: </Typography>
                <Input id="endDate" variant='outlined' type='date' value={dateRange.endDate} onChange={(event) => {setDateRange({...dateRange, endDate: event.target.value})}}/>  
              </FormControl>  
              <FormControl sx={{ ml: 2 }}>
                <Typography htmlFor="endDate">Select List: </Typography>
                <RadioGroup row id="select" defaultValue="Ingredients" name="radio-buttons-group" value={value} onChange={handleRadioChange}>
                  <FormControlLabel value="Ingredients" control={<Radio />} label="Ingredients" />
                  <FormControlLabel value="Packaging" control={<Radio />} label="Packaging" />
                </RadioGroup>
              </FormControl>
            {/* </Stack> */}
            <FormControl sx={{ ml: 3 }} >
              <Button variant='contained' type='submit'>Submit</Button>
            </FormControl>

          </form>
          <Box sx={{height: '70vh'}}>
            <DataGrid
              columns={ingColumns}
              rows={costTotals}
              getRowId={(row) => row ? row.i_id : 0}
              autoHeight={true}
              components={{Toolbar: CustomToolbar}}
            >
            </DataGrid>
            <br />
            <Typography variant='p' sx={{ ml: 2 }}> Total: {currencyFormatter.format(totalTotal)} </Typography>
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
    else{
    return (
      <div>
        <br />
        <Typography variant='h5'>Cost Total Report</Typography>
        <Typography variant='p' sx={{marginBottom: '5%'}}>Select date range to calculate the total costs.</Typography><br />
        <Typography variant='p' sx={{marginBottom: '5%'}}>Only completed ingredient and packaging entries are included.</Typography><br /><br />
        
        <form onSubmit={handleSubmit}>
          {/* <Stack direction='row'> */}
            <FormControl sx={{ mr: 2 }} >
              <Typography htmlFor="startDate">Start Date: </Typography>
              <Input id="startDate" variant='outlined' type='date' value={dateRange.startDate} onChange={(event) => {setDateRange({...dateRange, startDate: event.target.value})}}/>
            </FormControl>
            <FormControl>
              <Typography htmlFor="endDate">End Date: </Typography>
              <Input id="endDate" variant='outlined' type='date' value={dateRange.endDate} onChange={(event) => {setDateRange({...dateRange, endDate: event.target.value})}}/>  
            </FormControl>  
            <FormControl sx={{ ml: 2 }}>
              <Typography htmlFor="endDate">Select List: </Typography>
              <RadioGroup row defaultValue="Ingredients" name="radio-buttons-group" value={value} onChange={handleRadioChange}>
                <FormControlLabel value="Ingredients" control={<Radio />} label="Ingredients" />
                <FormControlLabel value="Packaging" control={<Radio />} label="Packaging" />
              </RadioGroup>
            </FormControl>
          {/* </Stack> */}
          <FormControl sx={{ ml: 3 }} >
            <Button variant='contained' type='submit'>Submit</Button>
          </FormControl>

        </form>
        <Box sx={{height: '70vh'}}>
          <DataGrid
            columns={packColumns}
            rows={costTotals}
            getRowId={(row) => row ? row.p_id : 0}
            autoHeight={true}
            components={{Toolbar: CustomToolbar}}
          >
          </DataGrid>
          <div> Total: {currencyFormatter.format(totalTotal)} </div>
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
}