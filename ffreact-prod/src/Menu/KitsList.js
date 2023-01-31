import { Fragment } from "react";
import { useState } from 'react';
import DisplayMessage from '../DisplayMessage.js'
import React from 'react'

// Kit List Component
const KitsList = (props) => {
    const [kits, setKits] = useState(props.kits);
    const [currKit, setCurrKit] = useState({kit_id: ''});
    const [displayMsgComponent, setDisplayMsgComponent] = useState(null);
    const [isEditable, setIsEditable] = useState(props.isEditable);

    // Callback function that updates the Kit object currently being edited
    // Takes input change event information (name, type, and value of input field)
    // Returns none
    const handleKitChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new household object before setting state
        const newKit = {...currKit};
        newKit[fieldName] = fieldValue;
        // Set state with new household object
        setCurrKit(newKit);
    }

    const handleAddKit = (event) => {
        event.preventDefault();
        const newKits =  [...kits, currKit];
        setKits(newKits);
        setCurrKit({kit_id: ''});
        props.updateEditForm('kit_ids', newKits);
    }

    const handleDeleteKit = (key) => {
        const kitID = key; 
        let newKits = [...kits];
        newKits.splice(kitID, 1);
        setKits(newKits);
        props.updateEditForm('kit_ids', newKits);
    }

    if (isEditable) {
        return (
            <Fragment>
                <table>  
                    <tbody>
                        {/* Show a row for each Kit object in kits */}
                        {kits.map((kit, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            {kit['kit_id']}
                                        </td>
                                        <td>
                                            <button onClick={() => {handleDeleteKit(thisKey)}}>
                                                delete
                                            </button>
                                        </td>
                                    </tr>
                                </Fragment>
                            );
                        })}
                        <tr>
                            <td>
                                <input name="aType" type="text" onChange={handleKitChange} value={currKit['kit_id']}></input>
                            </td>
                            <td>
                                <button onClick={handleAddKit}>
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
                        {/* Show a row for each Kit object in kits */}
                        {kits.map((kit, thisKey) => {
                            return (
                                <Fragment>
                                    <tr key={thisKey}>
                                        <td>
                                            kit {kit.kit_id}
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

export default KitsList;