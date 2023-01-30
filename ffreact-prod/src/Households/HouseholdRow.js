import AllergiesList from './AllergiesList.js'
import React from 'react'

import Button from 'react-bootstrap/Button'

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
            <td>{hh.num_child_lt_6}</td>
            <td>{hh.num_child_gt_6}</td>
            <td>{String(Boolean(hh.veg_flag))}</td>
            <td>{String(Boolean(hh.gf_flag))}</td>
            
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
            <td><Button variant='secondary'onClick={()=> handleEditClick(key)}>Edit</Button></td>
            {/* When delete is clicked, deleteHousehold is called with this row's key */}
            <td><Button variant='danger' onClick={() => deleteHousehold(key)}>X</Button></td>
        </tr>
    )
}

export default HouseholdRow;