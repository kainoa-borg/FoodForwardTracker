import AllergiesList from './AllergiesList.js'
import React from 'react'

// Household Row component
// Takes: key of current row, the state of the Household Page's hh list, deleteHousehold callback, handleEditClick callback
// Returns a household table row component 
const HouseholdRow = (props) => {
    const {thisKey, household, deleteHousehold, handleEditClick} = props;
    const key = thisKey;
    const hh = household;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{hh.hh_name}</td>
            <td>{hh.num_adult}</td>
            <td>{hh.num_child}</td>
            <td>{String(Boolean(hh.veg_flag))}</td>
            <td>{String(Boolean(hh.gf_flag))}</td>
            <td>{String(Boolean(hh.a_flag))}</td>
            <td>{String(Boolean(hh.sms_flag))}</td>
            <td>{String(Boolean(hh.paused_flag))}</td>
            <td>{hh.phone}</td>
            <td>{hh.street}</td>
            <td>{hh.city}</td>
            <td>{hh.pcode}</td>
            <td>{hh.state}</td>
            <td>{hh.delivery_notes}</td>
            <td><AllergiesList allergies={hh.hh_allergies} isEditable={false}/></td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteHousehold is called with this row's key */}
            <td><button onClick={() => deleteHousehold(key)}>Delete</button></td>
        </tr>
    )
}

export default HouseholdRow;