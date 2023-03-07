import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
import EditableMealRow from './EditableMealRow.js'
import MealPlanRow from './MealPlanRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import './MealList.css'

import {Box, Typography} from '@mui/material'
import NewModularDatagrid from '../components/NewModularDatagrid.js'

// Meal List Component
export default function MealList() {
    const [recipeList, setRecipeList] = useState(undefined);

    const getDBRecipeList = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/recipe-list/"
          }).then((response)=>{
            const recipeData = response.data
            setRecipeList(recipeData);
            // console.log(recipeData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    useEffect(() => {
        getDBRecipeList();
    }, [])

    if (recipeList===undefined) {
        return (<>loading</>)
    }

    // Format recipes into valueOptions
    const getRecipeOptions = (m_or_s) => {
      let rOptions = recipeList.map((recipe) => {
        if (m_or_s === 'meal' && recipe.m_s === 1)
          return {value: recipe.r_num, label: recipe.r_name};
        else if (m_or_s === 'snack' && recipe.m_s === 0)
          return {value: recipe.r_num, label: recipe.r_name};
      });
      return rOptions.filter((element) => {return element !== undefined});

    }

    const recipeFormatter = (params) => { if (params.value) {return recipeList.find((recipe) => recipe.r_num === params.value).r_name;}}

    const columns = [
      {field: 'm_date', headerName: 'Next Delivery Date', width: 170, type: 'date', editable: true},
      {field: 'meal_r_num', headerName: 'Meal Name', width: 150, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions('meal'), valueFormatter: recipeFormatter},
      // {field: 'meal_servings', headerName: 'Meal Servings', width: 120, type: 'number', editable: true},
      {field: 'snack_r_num', headerName: 'Snack Name', width: 150, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions('snack'), valueFormatter: recipeFormatter},
      // {field: 'snack_servings', headerName: 'Snack Servings', width: 120, type: 'number', editable: true}
    ]

    // The HTML structure of this component
    return (
      <Fragment>
        <Typography variant='h5'>Meal Plans</Typography>
        <Box sx={{height: '70vh'}}>
          <NewModularDatagrid
            apiEndpoint={'mealplans'}
            columns={columns}
            keyFieldName={'m_id'}
            entryName={'Planned Meal'}
            AddFormComponent={MealPlanForm}
            // searchField={''}

          ></NewModularDatagrid>
        </Box>
      </Fragment>
    )
}
