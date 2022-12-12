import React from 'react'

// Meal Plan Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a MealPlan table row component 
const MealPlanRow = (props) => {
    const {thisKey, meal, deleteMeal, handleEditClick} = props;
    const key = thisKey;
    const m = meal;
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{m.m_id}</td>
            <td>{m.m_date}</td>
            <td>{m.snack_r_num}</td>
            <td>{m.meal_r_num}</td>
            <td>{m.num_servings}</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteIngredient is called with this row's key */}
            <td><button onClick={() => deleteMeal(key)}>Delete</button></td>
        </tr>
    )
}

export default MealPlanRow;
