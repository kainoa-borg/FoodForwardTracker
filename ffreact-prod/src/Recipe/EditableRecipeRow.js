import React from 'react'

// Editable Meal Plan Row
// Takes: key of current row, the state of the Meal Plans Page's editFormData, updateMealPlan callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable Meal Plan table row component
const EditableRecipeRow = (props) => {
    const {thisKey, editFormData, updateRecipe, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const recipe = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
          <td>{recipe.i_id}</td>
          <td><input name="meal_name" type="text" maxLength='30' value={recipe.meal_name} onChange={handleEditFormChange}/></td>
          
          <td><input name='snack_name' type="text" value={recipe.snack_name} onChange={handleEditFormChange}/></td>
          
          <td><input name="m_date" type="date" placeholder={recipe.m_date} value={recipe.m_date} onChange={handleEditFormChange}/></td>

          <td><input name="num_servings" type="number" value={recipe.num_servings} onChange={handleEditFormChange}/></td>

          <td>placeholder</td>

          <td><button onClick={()=>{updateRecipe(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableRecipeRow;