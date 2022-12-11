import { Fragment } from "react";
import { useState, useEffect } from 'react';
import DisplayMessage from '../DisplayMessage.js'
import React from 'react'

// Allergy List Component
const AllergiesList = (props) => {
    const [ingUsages, setIngUsage] = useState(props.ingUsages);
    const [currAllergy, setCurrAllergy] = useState({aType: ''});
    const [displayMsgComponent, setDisplayMsgComponent] = useState(null);
    const [isEditable, setIsEditable] = useState(props.isEditable);

    useEffect( () => {
        setIngUsage(props.ingUsages);
    }, [props.ingUsages]); 

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
            return ['aFlag', true];
        }
        else {
            return ['aFlag', false];
        }
    }

    const handleAddAllergy = (event) => {
        event.preventDefault();
        const newIngUsage =  [...ingUsages, currAllergy];
        setIngUsage(newIngUsage);
        setCurrAllergy({aType: ''});
        const ret = setAFlag(newIngUsage);
        console.log(ret)
        props.updateEditForm(['ingUsages', ret[0]], [newIngUsage, ret[1]]);
    }

    const handleDeleteAllergy = (key) => {
        const allergyID = key; 
        let newIngUsage = [...ingUsages];
        newIngUsage.splice(allergyID, 1);
        setIngUsage(newIngUsage);
        const ret = setAFlag(newIngUsage);
        props.updateEditForm(['ingUsages', ret[0]], [newIngUsage, ret[1]]);
    }

    if (isEditable) {
        return (
            <Fragment>
                <table>  
                    <tbody>
                        {/* Show a row for each allergy object in ingUsages */}
                        {ingUsages.map((allergy, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            {allergy.aType}
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
                        {/* Show a row for each allergy object in ingUsages */}
                        {ingUsages.map((allergy, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            {allergy.aType}
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