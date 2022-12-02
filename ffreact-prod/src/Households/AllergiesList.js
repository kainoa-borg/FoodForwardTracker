import { Fragment } from "react";
import { useState, useEffect } from 'react';
import DisplayMessage from '../DisplayMessage.js'
import React from 'react'

// Allergy List Component
const AllergiesList = (props) => {
    const [allergies, setAllergies] = useState(props.allergies);
    const [currAllergy, setCurrAllergy] = useState({aType: ''});
    const [displayMsgComponent, setDisplayMsgComponent] = useState(null);
    const [isEditable, setIsEditable] = useState(props.isEditable);

    useEffect( () => {
        setAllergies(props.allergies);
    }, [props.allergies]); 

    // Callback function that updates the allergy object currently being edited
    // Takes input change event information (name, type, and value of input field)
    // Returns none
    const handleAllergyChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new household object before setting state
        const newAllergy = {...currAllergy};
        newAllergy[fieldName] = fieldValue;
        // Set state with new household object
        setCurrAllergy(newAllergy);
    }

    const setAFlag = (allergyList) => {
        if (allergyList.length > 0) {
            return ['a_flag', true];
        }
        else {
            return ['a_flag', false];
        }
    }

    const handleAddAllergy = (event) => {
        event.preventDefault();
        const newAllergies =  [...allergies, currAllergy];
        setAllergies(newAllergies);
        setCurrAllergy({a_type: ''});
        const ret = setAFlag(newAllergies);
        console.log(ret)
        props.updateEditForm(['allergies', ret[0]], [newAllergies, ret[1]]);
    }

    const handleDeleteAllergy = (key) => {
        const allergyID = key; 
        let newAllergies = [...allergies];
        newAllergies.splice(allergyID, 1);
        setAllergies(newAllergies);
        const ret = setAFlag(newAllergies);
        props.updateEditForm(['allergies', ret[0]], [newAllergies, ret[1]]);
    }

    if (isEditable) {
        return (
            <Fragment>
                <table>  
                    <tbody>
                        {/* Show a row for each allergy object in allergies */}
                        {allergies.map((allergy, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            {allergy.a_type}
                                        </td>
                                        <td>
                                            <button type='button' onClick={() => {handleDeleteAllergy(thisKey)}}>
                                                delete
                                            </button>
                                        </td>
                                    </tr>
                                </Fragment>
                            );
                        })}
                        <tr>
                            <td>
                                <input name="aType" type="text" onChange={handleAllergyChange} value={currAllergy.aType}></input>
                            </td>
                            <td>
                                <button type='button' onClick={handleAddAllergy}>
                                    Add
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Fragment>
        );
    }
    else {
        return (
            <Fragment>
                <table>
                    <tbody>
                        {/* Show a row for each allergy object in allergies */}
                        {allergies.map((allergy, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            {allergy.a_type}
                                        </td>
                                    </tr>
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </Fragment>
        );
    }
    
}

export default AllergiesList;