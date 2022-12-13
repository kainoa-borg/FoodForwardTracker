import StationCalcList from './StationCalcList.js'
import React from 'react'

// Editable Station Row
// Takes: key of current row, the state of the Station Page's editFormData, updateStation callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable Station table row component
const EditableStationRow = (props) => {
    const { thisKey, editFormData, updateStation, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const s = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td><input type="text" name="stn_name" defaultValue={s.stn_name} onChange={handleEditFormChange}/></td>
            <td><input type="number" name="num_servings" defaultValue={s.num_servings} onChange={handleEditFormChange}/></td>

            <td><button type='Submit' onClick={()=>{updateStation(key)}}>Save</button></td>
            <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableStationRow;