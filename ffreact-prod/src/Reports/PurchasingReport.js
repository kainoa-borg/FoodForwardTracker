import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { Box, Button, setAddFormOpen} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToolBar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import ReusableTable from '../ReusableTable.js'

// Packaging List Component
export default function PurchasingReport() {
    const [purchasing, setPurchasing] = useState(undefined);
    // const [ingredients, setIngredients] = useState(undefined);
    const columns = []

    useEffect(() => {
        getDBPackaging();
        // getDBIngredients();
    }, []);

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/pack-purchase-list/"
          }).then((response)=>{
            const pkgRetData = response.data
            setPurchasing(pkgRetData);
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