import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
import EditableMealRow from './EditableMealRow.js'
import MealPlanRow from './MealPlanRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import './MealList.css'

// Meal List Component
export default function MealList() {
    const [mealPlan, setMealPlan] = useState(undefined);
    const [recipeList, setRecipeList] = useState(undefined);
    const [editMealID, setEditMealID] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const getDBMealPlan = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/mealplans/"
          }).then((response)=>{
            const mealData = response.data
            setMealPlan(mealData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
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

  /*  const getDBServingCalculations = () => {
        console.log('MAKING REQUEST TO DJANGO')
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/serving-calculations/"
          }).then((response)=>{
            return response.data;
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }*/

    const postDBMealPlan = (meal) => {
        console.log(JSON.stringify(meal));
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/mealplans/",
            data: meal
          }).then((response)=>{
            getDBMealPlan();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Ingredient ID already found!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    const addMeal = (meal) => {
        // console.log(JSON.stringify(meal))
        // console.log(meal['meal_servings'])
        const lastID = mealPlan[mealPlan.length - 1]['m_id'];
        meal['m_id'] = lastID + 1;
        // let calc_servings = getDBServingCalculations();
        // meal['meal_servings'] = calc_servings['meal_servings']
        // meal['snack_servings'] = calc_servings['snack_servings']
        // let newMeal = [...mealPlan, meal];
        postDBMealPlan(meal);
        clearError();
    }

    const deleteMeal = (key) => {
        let thisID = mealPlan[key]['m_id'];
        if (mealPlan.find((meals) => meals.m_id === thisID))
        {
            axios({
                method: "DELETE",
                url:"http://4.236.185.213:8000/api/mealplans/"+thisID+'/',
              }).then((response)=>{
                getDBMealPlan();
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

    const updateMeal = (key) => {
        let thisID = mealPlan[key]['m_id'];
        // console.log(thisID);
        // console.log(JSON.stringify(editFormData))
        if (mealPlan.find((meals) => meals.m_id === thisID))
        {
            axios({
                method: "PATCH",
                url:"http://4.236.185.213:8000/api/mealplans/"+thisID+'/',
                data: editFormData
              }).then((response)=>{
                getDBMealPlan();
                setEditMealID(undefined);
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
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
        //   console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.aFlag);
        }
        setEditFormData(newEditFormData);
      }

    const handleEditClick = (key) => {
        setEditMealID(key);
        setEditFormData(mealPlan[key]);
    }
    const handleCancelClick = () => {
        setEditMealID(null);
        setEditFormData(null);
    }

    useEffect(() => {
        getDBMealPlan();
        getDBRecipeList();
    }, [])

    if (mealPlan===undefined || recipeList===undefined) {
        return (<>loading</>)
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
          <h3>Meal Plan</h3>
            <table>
                <thead>
                    <tr>
                        <th>Next Delivery Date</th>
                        <th>Meal Name</th>
                        <th>Meal Servings</th>
                        <th>Snack Name</th>
                        <th>Snack Servings</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each ingredient in ingredients.*/}
                    {mealPlan.map((meal, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this ingredient is the one to be edited, show an editable row instead
                                editMealID === thisKey 
                                ? <EditableMealRow thisKey={thisKey} editFormData={editFormData} recipeList={recipeList} updateMeal={updateMeal} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <MealPlanRow thisKey={thisKey} meal={meal} recipeList={recipeList} deleteMeal={deleteMeal} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            <h3>Add A Meal</h3>
            <MealPlanForm addMeal={addMeal} recipeList={recipeList}></MealPlanForm>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}
