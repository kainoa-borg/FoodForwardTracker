import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import UserForm from './UserForm.js'
import EditableUserRow from './EditableUserRow.js'
import UserRow from './UserRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './UserList.css'


// User List Component

export default function UserList() {
    const [users, setUsers] = useState(undefined);
    const [editUserID, setEditUserID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        u_id: 0,
        username: "",
        password: "",
        admin_flag: 0,
        email: ""
    });

    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="User Name already found!"/>
            )
        }
        if (errCode = 'empty') {
                return <Error text="There doesn't seem to be any data!"/>
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        setUsers(getDBUsers());
    }, []);

    const getDBUsers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://localhost:8000/api/users"
          }).then((response)=>{
            const uData = response.data
            setUsers(uData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const postDBUsers = () => {
        console.log(users);
        axios({
            method: "POST",
            url: "http://localhost:8000/api/users/",
            data: users
          }).then((response)=>{
              getDBUsers();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const addUser = (user) => {
        console.log(JSON.stringify(user));
        // Check to see if we already have a duplicate User Name
        if (!users.find((U) => U.username === user.username))
        {
            axios({
                method: "POST",
                url: "http://localhost:8000/api/users/",
                data: user
              }).then((response)=>{
                  getDBUsers();
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  }
              });
            clearError();
        }
        else {
            // If this User is already in Users list, display error message
            handleError('DuplicateKey');
        }
    }

    const deleteUser = (key) => {
        const userID = key; 
        axios({
            method: "DELETE",
            url: "http://localhost:8000/api/users/" + users[key].u_id,
          }).then((response)=>{
              setUsers(getDBUsers());
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
        });
    }

    const updateUser = (key) => {
        let thisName = users[key].u_id;
        console.log(JSON.stringify(editFormData));
        axios({
            method: "PATCH",
            url: "http://localhost:8000/api/users/"+thisName+'/',
            data: editFormData
          }).then((response)=>{
              setUsers(getDBUsers());
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setEditUserID(null);
        clearError();
    }

    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
        // Create new User object before setting state
        const newEditFormData = {...editFormData};
        newEditFormData[fieldName] = fieldValue;
        // Set state with new User object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.a_flag);
        }
        setEditFormData(newEditFormData);
      }

    const handleEditClick = (key) => {
        setEditUserID(key);
        setEditFormData(users[key]);
    }
    const handleCancelClick = () => {
        setEditUserID(null);
        setEditFormData(null);
    }

    if (users === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Password</th>
                        <th>User Level</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each User in Users.*/}
                    {users.map((user, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this User is the one to be edited, show an editable row instead
                                editUserID === thisKey 
                                        ? <EditableUserRow thisKey={thisKey} editFormData={editFormData} updateUser={updateUser} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                        : <UserRow thisKey={thisKey} user={user} deleteUser={deleteUser} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* If the list is empty display EmptyTableMessage */}
                    {users.length < 1 ? handleError('empty') : null}
                </tbody>
            </table>
            <h3>Add A User</h3>
            <UserForm addUser={addUser}></UserForm>
            <button onClick={postDBUsers}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}