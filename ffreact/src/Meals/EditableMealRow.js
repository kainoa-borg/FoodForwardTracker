import React from 'react'

// Editable Meal Plan Row
// Takes: key of current row, the state of the Meal Plans Page's editFormData, updateMealPlan callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable Meal Plan table row component
const EditableMealRow = (props) => {
    const {thisKey, editFormData, recipeList, updateMeal, handleEditFormChange, handleCancelClick } = props
    const meal = editFormData;
    const key = thisKey;

    // HTML structure of this component
    return (
        <tr key={key}>
          <td><input name="m_date" type="date" placeholder={meal.m_date} value={meal.m_date} onChange={handleEditFormChange}/></td>

          <td>
            <select name="meal_r_num" onChange={handleEditFormChange}>
              {recipeList.map((recipe) => {
                if (recipe.r_num === meal.meal_r_num) return (<option value={recipe.r_num} selected>{recipe.r_name}</option>)
                else return (<option value={recipe.r_num}>{recipe.r_name}</option>)
              })}  
            </select>
          </td>

          <td><input name="meal_servings" type="number" value={meal.meal_servings} onChange={handleEditFormChange}/></td>
          
          <td>
            <select name="snack_r_num" onChange={handleEditFormChange}>
              {recipeList.map((recipe) => {
                if (recipe.r_num === meal.snack_r_num) return (<option value={recipe.r_num} selected>{recipe.r_name}</option>)
                else return (<option value={recipe.r_num}>{recipe.r_name}</option>)
              })}  
            </select>
          </td>
          
          <td><input name="snack_servings" type="number" value={meal.snack_servings} onChange={handleEditFormChange}/></td>

          <td><button onClick={()=>{updateMeal(key)}}>Save</button></td>
          <td><button onClick={handleCancelClick}>Cancel</button></td>
        </tr>
    )
}

export default EditableMealRow;
