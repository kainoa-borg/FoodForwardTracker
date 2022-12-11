import React from 'react'

// Editable Meal Plan Row
// Takes: key of current row, the state of the Meal Plans Page's editFormData, updateMealPlan callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable Meal Plan table row component
const EditableMealRow = (props) => {
    const {thisKey, editFormData, updateMeal, handleEditFormChange, handleCancelClick, updateAllergies, updateEditForm} = props
    const meal = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
          <td>{meal.i_id}</td>
          <td><input name="meal_name" type="text" maxLength='30' value={meal.ingredient_name} onChange={handleEditFormChange}/></td>
          
          <td><input name='snack_name' type="text" value={meal.pkg_type} onChange={handleEditFormChange}/></td>
          
          <td><input name="m_date" type="date" placeholder={meal.in_date} value={meal.in_date} onChange={handleEditFormChange}/></td>

          <td><input name="num_servings" type="number" value={meal.in_qty} onChange={handleEditFormChange}/></td>

          <td>placeholder</td>

          <td><button onClick={()=>{updateMeal(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableMealRow;
