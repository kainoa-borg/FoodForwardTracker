import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Input, InputLabel, Snackbar, Typography, Stack, FormControl} from '@mui/material';

// Packaging List Component
export default function MealPlanReport() {
    const [mealPlans, setMealPlans] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    const [calcErrorMsg, setCalcErrorMsg] = useState();
    const [calcSBOpen, setCalcSBOpen] = useState(false);
    const [calcSuccessSBOpen, setCalcSuccessSBOpen] = useState(false);
    const [calcErrorSBOpen, setCalcErrorSBOpen] = useState(false);

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

    const handleCalculateClick = (pk) => {
      setCalcSBOpen(true);
      axios({
        method: "GET",
        url:"http://4.236.185.213:8000/api/mealplanreport/" + pk + '/',
      }).then((response)=>{
        console.log(response.data);
        getDBMealPlanReport(dateRange);
        setCalcSuccessSBOpen(true);
      }).catch((error) => {
        if (error.response) {
          setCalcErrorMsg(error.response.data);
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          }
      });
    }

    const columns = [
      { field: 'meal_name', headerName: 'Meal Name', width: 200 },
      { field: 'snack_name', headerName: 'Snack Name', width: 120 },
      { field: 'm_date', headerName: 'Delivery Date', width: 150 },
      { field: 'meal_servings', headerName: 'Meal Servings', width: 200},
      { field: 'snack_servings', headerName: 'Snack Servings', width: 200},
      { field: 'actions', headerName: 'Actions', width: 200,
        renderCell: (params) => <Button onClick={(event) => {console.log(params); handleCalculateClick(params.row.m_id)}}>Calculate Servings</Button>
      }
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

    useEffect(() => {
      if (calcErrorMsg != undefined) {
        console.log(calcErrorMsg);
        setCalcErrorSBOpen(true);
      }
    }, [calcErrorMsg])

    // The HTML structure of this component
    return (
        <div>
          <Typography variant='h5'>Meal Plan Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Show planned meals between a start and end date</Typography>
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
            open={calcSBOpen}
            autoHideDuration={3000}
            onClose={() => setCalcSBOpen(false)}
            message="Making meal prep calculations..."
          />
          <Snackbar
            open={calcSuccessSBOpen}
            autoHideDuration={3000}
            onClose={() => setCalcSuccessSBOpen(false)}
            message="Meal prep calculations complete!"
          />
          <Snackbar
            open={calcErrorSBOpen}
            autoHideDuration={3000}
            onClose={() => {setCalcErrorMsg(); setCalcErrorSBOpen(false)}}
            message={calcErrorMsg}
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