import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Box, Button, Input, Snackbar, Typography, FormControl} from '@mui/material';

// Packaging List Component
export default function PackagingReturns() {
    const [packaging, setPackaging] = useState([]);
    const [packageReturn, setPackageReturn] = useState(undefined);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState(false);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);

    useEffect(() => {
        getDBPackaging();
    }, []);

    const getDBPackReturnList = (dateRange) => {
        setSearchingSBOpen(true);
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/packaging-return-report/",
            params: dateRange
          }).then((response)=>{
            // console.log(response.data);
            if (response.data.length > 0) setResultsFoundSBOpen(true);
            else setNoResultsSBOpen(true);
            setPackageReturn(response.data);
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
            url:"http://4.236.185.213:8000/api/packaging"
          }).then((response)=>{
            const pkgRetData = response.data
            setPackaging(pkgRetData);
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
        { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
       ]

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport 
            csvOptions={{
              fileName: 'Packaging Return Report',
              delimeter: ';'
            }}
            />
          </GridToolbarContainer>
        );
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      getDBPackReturnList(dateRange);
    }
  
      // The HTML structure of this component
      return (
        <div>
            <Typography variant='h5'>Packaging Return Report</Typography>
            <Typography variant='p' sx={{marginBottom: '5%'}}>Select for package return planned within a start and end date.</Typography>
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
            rows={packaging}
            // row={mealPlans}
            components = {{Toolbar:CustomToolbar}}
            getRowId={(row) => row.p_id}
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