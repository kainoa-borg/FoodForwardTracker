import React from 'react'

// Recipe Row component
// Takes: key of current row, the state of the Meal Plan Page's meal list, deleteMeal callback, handleEditClick callback
// Returns a Recipe table row component 
const RecipeRow = (props) => {
    const {thisKey, recipes, deleteRecipe, handleEditClick} = props;
    const key = thisKey;
    const recipe = recipes;
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{recipe.r_num}</td>
            <td>{recipe.r_name}</td>
            <td>{recipe.ri_id}</td>
            <td>{recipe.amt}</td>
            <td>{recipe.unit}</td>
            <td>{recipe.prep}</td>
            <td>{recipe.ri_ing}</td>
            <td>{String(recipe.ri_recipe_num)}</td>
            <td>{recipe.inst_id}</td>
            <td>{recipe.ri_id}</td>
            <td>{recipe.step_no}</td>
            <td>{recipe.step_inst}</td>
            <td>{recipe.stn_name}</td>
            <td>{recipe.inst_recipe_num}</td>
            <td>placeholder</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteRecipe is called with this row's key */}
            <td><button onClick={() => deleteRecipe(key)}>Delete</button></td>
        </tr>
    )
}

export default RecipeRow;
