import React from 'react'
import {useState} from 'react'

// Meal Repository Table component
// Takes list of meals
const MealRepositoryTable = (props) => {
  // Meals is a list of meal objects with the data from a meal repository query.
  // Each Meal contains: recipeName, dietCategories(a list of diet categories this recipe belongs to), dateLastServed)
  const [meals, setMeals] = useState(props.meals); 
  
  return (
    <h1>Meal Repository</h1>
  );
}

export default MealRepositoryTable;
