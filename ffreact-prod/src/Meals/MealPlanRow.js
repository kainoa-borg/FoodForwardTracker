import React from 'react'

// Meal Plan Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a MealPlan table row component 
const MealPlanRow = (props) => {
    const {thisKey, meals, deleteMeal, handleEditClick} = props;
    const key = thisKey;
    const meal = meals;
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{meal.m_id}</td>
            <td>{meal.meal_r_num}</td>
            <td>{meal.snack_r_num}</td>
            <td>{String(meal.num_servings)}</td>
            <td>{meal.m_date}</td>
            <td>placeholder</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteIngredient is called with this row's key */}
            <td><button onClick={() => deleteMeal(key)}>Delete</button></td>
        </tr>
    )
}

export default MealPlanRow;
