import React, { useState, useEffect} from 'react'
import axios from 'axios'
import {DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { wait } from '@testing-library/user-event/dist/utils'
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
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);
    const [editFormData, setEditFormData] = useState({ u_id: 0, username: "", password: "", admin_flag: 0, email: "" });
    const columns = [
        { field: 'username', headerName: 'User Name', width: 200, editable: true },
        { field: 'password', headerName: 'Password', width: 200, editable: true },
        { field: 'admin_flag', headerName: 'User Level', type: 'boolean', width: 100, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        { field: 'actions', headerName: 'Actions', width: 150, editable: true },
    ]

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="User Name already found!"/>
            )
        }
        if (errCode = 'empty') {
            setErrorComponent(
                <Error text="There doesn't seem to be any data!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        setUsers(getDBUsers());
    }, []);

    const addUser = (user) => {
        console.log(JSON.stringify(user));
        // Check to see if we already have a duplicate User Name
        if (!users.find((U) => U.username === user.username))
        {
            axios({
                method: "POST",
                url: "http://4.236.185.213:8000/api/users/",
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

    const getDBUsers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/users"
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

    const postDBUser = () => {
        console.log(users);
        axios({
            method: "POST",
            url: "http://4.236.185.213:8000/api/users/",
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

    const deleteUser = (key) => {
        const userID = key; 
        axios({
            method: "DELETE",
            url: "http://4.236.185.213:8000/api/users/" + users[key].u_id,
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
            url: "http://4.236.185.213:8000/api/users/"+thisName+'/',
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
    const handleRowClick = (params) => {
        getDBUsers(params.row.u_id);
        wait(300);
        console.log(users);
    }

    if (users === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        <div className='table-div'>
        <h3>Administration</h3>
        <Box sx={{height: '80vh'}}>
        <DataGrid 
            components={{ Toolbar: GridToolbar }}
            onRowClick={handleRowClick} 
            rows={users} 
            columns={columns} 
            getRowId={(row) => row.u_id}
            pageSize={10}
            //rowsPerPageOptions={[7]}
            //checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        {loadingComponent}
        <UserForm addUser={addUser}/>
        {errorComponent}
        {displayMsgComponent}
        </div>
    )
}