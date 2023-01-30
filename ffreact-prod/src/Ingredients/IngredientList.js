import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import IngredientForm from './IngredientForm.js'
import EditableIngredientRow from './EditableIngredientRow.js'
import IngredientRow from './IngredientRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './IngredientList.css'


// Ingredient List Component
export default function IngredientList() {
    const [ingredients, setIngredients] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [editIngredientID, setEditIngredientID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        i_id: null,
        ingredient_name: "",
        pkg_type: "",
        storage_type: "",
        in_date: null,
        in_qty: null,
        ingredient_usage: [],
        qty_on_hand: null,
        unit: "",
        exp_date: null,
        unit_cost: null,
        flat_fee: null,
        isupplier_id: null,
        pref_isupplier_id: null
    });
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Ingredient ID already found!"/>
            )
        } 
        else if (errCode === 'empty') {
            setErrorComponent(
                <Error text="There doesn't seem to be any data!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        getDBIngredients();
        getDBSuppliers();
    }, []);

    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://localhost:8000/api/suppliers"
          }).then((response)=>{
            setSuppliers(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const getDBIngredients = () => {
        console.log("MAKING REQUEST TO DJANGO")
        setLoadingComponent(<Error text="LOADING DATA..."/>);
        axios({
            method: "GET",
            url:"http://localhost:8000/api/ingredient-inventory"
          }).then((response)=>{
            const ingData = response.data
            setIngredients(ingData);
            setLoadingComponent(null);
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

    const addIngredient = (ingredient) => {
        const lastID = ingredients[ingredients.length - 1]['i_id'];
        ingredient['i_id'] = lastID + 1;
        axios({
            method: "POST",
            url:"http://localhost:8000/api/ingredient-inventory/",
            data: ingredient
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
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
        const ingID = ingredients[key]['i_id']; 
        axios({
            method: "DELETE",
            url:"http://localhost:8000/api/ingredient-inventory/"+ingID+'/',
          }).then((response)=>{
            getDBIngredients();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const updateIngredient = (key) => {
        let thisID = ingredients[key]['i_id'];
        if (ingredients.find((ing) => ing.i_id === thisID))
        {
            setEditIngredientID(null);
            axios({
                method: "PATCH",
                url:"http://localhost:8000/api/ingredient-inventory/"+thisID+'/',
                data: editFormData
              }).then((response)=>{
                getDBIngredients();
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  }
              });
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
    const updateEditForm = (name, value) => {
        const newEditFormData = {...editFormData};
        newEditFormData[name] = value;
        setEditFormData(newEditFormData);
        console.log(editFormData);
      }

    const handleEditClick = (key) => {
        setEditIngredientID(key);
        setEditFormData(ingredients[key]);
    }
    const handleCancelClick = () => {
        setEditIngredientID(null);
        setEditFormData(null);
    }

    if (ingredients === undefined || suppliers === undefined) {
        return (<>loading</>)
    }
    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>Ingredient Name</th>
                        <th>Package Type</th>
                        <th>Storage Type</th>
                        <th>Date In</th>
                        <th>Qty In</th>
                        <th>Expiration Date</th>
                        <th>Usages</th>
                        <th>Qty On Hand</th>
                        <th>Unit</th>
                        <th>Unit Cost</th>
                        <th>Flat Fee</th>
                        <th>Supplier</th>
                        <th>Preferred Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each ingredient in ingredients.*/}
                    {ingredients.map((ingredient, key) => {
                        const thisKey = key;
                        return(
                            <Fragment key={thisKey}>
                                {
                                // If this ingredient is the one to be edited, show an editable row instead
                                editIngredientID === thisKey 
                                ? <EditableIngredientRow thisKey={thisKey} editFormData={editFormData} suppliers={suppliers} updateIngredient={updateIngredient} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <IngredientRow thisKey={thisKey} ingredient={ingredient} deleteIngredient={deleteIngredient} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* {ingredients.length < 1 ? handleError('empty') : null} */}
                </tbody>
            </table>
            {loadingComponent}
            <h3>Add An Ingredient</h3>
            <IngredientForm addIngredient={addIngredient} suppliers={suppliers}></IngredientForm>
            <button onClick={postDBIngredients}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}