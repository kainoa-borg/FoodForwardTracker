import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
import EditableMealRow from './EditableMealRow.js'
import MealPlanRow from './MealPlanRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import ReusableTable from '../ReusableTable.js'

import './MealList.css'
import Table from 'react-bootstrap/Table'

// Meal List Component
export default function MealList() {
    const data = [
        //{m_id: 1, meal_r_num: 'Veggie Lasagna', snack_r_num: 'Apples', num_servings: '', m_date: '11/20/22', usages: []},
        //{m_id: 2, meal_r_num: 'Beef and Bean Enchiladas', snack_r_num: 'Overnight Oats', num_servings: '', m_date: '11/11/22', usages: []},
        //{m_id: 3, meal_r_num: 'Tuna Casserole', snack_r_num: 'Crackers', num_servings: 'N/A', m_date: '11/20/22', usages: []}
        { m_id: 1, m_date: '11/20/22', snack_r_num: 1, meal_r_num: 2, num_servings: 6, usages: [] },
        { m_id: 2, m_date: '11/20/22', snack_r_num: 1, meal_r_num: 2, num_servings: 5, usages: [] },
        { m_id: 3, m_date: '11/20/22', snack_r_num: 1, meal_r_num: 2, num_servings: 3, usages: [] }
    ]

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
            url:"http://localhost:8000/api/mealplans/"
          }).then((response)=>{
            const mealData = response.data
            setMealPlan(mealData);
            console.log(mealData);
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
            url:"http://localhost:8000/api/recipe-list/"
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

    const postDBMealPlan = (meal) => {
        console.log(JSON.stringify(meal));
        axios({
            method: "POST",
            url:"http://localhost:8000/api/mealplans/",
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
        const lastID = mealPlan[mealPlan.length - 1]['m_id'];
        meal['m_id'] = lastID + 1;
        // let newMeal = [...mealPlan, meal];
        postDBMealPlan(meal);
        clearError();
        // Check to see if we already have a duplicate Ingredient Name
        // if (!ingredients.find((ing) => ing.i_id === ing.i_id))
        // {
        //     let newIngredients = [...ingredients, ingredient];
        //     setIngredients(newIngredients);
        //     clearError();
        // }
        // else {
        //     // If this ingredient is already in ingredients list, display error message
        //     handleError('DuplicateKey');
        // }
    }

    const deleteMeal = (key) => {
        let thisID = mealPlan[key]['m_id'];
        if (mealPlan.find((meals) => meals.m_id === thisID))
        {
            axios({
                method: "DELETE",
                url:"http://localhost:8000/api/mealplans/"+thisID+'/',
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
        console.log(thisID);
        console.log(JSON.stringify(editFormData))
        if (mealPlan.find((meals) => meals.m_id === thisID))
        {
            axios({
                method: "PATCH",
                url:"http://localhost:8000/api/mealplans/"+thisID+'/',
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
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.aFlag);
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
            <Table>
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
            </Table>
            <h3>Add A Meal</h3>
            <MealPlanForm addMeal={addMeal} recipeList={recipeList}></MealPlanForm>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}
