import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm'
// Sabona Abubeker

// Recipe Form component
// Takes AddRecipe callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const RecipeForm = (props) => {
  
  const clearRecipe = () => {
    return {
      r_num: null,
      r_name: "",
      ri_id: '',
      amt: '',
      unit: '',
      prep: '',
      ri_ing: '',
      ri_recipe_num: '',
      inst_id: '',
      step_no: '',
      step_inst: '',
      stn_name: '',
      inst_recipe_num: '',
    }
  }

  // The state of this Recipe Form with each attribute of Recipes
  const [recipe, setRecipe] = useState(clearRecipe());
  const [recipeList, setRecipeList] = useState([{r_num: 1, r_name: 'Recipe Name'}, {r_num: 2, r_name: 'Recipe Name'}]);

    // Handle form submission (prevent refresh, pass Recipe to addRecipe, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass ingredient object to RecipeList callback
      props.addRecipe(recipe)
      // Clear the form state
      setRecipe(clearRecipe());
    }

    const updateEditForm = (names, values) => {
      const newRecipe = {...recipe};
      for (let i = 0; i < names.length; i++) {
        newRecipe[names[i]] = values[i];
        console.log('(' + names[i] + ', ' + values[i] + ')');
      }
      setRecipe(newRecipe);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new Recipe object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
          {/* Basic ingredient info */}
          <label htmlFor="ri_id">Recipe ID: </label>
          <input name="ri_id" type="text" maxLength='300' value={recipe.ri_id} onChange={handleFormChange}/>
          
          <label htmlFor='r_name'>Recipe Name: </label>
          <input name='r_name' type="text" value={recipe.snack_r_num} onChange={handleFormChange}/>
          
          <label htmlFor="m_date">Recipe Date: </label>
          <input name="m_date" type="date" value={recipe.m_date} onChange={handleFormChange}/>

          <label htmlFor="meal_r_num">Recipe Diet: </label>
          <input name="meal_r_num" type="text" value={recipe.in_qty} onChange={handleFormChange}/>

          <label htmlFor="unit">Unit: </label>
          <input name="unit" type="text" value={recipe.unit} onChange={handleFormChange}/>

          <label htmlFor="amount">Amount: </label>
          <input name="amt" type="text" value={recipe.amt} onChange={handleFormChange}/>

          <label htmlFor="prep">Preparation: </label>
          <input name="prep" type="text" value={recipe.prep} onChange={handleFormChange}/>\

          <label htmlFor="ri_ing">Recipe Ingredient: </label>
          <input name="ri_ing" type="text" value={recipe.ri_ing} onChange={handleFormChange}/>

          <label htmlFor="ri_recipe_num">Recipe Ingredient Number: </label>
          <input name="ri_recipe_num" type="ri_recipe_num" value={recipe.ri_recipe_num} onChange={handleFormChange}/>

          <label htmlFor="inst_id">Instructions: </label>
          <input name="inst_id" type="text" value={recipe.inst_id} onChange={handleFormChange}/>

          <label htmlFor="step_no">Steps: </label>
          <input name="step_no" type="text" value={recipe.step_no} onChange={handleFormChange}/>

          <label htmlFor="step_inst">Step Instructions: </label>
          <input name="step_inst" type="text" value={recipe.step_inst} onChange={handleFormChange}/>

          <label htmlFor="stn_name">Station Name: </label>
          <input name="stn_name" type="text" value={recipe.stn_name} onChange={handleFormChange}/>

          <label htmlFor="inst_recipe_num">Recipe Instruction Number: </label>
          <input name="inst_recipe_num" type="text" value={recipe.inst_recipe_num} onChange={handleFormChange}/>

          <label htmlFor="r_num">Recipe Number: </label>
          <select name="r_num" onChange={handleFormChange}>
            <option selected="true">N/A</option>
            {recipeList.map((recipe, key) => {
              return (
                <option name='r_num' value={recipe.r_num}>{recipe.r_num}</option>
              )
            })}
          </select>

          <label htmlFor="r_name">Recipe Name: </label>
          <select name="r_name">
            <option selected="true">N/A</option>
            {recipeList.map((recipe, key) => {
              return (
                <option value={recipe.r_name}>{recipe.r_name}</option>
              );
            })}
          </select>

          <button type='Submit'>Add</button>

          <label htmlFor="r_num">Recipe Number: </label>
          <select name="r_num" onChange={handleFormChange}>
            <option selected="true">N/A</option>
            {setRecipeList.map((recipe, key) => {
              return (
                <option name='r_num' value={recipe.r_num}>{recipe.r_num}</option>
              )
            })}
          </select>

          <label htmlFor="r_name">Recipe Name: </label>
          <select name="r_name">
            <option selected="true">N/A</option>
            {setRecipeList.map((recipe, key) => {
              return (
                <option value={recipe.r_name}>{recipe.r_name}</option>
              );
            })}

            <button type='Submit'>Add</button>
          </select>
      </form>
    );
}

export default RecipeForm