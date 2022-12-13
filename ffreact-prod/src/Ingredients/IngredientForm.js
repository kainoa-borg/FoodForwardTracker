import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm.js'

// Kainoa Borges

// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const IngredientForm = (props) => {

  const supplierList = props.suppliers;
  
  const clearIngredient = () => {
    return {
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
  }
  }

  // The state of this Ingredient Form with each attribute of Ingredient
  const [ingredient, setIngredient] = useState(clearIngredient());

    // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass ingredient object to IngredientList callback
      props.addIngredient(ingredient)
      // Clear the form state
      setIngredient(clearIngredient());
    }

    const updateEditForm = (names, values) => {
      const newIngredient = {...ingredient};
      for (let i = 0; i < names.length; i++) {
        newIngredient[names[i]] = values[i];
      }
      setIngredient(newIngredient);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new ingredient object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
          {/* Basic ingredient info */}
          <label htmlFor="ingredient_name">Ingredient Name: </label>
          <input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleFormChange}/>
          
          <label htmlFor='pkg_type'>Package Type: </label>
          <input name='pkg_type' type="text" value={ingredient.pkg_type} onChange={handleFormChange}/>
          
          <label htmlFor='storage_type'>Storage Type: </label>
          <input name='storage_type' type="text" value={ingredient.storage_type} onChange={handleFormChange}/>
          
          <label htmlFor="in_date">In Date: </label>
          <input name="in_date" type="date" value={ingredient.in_date} onChange={handleFormChange}/>

          <label htmlFor="in_qty">In Quantity: </label>
          <input name="in_qty" type="number" value={ingredient.in_qty} onChange={handleFormChange}/>

          <label htmlFor="unit">Unit: </label>
          <input name="unit" type="text" value={ingredient.unit} onChange={handleFormChange}/>

          <label htmlFor="exp_date">Exp Date: </label>
          <input name="exp_date" type="date" value={ingredient.exp_date} onChange={handleFormChange}/>

          <label htmlFor="unit_cost">Unit Cost: </label>
          <input name="unit_cost" type="number" step="0.01" value={ingredient.unit_cost} onChange={handleFormChange}/>

          <label htmlFor="flat_fee">Flat Fee: </label>
          <input name="flat_fee" type="number" step="0.01" value={ingredient.flat_fee} onChange={handleFormChange}/>

          <label htmlFor="isupplier">Supplier: </label>
          <select name="isupplier_id" onChange={handleFormChange}>
            <option selected={true} value={null}>N/A</option>
            {/* Get supplier_name from  */}
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              )
            })}
          </select>

          <label htmlFor="pref_isupplier"> Preferred Supplier: </label>
          <select name="pref_isupplier_id">
            <option selected={true} value={null}>N/A</option>
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              );
            })}
          </select>

          <br /><button type='Submit'>Add</button>
      </form>
    );
}

export default IngredientForm