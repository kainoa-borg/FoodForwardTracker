import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import PackagingForm from './PackagingForm.js'
import NewModularDatagrid from '../components/NewModularDatagrid.js';
import ModularSelect from '../components/ModularSelect.js'
import './PackagingList.css'
import PkgUsageTable from './PkgUsageTable.js';
import CellDialog from '../components/CellDialog.js';
import EditablePkgUsageTable from './EditablePkgUsageTable.js';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';
import moment from 'moment';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Packaging List Component
export default function PackagingPage(props) {
    const [packaging, setPackaging] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [supplierOptions, setSupplierOptions] = useState();

    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};

    // const handleSBClose = (event, reason, setOpen) => {
    //     if (reason === 'clickaway') {
    //         setOpen(false);
    //     }
    //     setOpen(false);
    // }

    // Get suppliers from database
    // Set supplier variable with supplier data
    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "suppliers"
          }).then((response)=>{
            setSuppliers(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Get packaging from database
    // Set packaging variable with packaging data    
    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "packaging-inventory"
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

    // On page load
    useEffect(() => {
        getDBPackaging();
        getDBSuppliers();
    }, []);

    // On suppliers set
    useEffect(() => {
        if (suppliers)
            setSupplierOptions(suppliers.map((supplier) => {return {value: supplier.s_id, label: supplier.s_name}}));
    }, [suppliers])

    useEffect(() => {
        // console.log('SUPPLIER OPTIONS ===> ' + supplierOptions);
    }, [supplierOptions])

    if (packaging === undefined || suppliers === undefined) {
        return (
            <>loading...</>
        )
    }

    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={packaging} searchField={'package_type'} value={params.value} required/>},
        { field: 'unit', headerName: 'Unit', width: 100, editable: true, renderEditCell: (params) => <ModularSelect {...params} options={packaging} searchField={'unit'} value={params.value}/> },
        { field: 'qty_holds', headerName: 'Size', width: 10, editable: true },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean', editable: true },
        { field: 'unit_cost', headerName: 'Unit Cost', align: 'right', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value), editable: true },
        { field: 'pref_psupplier_id', headerName: 'Supplier', type: 'singleSelect', valueOptions: supplierOptions, width: 170, editable: true, valueFormatter: (params) => { if (params.value != undefined) {return suppliers.find((supp) => supp.s_id === params.value).s_name;}} },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date', editable: true, valueFormatter: params => moment(params.value).format('MM/DD/YYYY'), valueParser: value => moment(value).format("YYYY-MM-DD")},
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140, type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>), editable: true },
        { field: 'packaging_usage', headerName: 'Usages', width: 100, editable: true,
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    return <CellDialog buttonText={'View Usages'} dialogTitle={'Usages'} component={<PkgUsageTable packaging_usage={params.value}/>}/>
                }
                else {
                    return <Typography variant='p'>No Usages</Typography>
                }
            },
            renderEditCell: (params) => {
                const api = useGridApiContext();
                const updateCellValue = (fieldName, newValue) => {
                    const {id, field} = params;
                    api.current.setEditCellValue({id, field, value: newValue, debounceMs: 200})
                }
                return <CellDialog buttonText={'Edit Usages'} dialogTitle={'Edit Usages'} component={<EditablePkgUsageTable packaging_usage={params.value} updateEditForm={updateCellValue}/>}/>
            }
        },
        {
            field: 'qty_on_hand', headerName: "Amt On Hand", width: 100, editable: false
        }
    ]
    
    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Packaging</Typography>
        <Box sx={{height: '70vh'}}>
            <NewModularDatagrid 
                loginState={loginState}
                rows={packaging} 
                columns={columns} 
                apiEndpoint='packaging-inventory'
                // apiIP='localhost'
                keyFieldName='p_id'
                entryName='Packaging'
                searchField='package_type'
                searchLabel='Packaging Types'
                AddFormComponent={PackagingForm}
            />            
        </Box>
        {/* Add entry notice */} 
        </div>
    )
}

/*        
{/* Save Click Notice *//*}
<Snackbar
open={updateSBOpen}
autoHideDuration={3000}
onClose={(event, reason) => handleSBClose(event, reason, setUpdateSBOpen)}
message="Saving..."
/>
{/* Save Complete Notice *//*}
<Snackbar
open={updateDoneSBOpen}
autoHideDuration={3000}
onClose={(event, reason) => handleSBClose(event, reason, setUpdateDoneSBOpen)}
message="Changes saved!"
/>*/