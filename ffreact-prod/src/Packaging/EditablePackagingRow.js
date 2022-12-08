import React from 'react'

// Editable Packaging Row
// Takes: key of current row, the state of the Packaging Page's editFormData, updatePackaging callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable packaging table row component
const EditablePackagingRow = (props) => {
    const {thisKey, editFormData, updatePackaging, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const packaging = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{packaging.p_id}</td>
            <td><input name="package_type" type="text" maxLength='30' value={packaging.package_type} onChange={handleEditFormChange}/></td>
          
            <td><input name='unit_qty' type="number" value={packaging.unit_qty} onChange={handleEditFormChange}/></td>
          
            <td><input name='unit_cost' type="number" step="0.01" value={packaging.unit_cost} onChange={handleEditFormChange}/></td>
          
            <td><input name="qty_holds" type="number" placeholder={packaging.qty_holds} value={packaging.in_date} onChange={handleEditFormChange}/></td>

            <td><input name="unit" type="number" value={packaging.unit} onChange={handleEditFormChange}/></td>

          <td>placeholder</td>

            <td><input name="returnable" type="number" value={packaging.returnable} onChange={handleEditFormChange}/></td>

            <td><input name="in_date" type="date" value={packaging.in_date} onChange={handleEditFormChange}/></td>

            <td><input name="in_qty" type="number" value={packaging.in_qty} onChange={handleEditFormChange}/></td>

            <td><input name="exp_date" type="date" value={packaging.exp_date} onChange={handleEditFormChange}/></td>

            <td><input name="qty_on_hand" type="number" value={packaging.qty_on_hand} onChange={handleEditFormChange} /></td>

            <td><input name="flat_fee" type="number" step="0.01" value={packaging.flat_fee} onChange={handleEditFormChange} /></td>

          <td><button onClick={()=>{updatePackaging(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditablePackagingRow;