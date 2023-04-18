import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Box, Button, Input, Snackbar, Typography, FormControl} from '@mui/material';


// Packaging List Component
export default function PurchasingReport() {
    const [packaging, setPackaging] = useState([undefined])
    const [PPL, setPPL] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [mealPlans, setMealPlans] = useState([undefined]);
    const [searchingSBOpen, setSearchingSBOpen] = useState([false]);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    
    
    // const [ingredients, setIngredients] = useState(undefined);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });

  useEffect(() => {
      getDBPackaging();
      getDBMealPlans();
  }, []);
    

    const getDBPackPurchaseList = (dateRange, value) => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/pack-purchase-report/",
            params: dateRange
          }).then((response)=>{
            if (response.data.length > 0) setResultsFoundSBOpen(true);
            else setNoResultsSBOpen(true);
            
            setPPL(response.data);
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
          url:"http://4.236.185.213:8000/api/packaging-report"
        }).then((response)=>{
          const pkgData = response.data
          setPackaging(pkgData);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
  }
  const getDBMealPlans = () => {
    console.log('MAKING REQUEST TO DJANGO')
    axios({
        method: "GET",
        url:"http://4.236.185.213:8000/api/mealplans/"
      }).then((response)=>{
        const mealData = response.data
        setMealPlans(mealData);
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
      { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
      { field: 'qty_needed', headerName: 'Qty Needed', width: 140, type: 'number', editable: false},
      { field: 'm_date', headerName: 'Date Last Prepared', width: 150 },
      { field: 'meal_name', headerName: 'Meal Name', width: 200 },
      { field: 'snack_name', headerName: 'Snack Name', width: 120 },
      { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
      { field: 'unit_cost', headerName: 'Unit Cost', align: 'right', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },

     ]

    // const rows = [
    //   { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
    //   { field: 'm_date', headerName: 'Date Last Prepared', width: 150 },
    //   { field: 'meal_name', headerName: 'Meal Name', width: 200 },
    //   { field: 'snack_name', headerName: 'Snack Name', width: 120 },
    //   { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
    //   { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },
    // ]

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport 
          csvOptions={{
            fileName: 'Packaging Purchase Report',
            delimeter: ';'
          }}
          />
        </GridToolbarContainer>
      );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getDBPackPurchaseList(dateRange);
    getDBMealPlanReport(dateRange);
  }

    // The HTML structure of this component
    return (
      <div>
          <Typography variant='h5'>Package Purchasing Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Select for packaging planned within a start and end date.</Typography>
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
      {/* Show a row for each ingredient in packaging.*/}
      <DataGrid
          columns={columns}
          rows={PPL}
          // row={mealPlans}
          components = {{Toolbar:CustomToolbar}}
          getRowId={(row) => row.id}
          // getRowsId={(row) => row.m_id}
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