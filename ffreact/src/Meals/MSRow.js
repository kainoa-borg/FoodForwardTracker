import React from 'react'

// Meal Plan Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a MealPlan table row component 
const MSRow = (props) => {
    const {thisKey, meal, recipeList, deleteMeal, handleEditClick} = props;
    const key = thisKey;
    const m = meal;
    let meal_name = recipeList.find(r => r.r_num === m.meal_r_num)
    let m_latest = recipeList.find(r => r.r_num === m.meal_r_num)
    let snack_name = recipeList.find(r => r.r_num === m.snack_r_num)
    let s_latest = recipeList.find(r => r.r_num === m.snack_r_num)
    

    if (meal_name) {
        meal_name=meal_name.r_name
        m_latest=meal_name.m_date
    }
    if (snack_name) {
        snack_name=snack_name.r_name
        s_latest=meal_name.m_date
    }

    if (m.m_s=0) {
        return (
        <tr key={key}>
            <td>{m.m_s}</td>
            <td>{meal_name}</td>
            <td>{m.m_date}</td>
            <td>{m_latest}</td>
            </tr>
        )
    }
    if (m.m_s=1) {
        return (
        <tr key={key}>
            <td>{m.m_s}</td>
            <td>{snack_name}</td>
            <td>{m.m_date}</td>
            <td>{s_latest}</td>
        </tr>
        )
    }
}

export default MSRow;
