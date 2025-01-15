import AllergiesList from './AllergiesList.js'
import React from 'react'

import {TableRow, TableCell, Input, Button} from '@mui/material'

// Editable Household Row
// Takes: key of current row, the state of the Household Page's editFormData, updateHousehold callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable household table row component
const EditableHouseholdRow = (props) => {
    const {thisKey, editFormData, updateHousehold, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const hh = editFormData;
    const key = thisKey;

    return (
        <TableRow key={key} sx={{ '&:last-child TableCell, &:last-child th': { border: 0 } }}>
            <TableCell align='right'><Input type="text" name="hh_name" defaultValue={hh.hh_name} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input type="number" name="num_adult" defaultValue={hh.num_adult} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input type="number" name="num_child_lt_6" defaultValue={hh.num_child_lt_6} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input type="number" name="num_child_gt_6" defaultValue={hh.num_child_gt_6} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='veg_flag' type="checkbox" checked={hh.veg_flag} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='gf_flag' type='checkbox' checked={hh.gf_flag} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='a_flag' type='checkbox' checked={hh.a_flag} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='sms_flag' type='checkbox' checked={hh.sms_flag} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='ppMealKit_flag' type='checkbox' checked={false} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='childrenSnacks_flag' type='checkbox' checked={false} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='foodBox_flag' type='checkbox' checked={false} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='rteMeal_flag' type='checkbox' checked={false} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='paused_flag' type='checkbox' checked={hh.paused_flag} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='phone' type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' minLength='12' maxLength='12' defaultValue={hh.phone} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='sTableRoweet' type='text' defaultValue={hh.sTableRoweet} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='city' type='text' defaultValue={hh.city} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='pcode' type='number' minLength='5' maxLength='5' defaultValue={hh.pcode} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><Input name='state' type='text' minLength='2' maxLength='2' defaultValue={hh.state} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><textarea name='delivery_notes' defaultValue={hh.delivery_notes} onChange={handleEditFormChange}/></TableCell>
            <TableCell align='right'><AllergiesList allergies={hh.hh_allergies} isEditable={true} updateAllergies={updateAllergies} updateEditForm={updateEditForm}/></TableCell>
            <TableCell align='right'><Button type='Submit' onClick={()=>{updateHousehold(key)}}>Save</Button></TableCell>
            <TableCell align='right'><Button onClick={handleCancelClick}>Cancel</Button></TableCell>
        </TableRow>
    )
}

export default EditableHouseholdRow;