import React from 'react'
import AllergiesList from '../Households/AllergiesList.js'

// Station Row component
// Takes: key of current row, the state of the Station Page's hh list, deleteStation callback, handleEditClick callback
// Returns a Station table row component 
const HhrefRow = (props) => {
    const {thisKey, household} = props;
    const key = thisKey;
    const hh = household;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{hh.hh_name}</td>
            <td>{hh.num_adult}</td>
            <td>{hh.num_child_lt_6}</td>
            <td>{hh.num_child_gt_6}</td>
            <td>{String(Boolean(hh.sms_flag))}</td>
            <td>{String(Boolean(hh.veg_flag))}</td>
            <td>{String(Boolean(hh.allergy_flag))}</td>
            <td>{String(Boolean(hh.gf_flag))}</td>    
            <td>{String(Boolean(hh.ls_flag))}</td>       
            <td>{String(Boolean(hh.paused_flag))}</td>
        </tr>
    )
}

export default HhrefRow;