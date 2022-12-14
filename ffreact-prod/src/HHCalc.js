import React from 'react'
import { useState } from 'react'
import axios from 'axios'


// Calculate Number of Servings needed per Meal Planned

const ServingsCalculation = (props) => {

    const [meals, setMeals] = useState(props.meals); 
  
  return (
    <h1>Meal Servings</h1>
  );
}

export default ServingsCalculation;
