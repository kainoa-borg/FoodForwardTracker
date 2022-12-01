import React, {Fragment, useState} from 'react'
import axios from 'axios'
import IngredientForm from './IngredientForm.js'
import EditableIngredientRow from './EditableIngredientRow.js'
import IngredientRow from './IngredientRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import ReusableTable from '../ReusableTable.js'

import './IngredientList.css'


// Ingredient List Component
export default function IngredientList() {
    const data = [
        {i_id: 1, ingredient_name: 'Lasagna Noodles', pkg_type: 'DRY-BAG', storage_type: 'N/A', in_date: '11/20/22', in_qty: 10, unit: 'lbs', exp_date: '11-20-24', qty_on_hand: 10, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: []},
        {i_id: 2, ingredient_name: 'Ground Beef', pkg_type: 'FROZEN', storage_type: 'N/A', in_date: '11/11/22', in_qty: 2, unit: 'lbs', exp_date: '12-7-22', qty_on_hand: 2, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: []},
        {i_id: 3, ingredient_name: 'Ground Beef', pkg_type: 'FROZEN', storage_type: 'N/A', in_date: '11/20/22', in_qty: 5, unit: 'lbs', exp_date: '12-7-22', qty_on_hand: 5, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: [{i_usage_id: 1, used_date: '11/29/22', used_qty: 2}]}
    ]

    const [ingredients, setIngredients] = useState(data);
    const [editIngredientID, setEditIngredientID] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const getDBIngredients = () => {
        axios({
            method: "GET",
            url:"/ingredients/"
          }).then((response)=>{
            const ingData = response.data
            setIngredients(ingData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const postDBIngredients = () => {
        axios({
            method: "POST",
            url:"/ingredients/",
            data: ingredients
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Ingredient ID already found!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    const addIngredient = (ingredient) => {
        const lastID = ingredients[ingredients.length - 1]['i_id'];
        ingredient['i_id'] = lastID + 1;
        let newIngredients = [...ingredients, ingredient];
        setIngredients(newIngredients);
        clearError();
        // Check to see if we already have a duplicate Ingredient Name
        // if (!ingredients.find((ing) => ing.i_id === ing.i_id))
        // {
        //     let newIngredients = [...ingredients, ingredient];
        //     setIngredients(newIngredients);
        //     clearError();
        // }
        // else {
        //     // If this ingredient is already in ingredients list, display error message
        //     handleError('DuplicateKey');
        // }
    }

    const deleteIngredient = (key) => {
        const ingID = key; 
        let newIngredients = [...ingredients];
        newIngredients.splice(ingID, 1);
        setIngredients(newIngredients);
    }

    const updateIngredient = (key) => {
        let thisID = ingredients[key]['i_id'];
        if (ingredients.find((ing) => ing.i_id === thisID))
        {
            let newIngredients = [...ingredients];
            newIngredients[key] = editFormData;
            setEditIngredientID(null);
            setIngredients(newIngredients)
            clearError();
        }
        else {
            // If this Ingredient is already in ingredients list, display error message
            handleError('DuplicateKey');
        }
        
    }

    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new Ingredient object before setting state
        const newEditFormData = {...editFormData};
        newEditFormData[fieldName] = fieldValue;
        // Set state with new ingredient object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.aFlag);
        }
        setEditFormData(newEditFormData);
      }

    const handleEditClick = (key) => {
        setEditIngredientID(key);
        setEditFormData(ingredients[key]);
    }
    const handleCancelClick = () => {
        setEditIngredientID(null);
        setEditFormData(null);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ingredient Name</th>
                        <th>Package Type</th>
                        <th>Storage Type</th>
                        <th>Date In</th>
                        <th>Qty In</th>
                        <th>Usages</th>
                        <th>Qty On Hand</th>
                        <th>Unit</th>
                        <th>Unit Cost</th>
                        <th>Flat Fee</th>
                        <th>Expiration Date</th>
                        <th>Supplier</th>
                        <th>Preferred Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each ingredient in ingredients.*/}
                    {ingredients.map((ingredient, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this ingredient is the one to be edited, show an editable row instead
                                editIngredientID === thisKey 
                                ? <EditableIngredientRow thisKey={thisKey} editFormData={editFormData} updateIngredient={updateIngredient} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <IngredientRow thisKey={thisKey} ingredient={ingredient} deleteIngredient={deleteIngredient} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            <h3>Add An Ingredient</h3>
            <IngredientForm addIngredient={addIngredient}></IngredientForm>
            <button onClick={postDBIngredients}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}