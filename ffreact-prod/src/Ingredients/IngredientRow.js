import React from 'react'

// Ingredient Row component
// Takes: key of current row, the state of the Ingredient Page's ingredient list, deleteIngredient callback, handleEditClick callback
// Returns a Ingredient table row component 
const IngredientRow = (props) => {
    const {thisKey, ingredient, deleteIngredient, handleEditClick} = props;
    const key = thisKey;
    const ing = ingredient;

    const IngUsageTable = (props) => {
        const ing_usages = props.ingredient_usages
        if (ing_usages) {
            // console.log(JSON.stringify(this_ing.usages))
            if (ing_usages.length > 0) {
                return (
                    <table>
                            <th>used date</th>
                            <th>used qty</th>
                        {ing_usages.map((usage, key) => {
                            return (
                                <tr>
                                    <td>{usage.used_date}</td>
                                    <td>{usage.used_qty}</td>
                                </tr>
                                )
                            })
                        }
                    </table>
                )
            }
        }
        else {
            return
        }
    }
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{ing.ingredient_name}</td>
            <td>{ing.pkg_type}</td>
            <td>{ing.storage_type}</td>
            <td>{String(ing.in_date)}</td>
            <td>{String(ing.in_qty)}</td>
            <td>{ing.exp_date}</td>
            <td>
                <IngUsageTable ingredient_usages={ing.ingredient_usage}/>
            </td>
            <td>{ing.qty_on_hand}</td>
            <td>{String(ing.unit)}</td>
            <td>{String(ing.unit_cost)}</td>
            <td>{String(ing.flat_fee)}</td>
            <td>{ing.isupplier ? ing.isupplier.s_name : 'N/A'}</td>
            <td>{ing.pref_isupplier ? ing.pref_isupplier.s_name : 'N/A'}</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteIngredient is called with this row's key */}
            <td><button onClick={() => deleteIngredient(key)}>Delete</button></td>
        </tr>
    )
}

export default IngredientRow;