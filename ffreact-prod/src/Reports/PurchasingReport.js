import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReportsPage from './ReportsPage';
import { DataGrid } from '@mui/x-data-grid'
import { ToolBar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Box, Button, Input, InputLabel, Snackbar, Typography, Stack, FormControl} from '@mui/material';


// Packaging List Component
export default function PurchasingReport() {
    const [purchasing, setPurchasing] = useState(undefined);
    const [dateRange, setDateRange] = useState([]);
    const [searchingSBOpen, setSearchingSBOpen] = useState([]);
    const [resultsFoundSBOpen, setResultsFoundSBOpen] = useState(false);
    const [noResultsSBOpen, setNoResultsSBOpen] = useState(false);
    
    // const [ingredients, setIngredients] = useState(undefined);
    

    const getDBPackPurchaseList = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/pack-purchase-list/",
            params: dateRange
          }).then((response)=>{
            if (response.data.length > 0) setResultsFoundSBOpen(true);
            else setNoResultsSBOpen(true);
            
            setPurchasing(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    /* const getDBIngredients = () => {
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
      { field: ''}
      
     ]

    if (purchasing === undefined) {
        return (<>loading</>);
    }

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport />
        </GridToolbarContainer>
      );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getDBPackPurchaseList(dateRange);
  }

    // The HTML structure of this component
    return (
      <Box sx={{height: '35%'}}>
      {/* Show a row for each ingredient in packaging.*/}
      <DataGrid
          columns={columns}
          rows={purchasing}
          //components = {{Toolbar:CustomToolbar}}
          getRowId={(row) => row.m_id}
          autoHeight = {true}
      >
      </DataGrid>
  </Box>
    )
}