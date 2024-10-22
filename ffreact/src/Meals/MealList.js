import React, {Fragment, useState, useEffect} from 'react'
import moment from 'moment';
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
// import EditableMealRow from './EditableMealRow.js'
// import MealPlanRow from './MealPlanRow.js'
// import Error from '../Error.js'
// import DisplayMessage from '../DisplayMessage.js'
import './MealList.css'

import {Box, Typography} from '@mui/material'
import NewModularDatagrid from '../components/NewModularDatagrid.js'

// Meal List Component
export default function MealList(props) {
    const [recipeList, setRecipeList] = useState(undefined);
    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};

    const getDBRecipeList = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "recipe-list/"
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
    // Takes:
    //  m_or_s: string value denoting whether to find meals or snacks
    // Returns:
    //  MUI Datagrid singleSelect valueOptions compatible list of recipe r_nums and r_names 
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
    const dateParser = value => moment(value).format("YYYY-MM-DD").toString();

    const columns = [
      {field: 'm_date', headerName: 'Delivery Date', width: 170, type: 'date', editable: true, valueParser: dateParser, renderCell: (params) => <Typography>{moment(params.value).format('MM/DD/YYYY')}</Typography>},
      {field: 'meal_r_num', headerName: 'Meal Name', width: 250, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions('meal'), valueFormatter: recipeFormatter},
      // {field: 'meal_servings', headerName: 'Meal Servings', width: 120, type: 'number', editable: true},
      {field: 'snack_r_num', headerName: 'Snack Name', width: 250, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions('snack'), valueFormatter: recipeFormatter},
      // {field: 'snack_servings', headerName: 'Snack Servings', width: 120, type: 'number', editable: true}
    ]

    // The HTML structure of this component
    return (
      <Fragment>
        <Typography id='page-header' variant='h5'>Meal Plans</Typography>
        <Box sx={{height: '70vh'}}>
          <NewModularDatagrid
            loginState={loginState}
            apiEndpoint={'mealplans'}
            columns={columns}
            keyFieldName={'m_id'}
            entryName={'Planned Meal'}
            AddFormComponent={MealPlanForm}
            addFormProps={{recipeList: recipeList}}
            // searchField={''}
          ></NewModularDatagrid>
        </Box>
      </Fragment>
    )
}
