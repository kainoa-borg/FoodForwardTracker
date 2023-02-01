import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import HouseholdForm from './HouseholdForm.js'
import EditableHouseholdRow from './EditableHouseholdRow.js'
import HouseholdRow from './HouseholdRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

//import './HouseholdList.css'
import {Table} from '@mui/material'

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
            url:"http://localhost:8000/api/households"
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
            url: "http://localhost:8000/api/households/",
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
                url: "http://localhost:8000/api/households/",
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
            url: "http://localhost:8000/api/households/"+households[key].hh_name,
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
            url: "http://localhost:8000/api/households/"+thisName+'/',
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
        <div className='table-div'>
          <h3>Clients</h3>
            <Table hover size='sm' bordered='false' responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Adults</th>
                        <th>Children 0-6</th>
                        <th>Children 7-17</th>
                        <th>Vegan</th>
                        <th>Gluten Free</th>
                        <th>Receive SMS</th>
                        <th>Paused</th>
                        <th>Phone Number</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>Postal Code</th>
                        <th>State</th>
                        <th>Delivery Notes</th>
                        <th>Allergies</th>
                    </tr>
                </thead>
                <tbody>
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
                </tbody>
            </Table>
            <h3>Add A Household</h3>
            <HouseholdForm addHousehold={addHousehold}></HouseholdForm>
            <button onClick={postDBHouseholds}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}
