import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import HouseholdForm from './HouseholdForm.js'
import EditableHouseholdRow from './EditableHouseholdRow.js'
import HouseholdRow from './HouseholdRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './HouseholdList.css'


// Household List Component
export default function HouseholdList() {
    // const data = [
    //     {hh_name: 'Anom', num_adult: 2, num_child: 1, veg_flag: false, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '123-456-7890', street: '1234 aStreet', city: 'aCity', pcode: '12345', state: 'MI', delivery_notes: 'N/A', allergies: []},
    //     {hh_name: 'Jean', num_adult: 1, num_child: 1, veg_flag: true, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '234-567-8912', street: '4321 bStreet', city: 'bCity', pcode: '54321', state: 'MI', delivery_notes: 'Leave on porch', allergies: [{aType: 'Peanut'}]}
    // ]

    const [households, setHouseholds] = useState(undefined);
    const [editHouseholdID, setEditHouseholdID] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Household Name already found!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        setHouseholds(getDBHouseholds());
    }, []);

    const getDBHouseholds = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households-allergies"
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

    const postDBHouseholds = () => {
        console.log(households);
        axios({
            method: "POST",
            url: "http://4.236.185.213:8000/api/households-allergies",
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
        // Check to see if we already have a duplicate Household Name
        if (!households.find((HH) => HH.hh_name === household.hh_name))
        {
            let newHouseholds = [...households, household];
            setHouseholds(newHouseholds);
            clearError();
        }
        else {
            // If this household is already in households list, display error message
            handleError('DuplicateKey');
        }
    }

    const deleteHousehold = (key) => {
        const householdID = key; 
        let newHouseholds = [...households];
        newHouseholds.splice(householdID, 1);
        setHouseholds(newHouseholds);
    }

    const updateHousehold = (key) => {
        let thisName = households[key];
        let newHouseholds = [...households];
        newHouseholds[key] = editFormData;
        setEditHouseholdID(null);
        setHouseholds(newHouseholds)
        clearError();
    }

    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th># Adults</th>
                        <th># Children</th>
                        <th>Vegan</th>
                        <th>Gluten Free</th>
                        <th>Allergies</th>
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
                </tbody>
            </table>
            <h3>Add A Household</h3>
            <HouseholdForm addHousehold={addHousehold}></HouseholdForm>
            <button onClick={postDBHouseholds}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}