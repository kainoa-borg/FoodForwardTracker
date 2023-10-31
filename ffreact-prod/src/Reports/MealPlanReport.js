import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button, Input, Snackbar, Typography, FormControl, Dialog} from '@mui/material';
import { useNavigate } from 'react-router';

import StationInstructions from '../Reports/StationInstructions.js'
// import moment from "moment";

// Packaging List Component
export default function MealPlanReport() {
    const [mealPlans, setMealPlans] = useState([]);
    const [dateRange, setDateRange] = useState({});
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    const [calcErrorMsg, setCalcErrorMsg] = useState();
    const [calcSBOpen, setCalcSBOpen] = useState(false);
    const [calcSuccessSBOpen, setCalcSuccessSBOpen] = useState(false);
    const [calcErrorSBOpen, setCalcErrorSBOpen] = useState(false);

    const [instructions, setInstructions] = useState();
    const [instructionMealPlan, setInstructionMealPlan] = useState();
    const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);

    const handleInstructionsClose = () => {
      setInstructionsDialogOpen(false);
    }

    console.log("RERENDERING");

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
        url:"http://localhost:8000/api/mealplanreport/" + pk + '/',
      }).then((response)=>{
        console.log(response.data);
        getDBMealPlanReport(dateRange);
        setCalcSuccessSBOpen(true);
      }).catch((error) => {
        if (error.response) {
          if (error.response.data.errorText) {
            setCalcErrorMsg(error.response.data.errorText);
          }
          else {
            setCalcErrorMsg(error.response.statusText);
          }
          getDBMealPlanReport(dateRange);
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          }
      });
    }

    const getStationInstructions = (pk, mealPlan) => {
      setSearchingSBOpen(true);
      axios({
        method: "GET",
        url:"http://localhost:8000/api/station-instructions/" + pk + '/',
      }).then((response)=>{
        console.log(response.data);
        setInstructionMealPlan(mealPlan);
        setInstructions(response.data);
        setResultsFoundSBOpen(true);
      }).catch((error) => {
        if (error.response) {
          setNoResultsSBOpen(true);
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
      { field: 'actions1', headerName: 'Calculate Servings', width: 200, renderCell: (params) =>
        <Button onClick={(event) => {console.log(params); handleCalculateClick(params.row.m_id)}}>Calculate Servings</Button>
      },
      { field: 'actions2', headerName: 'Station Instructions', width: 220, renderCell: (params) => 
          { if (params.row.meal_servings > 0) return (
              <Button onClick={(event) => {console.log(params); getStationInstructions(params.row.m_id, params.row)}}>Station Instructions</Button>
            )
            else return (
              <Typography variant='p'>Calculate Servings First</Typography>
            )
          }
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
      if (calcErrorMsg !== undefined) {
        console.log(calcErrorMsg);
        setCalcErrorSBOpen(true);
      }
    }, [calcErrorMsg])

    useEffect(() => {
      if (instructions && instructionMealPlan)
        setInstructionsDialogOpen(true);
    }, [instructions, instructionMealPlan])

    const handleDateRangeChange = (event) => {
      setDateRange({...dateRange, [event.target.name]: event.target.value})
    }

    // The HTML structure of this component
    return (
        <div>
          <Typography variant='h5'>Meal Plan Report</Typography>
          <Typography variant='p' sx={{marginBottom: '5%'}}>Show planned meals between a start and end date</Typography>
          <form onSubmit={handleSubmit}>
            {/* <Stack direction='row'> */}
              <FormControl>
                <Typography htmlFor="startDate">Start Date: </Typography>
                <Input id="startDate" name="startDate" variant='outlined' type='date' value={dateRange.startDate} onChange={handleDateRangeChange}/>
              </FormControl>
              <FormControl>
                <Typography htmlFor="endDate">End Date: </Typography>
                <Input id="endDate" name="endDate" variant='outlined' type='date' value={dateRange.endDate} onChange={handleDateRangeChange}/>  
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
            <Dialog
              fullScreen
              open={instructionsDialogOpen}
              onClose={handleInstructionsClose}
            >
              <StationInstructions instructions={instructions} mealPlan={instructionMealPlan} handleClose={handleInstructionsClose}/>
            </Dialog>
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