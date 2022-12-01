import React from 'react'

// Ingredient Row component
// Takes: key of current row, the state of the Ingredient Page's ingredient list, deleteIngredient callback, handleEditClick callback
// Returns a Ingredient table row component 
const IngredientRow = (props) => {
    const {thisKey, ingredient, deleteIngredient, handleEditClick} = props;
    const key = thisKey;
    const ing = ingredient;
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{ing.i_id}</td>
            <td>{ing.ingredient_name}</td>
            <td>{ing.pkg_type}</td>
            <td>{ing.storage_type}</td>
            <td>{String(ing.in_date)}</td>
            <td>{String(ing.in_qty)}</td>
            <td>placeholder</td>
            <td>{ing.qty_on_hand}</td>
            <td>{String(ing.unit)}</td>
            <td>{String(ing.unit_cost)}</td>
            <td>{String(ing.flat_fee)}</td>
            <td>{ing.exp_date}</td>
            <td>{ing.isupplier_name}</td>
            <td>{ing.pref_isupplier_name}</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteIngredient is called with this row's key */}
            <td><button onClick={() => deleteIngredient(key)}>Delete</button></td>
        </tr>
    )
}

export default IngredientRow;