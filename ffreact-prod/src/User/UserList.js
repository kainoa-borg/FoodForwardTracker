import React from 'react'
import { Box, Typography } from '@mui/material'
import NewModularDatagrid from '../components/NewModularDatagrid.js'
import UserForm from './UserForm.js'

// User List Component
export default function UserList(props) {
    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};
 
    const columns = [
        { field: 'username', headerName: 'User Name', type: 'string', width: 200, editable: true },
        { field: 'password', headerName: 'Password', type: 'password', width: 100, editable: true, 
          renderCell: (cellValues) => {
          return (<text>*****</text>);} },
        { field: 'admin_flag', headerName: 'Administrator', type: 'boolean', width: 100, editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'email', headerName: 'Email', type: 'email', width: 200, editable: true },
    ]

    return (
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Administration</Typography>
        <Box sx={{height: '70vh'}}>
            <NewModularDatagrid
              loginState={loginState} 
              columns={columns} 
              getRowHeight={() => 'auto'} 
              getEstimatedRowHeight={() => 300} 
              keyFieldName={'u_id'} 
              apiEndpoint={'users'}
              // apiIP={'localhost'}
              entryName={'User'}
              searchField={'username'}
              searchLabel={'User Names'}
              AddFormComponent={UserForm}>
            </NewModularDatagrid>
        </Box>
        </div>
    )
}