import React from 'react'

// Editable Household Row
// Takes: key of current row, the state of the Household Page's editFormData, updateHousehold callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable household table row component
const EditableIngredientRow = (props) => {
    const {thisKey, editFormData, updateIngredient, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const ingredient = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
          <td>{ingredient.i_id}</td>
          <td><input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleEditFormChange}/></td>
          
          <td><input name='pkg_type' type="text" value={ingredient.pkg_type} onChange={handleEditFormChange}/></td>
          
          <td><input name='storage_type' type="text" value={ingredient.storage_type} onChange={handleEditFormChange}/></td>
          
          <td><input name="in_date" type="date" placeholder={ingredient.in_date} value={ingredient.in_date} onChange={handleEditFormChange}/></td>

          <td><input name="in_qty" type="number" value={ingredient.in_qty} onChange={handleEditFormChange}/></td>

          <td>placeholder</td>

          <td><input name="unit" type="text" value={ingredient.unit} onChange={handleEditFormChange}/></td>

          <td><input name="exp_date" type="date" value={ingredient.exp_date} onChange={handleEditFormChange}/></td>

          <td><input name="unit_cost" type="number" step="0.01" value={ingredient.unit_cost} onChange={handleEditFormChange}/></td>

          <td><input name="flat_fee" type="number" step="0.01" value={ingredient.flat_fee} onChange={handleEditFormChange}/></td>

          <td><input name="exp_date" type="date" value={ingredient.exp_date} onChange={handleEditFormChange}/></td>

          <td><button onClick={()=>{updateIngredient(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableIngredientRow;