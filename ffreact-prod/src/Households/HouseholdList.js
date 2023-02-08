import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import HouseholdForm from './HouseholdForm.js'
import EditableHouseholdRow from './EditableHouseholdRow.js'
import HouseholdRow from './HouseholdRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

//import './HouseholdList.css'
import {Table, TableHead, TableRow, TableCell, TableBody, Paper} from '@mui/material'

// Household List Component
export default function HouseholdList() {
    const [households, setHouseholds] = useState(undefined);
    const [editHouseholdID, setEditHouseholdID] = useState(null);
    const [editFormData, setEditFormData] = useState();
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

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
        getDBHouseholds();
    }, []);
    const getDBHouseholds = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households"
          }).then((response)=>{
            console.log(response.data[0])
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
    const deleteHousehold = (key) => {
        const householdID = key; 
        axios({
            method: "DELETE",
            url: "http://4.236.185.213:8000/api/households/"+households[key].hh_name,
          }).then((response)=>{
            getDBHouseholds();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
        });
    }
    const updateHousehold = (key) => {
        let thisName = households[key].hh_name;
        console.log(JSON.stringify(editFormData));
        axios({
            method: "PATCH",
            url: "http://4.236.185.213:8000/api/households/"+thisName+'/',
            data: editFormData
          }).then((response)=>{
            getDBHouseholds();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setEditHouseholdID(null);
        clearError();
    }
    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
        // Create new household object before setting state
        const newEditFormData = {...editFormData};
        newEditFormData[fieldName] = fieldValue;
        // Set state with new household object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.a_flag);
        }
        setEditFormData(newEditFormData);
      }
    const handleEditClick = (key) => {
        setEditHouseholdID(key);
        setEditFormData(households[key]);
    }
    const handleCancelClick = () => {
        setEditHouseholdID(null);
        setEditFormData(null);
    }
    if (households === undefined) {
        return (<>loading</>);
    }
    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div>
          <h3>Clients</h3>
            <Table size='small' component={Paper} stickyHeader sx={{minWidth: 650}}>
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>Name</TableCell>
                        <TableCell align='left'>Adults</TableCell>
                        <TableCell align='left'>Children 0-6</TableCell>
                        <TableCell align='left'>Children 7-17</TableCell>
                        <TableCell align='left'>V</TableCell>
                        <TableCell align='left'>GF</TableCell>
                        <TableCell align='left'>SMS</TableCell>
                        <TableCell align='left'>Paused</TableCell>
                        <TableCell align='left'>Phone Number</TableCell>
                        <TableCell align='left'>Street</TableCell>
                        <TableCell align='left'>City</TableCell>
                        <TableCell align='left'>Postal Code</TableCell>
                        <TableCell align='left'>State</TableCell>
                        <TableCell align='left'>Delivery Notes</TableCell>
                        <TableCell align='left'>Allergies</TableCell>
                        <TableCell align='left'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Show a row for each household in households.*/}
                    {households.map((household, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this household is the one to be edited, show an editable row instead
                                editHouseholdID === thisKey 
                                ? <EditableHouseholdRow thisKey={thisKey} editFormData={editFormData} updateHousehold={updateHousehold} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <HouseholdRow thisKey={thisKey} household={household} deleteHousehold={deleteHousehold} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* If the list is empty display EmptyTableMessage */}
                    {households.length < 1 ? handleError('empty') : null}
                </TableBody>
            </Table>
            <h3>Add A Household</h3>
            <HouseholdForm addHousehold={addHousehold}></HouseholdForm>
            <button onClick={postDBHouseholds}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}
