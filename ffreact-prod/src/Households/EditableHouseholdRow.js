import AllergiesList from './AllergiesList.js'
import React from 'react'

// Editable Household Row
// Takes: key of current row, the state of the Household Page's editFormData, updateHousehold callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable household table row component
const EditableHouseholdRow = (props) => {
    const {thisKey, editFormData, updateHousehold, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const hh = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td><input type="text" name="hh_name" defaultValue={hh.hh_name} onChange={handleEditFormChange}/></td>
            <td><input type="number" name="num_adult" defaultValue={hh.num_adult} onChange={handleEditFormChange}/></td>
            <td><input type="number" name="num_child" defaultValue={hh.num_child} onChange={handleEditFormChange}/></td>
            <td><input name='veg_flag' type="checkbox" checked={hh.veg_flag} onChange={handleEditFormChange}/></td>
            <td><input name='gf_flag' type='checkbox' checked={hh.gf_flag} onChange={handleEditFormChange}/></td>
            <td><input name='a_flag' type='checkbox' checked={hh.a_flag} onChange={handleEditFormChange}/></td>
            <td><input name='sms_flag' type='checkbox' checked={hh.sms_flag} onChange={handleEditFormChange}/></td>
            <td><input name='paused_flag' type='checkbox' checked={hh.paused_flag} onChange={handleEditFormChange}/></td>
            <td><input name='phone' type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' minLength='12' maxLength='12' defaultValue={hh.phone} onChange={handleEditFormChange}/></td>
            <td><input name='street' type='text' defaultValue={hh.street} onChange={handleEditFormChange}/></td>
            <td><input name='city' type='text' defaultValue={hh.city} onChange={handleEditFormChange}/></td>
            <td><input name='pcode' type='number' minLength='5' maxLength='5' defaultValue={hh.pcode} onChange={handleEditFormChange}/></td>
            <td><input name='state' type='text' minLength='2' maxLength='2' defaultValue={hh.state} onChange={handleEditFormChange}/></td>
            <td><textarea name='deliveryNotes' defaultValue={hh.delivery_notes} onChange={handleEditFormChange}/></td>
            <td><AllergiesList allergies={hh.hh_allergies} isEditable={true} updateAllergies={updateAllergies} updateEditForm={updateEditForm}/></td>
            <td></td>
            <td><button type='Submit' onClick={()=>{updateHousehold(key)}}>Save</button></td>
            <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableHouseholdRow;