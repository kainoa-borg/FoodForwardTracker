import React from 'react'
import { Box } from '@mui/material'
import NewModularDatagrid from '../components/NewModularDatagrid.js'
import UserForm from './UserForm.js'

// User List Component
export default function UserList() {
 
    const columns = [
        { field: 'username', headerName: 'User Name', type: 'string', width: 200, editable: true },
        { field: 'password', headerName: 'Password', type: 'password', width: 100, editable: true, 
          renderCell: (cellValues) => {
          return (<text>*****</text>);} },
        { field: 'admin_flag', headerName: 'Administrator', type: 'boolean', width: 100, editable: true },
        { field: 'email', headerName: 'Email', type: 'email', width: 200, editable: true },
    ]

    return (
        <div class='table-div'>
        <h3>Administration</h3>
        <Box sx={{height: '80vh'}}>
            <NewModularDatagrid 
              columns={columns} 
              getRowHeight={() => 'auto'} 
              getEstimatedRowHeight={() => 300} 
              keyFieldName={'u_id'} 
              apiEndpoint={'users'}
              entryName={'User'}
              searchField={'username'}
              AddFormComponent={UserForm}>
            </NewModularDatagrid>
        </Box>
        </div>
    )
}