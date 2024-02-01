import React from 'react'
import EditableIngUsageTable from '../Ingredients/EditableIngUsageTable.js'

// Editable Ingredients Row
// Takes: key of current row, the state of the Ingredients Page's editFormData, updateIngredients callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable ingredients table row component
const EditableIngredientRow = (props) => {
    const {thisKey, editFormData, suppliers, updateIngredient, handleEditFormChange, handleCancelClick, updateEditForm} = props
    const ingredient = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
          <td><input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleEditFormChange}/></td>
          
          <td><input name='pkg_type' type="text" maxLength='30' value={ingredient.pkg_type} onChange={handleEditFormChange}/></td>
          
          <td><input name='storage_type' type="text" maxLength='30' value={ingredient.storage_type} onChange={handleEditFormChange}/></td>
          
          <td><input name="in_date" type="date" value={ingredient.in_date} onChange={handleEditFormChange}/></td>

          <td><input name="in_qty" type="number" value={ingredient.in_qty} onChange={handleEditFormChange}/></td>

          <td><input name="exp_date" type="date" value={ingredient.exp_date} onChange={handleEditFormChange}/></td>

          <EditableIngUsageTable editFormData={editFormData} updateEditForm={updateEditForm} ingredient_usage={ingredient.ingredient_usage}/>

          <td></td>

          <td><input name="unit" type="text" value={ingredient.unit} onChange={handleEditFormChange}/></td>

          <td><input name="unit_cost" type="number" step="0.01" value={ingredient.unit_cost} onChange={handleEditFormChange}/></td>

          <td><input name="flat_fee" type="number" step="0.01" value={ingredient.flat_fee} onChange={handleEditFormChange}/></td>

          <td>
            <select name="isupplier_id" onChange={handleEditFormChange}>
              <option selected={true} value={null}>N/A</option>
              {suppliers.map((supplier, key) => {
                const thisKey = key;
                const isSelected = (suppliers[thisKey].s_id === ingredient.isupplier_id)
                return(
                  <option selected={isSelected} value={supplier.s_id}>{supplier.s_name}</option>
                )
              })}  
            </select>
          </td>

          <td>
            <select name="pref_isupplier_id" onChange={handleEditFormChange}>
              <option selected={true} value={null}>N/A</option>
              {suppliers.map((supplier, key) => {
                const thisKey = key;
                const isSelected = (suppliers[thisKey].s_id === ingredient.pref_isupplier_id)
                return(
                  <option selected={isSelected} value={supplier.s_id}>{supplier.s_name}</option>
                )
              })}  
            </select>
          </td>

          <td><button onClick={()=>{updateIngredient(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableIngredientRow;