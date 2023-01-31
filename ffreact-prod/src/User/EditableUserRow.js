import React from 'react'

// Editable User Row
// Takes: key of current row, the state of the User Page's editFormData, updateUser callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable User table row component
const EditableUserRow = (props) => {
    const { thisKey, editFormData, updateUser, handleEditFormChange, handleCancelClick, updateEditForm} = props
    const u = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td><input type="number" name="u_id" defaultValue={u.u_id} onChange={handleEditFormChange}/></td>
            <td><input type="text" name="username" defaultValue={u.username} onChange={handleEditFormChange}/></td>
            <td><input type="text" name="password" defaultValue={u.password} onChange={handleEditFormChange} /></td>
            <td><input type="number" name="admin_flag" defaultValue={u.admin_flag} onChange={handleEditFormChange} /></td>
            <td><input type="email" name="email" defaultValue={u.email} onChange={handleEditFormChange} /></td>

            <td><button type='Submit' onClick={() => { updateUser(key)}}>Save</button></td>
            <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableUserRow;