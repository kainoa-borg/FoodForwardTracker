import {useState, useEffect} from 'react'
import React from 'react'
import axios from 'axios'
import { Stack, Input, InputLabel, Select, MenuItem, Typography, Card, Button } from '@mui/material';
// import ReusableForm from '../ReusableForm.js'

// Sabona Abubeker

// Neal Plan Form component
// Takes AddMeal callback function
// Returns a form that can be used to define a new meal object in a mealList
const MealPlanForm = (props) => {

  const [recipeList, setRecipeList] = useState();
  const addEntry = props.addEntry;
  const handleClose = props.handleClose;
  
  const clearMeal = () => {
    return {
      m_id: null,
      m_date: '',
      snack_r_num: null,
      meal_r_num: null,
      meal_servings: null,
      snack_servings: null
    }
  }

  const getDBRecipeList = () => {
    console.log('MAKING REQUEST TO DJANGO')
    axios({
      method: "GET",
      url:"http://4.236.185.213:8000/api/recipe-list/"
    }).then((response)=>{
      const recipeData = response.data
      setRecipeList(recipeData);
      console.log(recipeData);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
        }
    });
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
      // Pass Meal object to NewModularDatagrid callback
      addEntry(meal);
      handleClose();
      // Clear the form state
      setMeal(clearMeal());
    }

    const updateEditForm = (names, values) => {
      const newMeal = {...meal};
      for (let i = 0; i < names.length; i++) {
        newMeal[names[i]] = values[i];
        // console.log('(' + names[i] + ', ' + values[i] + ')');
      }
      setMeal(newMeal);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.name;
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new ingredient object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    useEffect(() => {
      getDBRecipeList();
    })

    if (recipeList === undefined) {
      return <>loading...</>
    }

    // Format recipes into valueOptions
    const getRecipeOptions = (m_or_s) => {
      let rOptions = recipeList.map((recipe) => {
        if (m_or_s === 'meal' && recipe.m_s === 1)
          return(<MenuItem value={recipe.r_num}>{recipe.r_name}</MenuItem>)
        else if (m_or_s === 'snack' && recipe.m_s === 0)
          return(<MenuItem value={recipe.r_num}>{recipe.r_name}</MenuItem>)
      });
      return rOptions.filter((element) => {return element !== undefined});
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
        <Card sx={{marginTop: '1em', padding: '1em'}}>
        <Typography variant='h5'>Add Planned Meal</Typography>
          <Stack>
            <InputLabel htmlFor="m_date">Next Delivery Date: </InputLabel>
            <Input name="m_date" required type="date" maxLength='50' value={meal.m_date} onChange={handleFormChange}/>

            <InputLabel htmlFor="meal_r_num">Meal: </InputLabel>
            <Select name='meal_r_num' required meal={meal.meal_r_num} onChange={handleFormChange}>
              {getRecipeOptions('meal')}
            </Select>
            
            <InputLabel htmlFor='snack_r_num'>Snack: </InputLabel>
            <Select name='snack_r_num' required value={meal.snack_r_num} onChange={handleFormChange}>
              {getRecipeOptions('snack')}
            </Select>

            <Button color='darkGreen' variant='contained' type='Submit'>Add</Button>
          </Stack>
        </Card>
                  
      </form>
    );
}

export default MealPlanForm
