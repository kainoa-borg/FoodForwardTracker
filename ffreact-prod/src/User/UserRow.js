import React from 'react'

// User Row component
// Takes: key of current row, the state of the User Page's u list, deleteUser callback, handleEditClick callback
// Returns a User table row component 
const UserRow = (props) => {
    const { thisKey, user, deleteUser, handleEditClick} = props;
    const key = thisKey;
    const u = user;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{u.u_id}</td>
            <td>{u.username}</td>
            <td>{u.password}</td>
            <td>{u.admin_flag}</td>
            <td>{u.email}</td>
            
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteUser is called with this row's key */}
            <td><button onClick={() => deleteUser(key)}>Delete</button></td>
        </tr>
    )
}

export default UserRow;