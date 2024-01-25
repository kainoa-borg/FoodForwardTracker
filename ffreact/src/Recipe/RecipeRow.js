import React from 'react'

// Recipe Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a Recipe table row component 
const RecipeRow = (props) => {
    const {thisKey, recipe, deleteRecipe, handleEditClick} = props;
    const key = thisKey;
    const r = recipe;
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{r.r_num}</td>
            <td>{r.r_name}</td>
            <td>{r.ri_id}</td>
            <td>{r.amt}</td>
            <td>{r.unit}</td>
            <td>{r.prep}</td>
            <td>{r.ri_ing}</td>
            <td>{String(r.ri_recipe_num)}</td>
            <td>{r.inst_id}</td>
            <td>{r.ri_id}</td>
            <td>{r.step_no}</td>
            <td>{r.step_inst}</td>
            <td>{r.stn_name}</td>
            <td>{r.inst_recipe_num}</td>
            <td>placeholder</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteRecipe is called with this row's key */}
            <td><button onClick={() => deleteRecipe(key)}>Delete</button></td>
        </tr>
    )
}

export default RecipeRow;
