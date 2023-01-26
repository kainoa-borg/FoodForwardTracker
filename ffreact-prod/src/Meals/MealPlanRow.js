import React from 'react'

// Meal Plan Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a MealPlan table row component 
const MealPlanRow = (props) => {
    const {thisKey, meal, recipeList, deleteMeal, handleEditClick} = props;
    const key = thisKey;
    const m = meal;
    let meal_name = recipeList.find(r => r.r_num === m.meal_r_num)
    let snack_name = recipeList.find(r => r.r_num === m.snack_r_num)

    if (meal_name) meal_name=meal_name.r_name
    if (snack_name) snack_name=snack_name.r_name

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{m.m_date}</td>
            <td>{meal_name}</td>
            <td>{m.meal_servings}</td>
            <td>{snack_name}</td>
            <td>{m.snack_servings}</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteIngredient is called with this row's key */}
            <td><button onClick={() => deleteMeal(key)}>Delete</button></td>
        </tr>
    )
}

export default MealPlanRow;
