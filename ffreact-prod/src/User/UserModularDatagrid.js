import React from 'react'
import { useGridApiContext, gridClasses} from '@mui/x-data-grid'
import './UserList.css'
import { Box } from '@mui/material'
import ModularDatagrid from '../components/ModularDatagrid';

// Packaging List Component
export default function UserModularDatagrid() {
    const columns = [
        { field: 'u_id', headerName: 'ID', type: 'number', width: 50, editable: true },
        { field: 'username', headerName: 'User Name', type: 'string', width: 100, editable: true },
        { field: 'password', headerName: 'Password', type: 'password', width: 50, editable: true },
        { field: 'admin_flag', headerName: 'User Level', type: 'boolean', width: 50, editable: true },
        { field: 'email', headerName: 'Email', type: 'email', width: 110, editable: true },
        { field: 'actions', headerName: 'Actions', type: 'string', width: 150, editable: true },
    ]
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80vh'}}>
            <ModularDatagrid columns={columns} getRowHeight={() => 'auto'} sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }} getEstimatedRowHeight={() => 300} keyFieldName={'u_id'} apiEndpoint={'users'}></ModularDatagrid>
        </Box>
        </div>
    )
}
