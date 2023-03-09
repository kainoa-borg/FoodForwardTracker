import React, { useState, useEffect} from 'react'
import axios from 'axios'
<<<<<<< HEAD
import ReportsPage from '../Reports/ReportsPage.js'
=======
// import ReportsPage from '../ReportsPage.js'
>>>>>>> a48dd72e4e4e1cb00da9b053e40b09e8917db4ea
import { Box, Button, setAddFormOpen} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToolBar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';


const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Packaging List Component
export default function PackagingReport() {
    const [packaging, setPackaging] = useState(undefined);

    useEffect(() => {
        getDBPackaging();
    }, []);

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

    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
        { field: 'unit', headerName: 'Unit', width: 100, editable: true },
        { field: 'qty_holds', headerName: 'Size', width: 10, editable: true },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean', editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },
        { field: 'pref_psupplier', headerName: 'Supplier', width: 80, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
    ]

    if (packaging === undefined) {
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
        <Box sx={{height: '75%'}}>
            {/* Show a row for each ingredient in packaging.*/}
            <DataGrid
                columns={columns}
                rows={packaging}
                components = {{Toolbar:CustomToolbar}}
                getRowId={(row) => row.p_id}
                autoHeight = {true}
            >
            </DataGrid>
        </Box>
    )
}