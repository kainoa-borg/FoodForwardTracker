import { Fragment } from "react";
import { useState, useEffect } from 'react';
import React from 'react'
import { Table, TableBody, TableRow, TableCell, Button, TableContainer, Paper } from "@mui/material";

// Allergy List Component
const AllergiesList = (props) => {
    const [allergies, setAllergies] = useState(props.allergies);
    const [currAllergy, setCurrAllergy] = useState({aType: ''});
    const [isEditable /*, setIsEditable*/] = useState(props.isEditable);

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
        // Prevent refresh on form submit
        event.preventDefault();
        // Append this allergy to allergies list
        const newAllergies =  [...allergies, currAllergy];
        setAllergies(newAllergies);
        // Clear the allergy field
        setCurrAllergy({a_type: ''});
        // Get key value for updating allergyFlag
        const ret = setAFlag(newAllergies);
        // Batch updating the allergies and the allergy flag together
        props.updateEditForm(['hh_allergies', ret[0]], [newAllergies, ret[1]]);
    }

    const handleDeleteAllergy = (key) => {
        const allergyID = key; 
        let newAllergies = [...allergies];
        newAllergies.splice(allergyID, 1);
        setAllergies(newAllergies);
        const ret = setAFlag(newAllergies);
        props.updateEditForm(['hh_allergies', ret[0]], [newAllergies, ret[1]]);
    }

    if (isEditable) {
        return (
            <Fragment>
                <TableContainer component={Paper}>
                    <Table>  
                        <TableBody>
                            {/* Show a row for each allergy object in allergies */}
                            {allergies.map((allergy, thisKey) => {
                                return (
                                    <Fragment key={thisKey}>
                                        <TableRow key={thisKey}>
                                            <TableCell>
                                                {allergy.a_type}
                                            </TableCell>
                                            <TableCell>
                                                <Button color='lightBlue' variant='contained' size='small' onClick={() => {handleDeleteAllergy(thisKey)}}>
                                                    delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                            <TableRow>
                                <TableCell>
                                    <input name="a_type" type="text" onChange={handleAllergyChange} value={currAllergy.a_type}></input>
                                </TableCell>
                                <TableCell>
                                    <Button color='lightBlue' variant='contained' size='small' onClick={handleAddAllergy}>
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    }
    else {
        return (
            <Fragment>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {/* Show a row for each allergy object in allergies */}
                            {allergies.map((allergy, thisKey) => {
                                return (
                                    <Fragment key={thisKey}>
                                        <TableRow key={thisKey}>
                                            <TableCell>
                                                {allergy.a_type}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    }
    
}

export default AllergiesList;