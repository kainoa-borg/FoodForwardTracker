import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm.js'

// Sabona Abubeker

// Neal Plan Form component
// Takes AddMeal callback function
// Returns a form that can be used to define a new meal object in a mealList
const MealPlanForm = (props) => {
  
  const clearMeal = () => {
    return {
      m_id: null,
      m_date: '',
      snack_r_num: null,
      meal_r_num: null,
      num_servings: null
    }
  }

  // The state of this Meal Plan Form with each attribute of Meals
  const [meal, setMeal] = useState(clearMeal());
  //const [mealList, setMealList] = useState([{m_id: 1, meal_r_num: 'Meal Name'}, {m_id: 2, meal_r_num: 'Meal Name'}]);

    // Handle form submission (prevent refresh, pass ingredient to addMeal, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass Meal object to MealList callback
      props.addMeal(meal)
      // Clear the form state
      setMeal(clearMeal());
    }

    const updateEditForm = (names, values) => {
      const newMeal = {...meal};
      for (let i = 0; i < names.length; i++) {
        newMeal[names[i]] = values[i];
        console.log('(' + names[i] + ', ' + values[i] + ')');
      }
      setMeal(newMeal);
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
          {/* Basic Meal Plan info */}
          <label htmlFor="m_date">Meal Name ID temp: </label>
          <input name="m_date" type="text" maxLength='50' value={meal.m_date} onChange={handleFormChange}/>
          
          <label htmlFor='snack_r_num'>Snack Number: </label>
          <input name='snack_r_num' type="number" value={meal.snack_r_num} onChange={handleFormChange}/>
          
          <label htmlFor="meal_r_num">Meal Number: </label>
            <input name="meal_r_num" type="number" value={meal.meal_r_num} onChange={handleFormChange}/>

          <label htmlFor="num_servings">Number of Servings: </label>
            <input name="num_servings" type="number" value={meal.num_servings} onChange={handleFormChange}/>

          <button type='Submit'>Add</button>
      </form>
    );
}

export default MealPlanForm