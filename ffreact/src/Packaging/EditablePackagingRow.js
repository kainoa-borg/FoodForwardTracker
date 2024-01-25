import React from 'react'
import EditablePkgUsageTable from '../Packaging/EditablePkgUsageTable.js'

// Editable Packaging Row
// Takes: key of current row, the state of the Packaging Page's editFormData, updatePackaging callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable packaging table row component
const EditablePackagingRow = (props) => {
    const {thisKey, editFormData, suppliers, updatePackaging, handleEditFormChange, handleCancelClick, updateEditForm} = props
    const pkg = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>          
          <td><input name='packaging_type' type="text" maxLength='30' value={pkg.package_type} onChange={handleEditFormChange}/></td>
          
          <td><input name='returnable' type="checkbox" checked={Boolean(pkg.returnable)} onChange={handleEditFormChange}/></td>
          
          <td><input name='unit_qty' type="number" value={pkg.unit_qty} onChange={handleEditFormChange}/></td>

          <td><input name="unit" type="text" value={pkg.unit} onChange={handleEditFormChange}/></td>

          <td><input name='qty_holds' type="number" value={pkg.qty_holds} onChange={handleEditFormChange}/></td>

          <td><input name="in_date" type="date" value={pkg.in_date} onChange={handleEditFormChange}/></td>

          <td><input name="in_qty" type="number" value={pkg.in_qty} onChange={handleEditFormChange}/></td>

          <EditablePkgUsageTable editFormData={editFormData} updateEditForm={updateEditForm} packaging_usage={pkg.packaging_usage}/>

          <td></td>

          <td><input name="unit_cost" type="number" step="0.01" value={pkg.unit_cost} onChange={handleEditFormChange}/></td>

          <td><input name="flat_fee" type="number" step="0.01" value={pkg.flat_fee} onChange={handleEditFormChange}/></td>

          <td>
            <select name="psupplier_id" onChange={handleEditFormChange}>
              <option defaultValue={true} value={null}>N/A</option>
              {suppliers.map((supplier, key) => {
                const thisKey = key;
                const isSelected = (suppliers[thisKey].s_id === pkg.psupplier_id)
                return(
                  <option defaultValue={isSelected} value={supplier.s_id}>{supplier.s_name}</option>
                )
              })}  
            </select>
          </td>

          <td>
            <select name="pref_psupplier_id" onChange={handleEditFormChange}>
              <option defaultValue={true} value={null}>N/A</option>
              {suppliers.map((supplier, key) => {
                const thisKey = key;
                const isSelected = (suppliers[thisKey].s_id === pkg.pref_psupplier_id)
                return(
                  <option defaultValue={isSelected} value={supplier.s_id}>{supplier.s_name}</option>
                )
              })}  
            </select>
          </td>

          <td><button onClick={()=>{updatePackaging(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditablePackagingRow;