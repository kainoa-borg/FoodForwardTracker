import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './HouseholdList.css'
import { Container, Button, Typography } from '@mui/material'
import { Box } from '@mui/material'

// Households/Clients List Component
export default function HouseholdPage() {
    
    const [households, setHousehold] = useState([]);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);
    const columns = [
        { field: 'hh_name', headerName: 'Name', width: 150, type: 'string', editable: true },
        { field: 'num_adult', headerName: 'Adults', width: 90, type: 'string', editable: true },
        { field: 'num_child_lt_6', headerName: 'Children 0-6', width: 50, type: 'number', editable: true },
        { field: 'num_child_gt_6', headerName: 'Children 7-17', width: 90, type: 'number', editable: true },
        { field: 'phone', headerName: 'Phone Number', width: 90, type: 'number', editable: true, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'street', headerName: 'Street', width: 180, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 120, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 140, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Postal Code', width: 100, type: 'date', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, type: 'string', editable: true },
        { field: 'veg_flag', headerName: 'Veg', width: 100, type: 'boolean', editable: true },
        { field: 'sms_flag', headerName: 'SMS', width: 100, type: 'boolean', editable: true },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 100, type: 'boolean', editable: true},
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'date', editable: true, valueFormatter: ({ value }) => value.s_name }
        { field: 'paused_flag', headerName: 'Paused', width: 100, type: 'boolean', editable: true },
    ]

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Household Name already found!"/>
            )
        }
        if (errCode = 'empty') {
                setErrorComponent(
                  <Error text="There doesn't seem to be any data!"/>
                )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        getDBHousehold();
    }, []);

    const addHousehold = (household) => {
        console.log(JSON.stringify(household));
        // Check to see if we already have a duplicate Household Name
        if (!households.find((HH) => HH.hh_name === household.hh_name))
        {
            axios({
                method: "POST",
                url: "http://4.236.185.213:8000/api/households/",
                data: household
              }).then((response)=>{
                getDBHouseholds();
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  }
              });
            clearError();
        }
        else {
            // If this household is already in households list, display error message
            handleError('DuplicateKey');
        }
    }

    const postDBHouseholds = () => {
        console.log(households);
        axios({
            method: "POST",
            url: "http://4.236.185.213:8000/api/households/",
            data: households
          }).then((response)=>{
            getDBHouseholds();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const getDBHousehold = () => {
        console.log("MAKING REQUEST TO DJANGO")
        setLoadingComponent(<Error text="LOADING DATA..."/>);
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households"
        }).then((response)=>{
        setHousehold(response.data);
        setLoadingComponent(null);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleRowClick = (params) => {
        getDBHousehold(params.row.p_id);
        wait(300);
        console.log(households);
    }

    if (households === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick} 
            rows={households} 
            columns={columns} 
            getRowId={(row) => row.p_id}
            pageSize={10}
            //rowsPerPageOptions={[7]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        {loadingComponent}
        <HouseholdForm addHousehold={addHousehold} allergies={household.hh_allergies}></HouseholdForm>
        <button onClick={postDBHousehold}>Submit Changes</button>
        {errorComponent}
        {displayMsgComponent}
        </div>
    )
}
