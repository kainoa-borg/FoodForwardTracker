import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './PackagingList.css'

// Packaging List Component
export default function PackagingPage() {
    const [packaging, setPackaging] = useState([]);
    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150 },
        { field: 'unit', headerName: 'Unit', width: 6 },
        { field: 'qty_holds', headerName: 'Size', width: 5 },
        { field: 'returnable', headerName: 'Returnable', width: 90 },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 80 },
        { field: 'pref_psupplier_id', headerName: 'Supplier', width: 80 },
        { field: 'in_date', headerName: 'Purchase Date', width: 120 },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140 },
        { field: 'tmp_1', headerName: 'Date Used', width: 100 },
        { field: 'tmp_2', headerName: 'Units Used', width: 100 }
    ]
    const [suppliers, setSuppliers] = useState();
    const [editPackagingID, setEditPackagingID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        p_id: '',
        package_type: "",
        unit_qty: '',
        qty_holds: '',
        unit: "",
        returnable: '',
        in_date: '',
        in_qty: '',
        packaging_usage: [],
        qty_on_hand: '',
        unit_cost: '',
        flat_fee: '',
        psupplier_id: '',
        pref_psupplier_id: ''
    });

    useEffect(() => {
        fetch("http://localhost:8000/api/packaging-inventory")
          .then((data) => data.json())
          .then((data) => setPackaging(data))
    
      }, [])

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/packaging-inventory"
        }).then((response)=>{
        setPackaging(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleRowClick = (params) => {
        getDBPackaging(params.row.p_id);
        wait(300);
        console.log(packaging);
    }

    if (packaging === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    return(
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            onRowClick={handleRowClick} 
            rows={packaging} 
            columns={columns} 
            getRowId={(row) => row.p_id}>
            </DataGrid>
        </Box>
    )
}
