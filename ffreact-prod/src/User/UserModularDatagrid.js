import React from 'react'
import { useGridApiContext, gridClasses} from '@mui/x-data-grid'
import './UserList.css'
import { Box } from '@mui/material'
import ModularDatagrid from '../components/ModularDatagrid';

// Packaging List Component
export default function UserModularDatagrid() {
    const columns = [
        { field: 'username', headerName: 'User Name', type: 'string', width: 200, editable: true },
        { field: 'password', headerName: 'Password', type: 'password', width: 100, editable: true, 
          renderCell: (cellValues) => {
          return (
            <text>*****</text>
          );
        } },
        { field: 'admin_flag', headerName: 'Administrator', type: 'boolean', width: 100, editable: true },
        { field: 'email', headerName: 'Email', type: 'email', width: 200, editable: true },
    ]
    
    return(
        <div class='table-div'>
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
