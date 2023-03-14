import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReusableTable from '../ReusableTable.js'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Input, InputLabel, Snackbar, Typography, Stack, FormControl} from '@mui/material';

// Packaging List Component
export default function MealPlanReport() {
    const [mealPlans, setMealPlans] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    // const [ingredients, setIngredients] = useState(undefined);

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

    /*const getDBIngredients = () => {
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
    }*/

    const columns = [
      { field: 'meal_name', headerName: 'Meal Name', width: 200 },
      // { field: 'snack_name', headerName: 'Snack Name', width: 120 },
      { field: 'm_date', headerName: 'Date Last Prepared', width: 150 },
      //fields = ('m_id', 'm_date', 'meal_r_num', 'snack_r_num', 'meal_servings', 'snack_servings')

    ]

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport
            csvOptions={{
                fileName: 'Meal Plan Report',
                delimeter: ';'
            }} />
        </GridToolbarContainer>
      );
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      getDBMealPlanReport(dateRange);
    }

    // The HTML structure of this component
    return (
        <div>
          <Typography variant='h5'>Meal Plan Report</Typography>
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
          <Box sx={{height: '70vh'}}>
            <DataGrid
              columns={columns}
              rows={mealPlans}
              getRowId={(row) => row ? row.m_id : 0}
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