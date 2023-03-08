import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReportsPage from './ReportsPage'
import { Box, Button, setAddFormOpen} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToolBar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';


// Household List Component
export default function HouseholdReport() {
    const [households, setHouseholds] = useState(undefined);

    useEffect(() => {
        getDBHouseholds();
    }, []);

    const getDBHouseholds = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households-report"
          }).then((response)=>{
            const hhData = response.data
            setHouseholds(hhData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const columns = [
        { field: 'hh_name', headerName: 'Name', type: 'string', width: 120, editable: false},
        { field: 'num_adult', headerName: 'Adults', type: 'number', width: 70, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17',  type: 'number', width: 70, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', width: 70, editable: true },
        { field: 'phone', headerName: 'Phone Number', width: 110, type: 'number', editable: true },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 70, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'string', editable: true, 
        },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'paying', headerName: 'Paying', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
    ]

    if (households === undefined) {
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
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <Box sx={{height: '35%'}}>
            {/* Show a row for each ingredient in packaging.*/}
            <DataGrid
                columns={columns}
                rows={households}
                components = {{Toolbar:CustomToolbar}}
                getRowId={(row) => row.hh_name}
                autoHeight = {true}
            >
            </DataGrid>
        </Box>
    )
}