import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { Box, Typography} from '@mui/material'
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid'

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
            url:process.env.REACT_APP_API_URL + "packaging-report"
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
        { field: 'qty_on_hand', headerName: 'Qty on Hand', width: 140, type: 'number', editable: false},
        { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true },
        { field: 'unit', headerName: 'Unit', width: 100, editable: true },
        { field: 'qty_holds', headerName: 'Size', width: 10, editable: true },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean', editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },
        { field: 'pref_psupplier', headerName: 'Supplier', width: 80, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, editable: true },
        // { field: 'packaging_usage', headerName: 'Usages', width: 100, editable: true,
    ]

    if (packaging === undefined) {
        return (<>loading</>);
    }

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport
            csvOptions={{
                fileName: 'Packaging Report',
                delimeter: ';'
            }} />
          </GridToolbarContainer>
        );
    }

    // The HTML structure of this component
    return (
        <Box sx={{height: '75%'}}>
            <Typography variant='h5'>Packaging Report</Typography>
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