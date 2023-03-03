import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
import EditableMealRow from './EditableMealRow.js'
import MealPlanRow from './MealPlanRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import './MealList.css'

import {Box} from '@mui/material'
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
    const getRecipeOptions = () => {
      return recipeList.map((recipe) => {return {value: recipe.r_num, label: recipe.r_name}});
    }

    const recipeFormatter = (params) => { if (params.value) {return recipeList.find((recipe) => recipe.r_num === params.value).r_name;}}

    const columns = [
      {field: 'm_date', headerName: 'Next Delivery Date', width: 170, type: 'date', editable: true},
      {field: 'meal_r_num', headerName: 'Meal Name', width: 150, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions(), valueFormatter: recipeFormatter},
      {field: 'meal_servings', headerName: 'Meal Servings', width: 120, type: 'number', editable: true},
      {field: 'snack_r_num', headerName: 'Snack Name', width: 150, type: 'singleSelect', editable: true, valueOptions: getRecipeOptions(), valueFormatter: recipeFormatter},
      {field: 'snack_servings', headerName: 'Snack Servings', width: 120, type: 'number', editable: true}
    ]

    // The HTML structure of this component
    return (
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

        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        // <div class='table-div'>
        //   <h3>Meal Plan</h3>
        //     <table>
        //         <thead>
        //             <tr>
        //                 <th>Next Delivery Date</th>
        //                 <th>Meal Name</th>
        //                 <th>Meal Servings</th>
        //                 <th>Snack Name</th>
        //                 <th>Snack Servings</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {/* Show a row for each ingredient in ingredients.*/}
        //             {mealPlan.map((meal, key) => {
        //                 const thisKey = key;
        //                 return(
        //                     <Fragment>
        //                         {
        //                         // If this ingredient is the one to be edited, show an editable row instead
        //                         editMealID === thisKey 
        //                         ? <EditableMealRow thisKey={thisKey} editFormData={editFormData} recipeList={recipeList} updateMeal={updateMeal} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
        //                         : <MealPlanRow thisKey={thisKey} meal={meal} recipeList={recipeList} deleteMeal={deleteMeal} handleEditClick={handleEditClick}/>
        //                         }
        //                     </Fragment>
        //                 );
        //             })}
        //         </tbody>
        //     </table>
        //     <h3>Add A Meal</h3>
        //     <MealPlanForm addMeal={addMeal} recipeList={recipeList}></MealPlanForm>
        //     {errorComponent}
        //     {displayMsgComponent}
        // </div>
    )
}
