import React, {Fragment, useState} from 'react'
import axios from 'axios'
import MealPlanForm from './MealPlanForm.js'
import EditableMealRow from './EditableMealRow.js'
import MealPlanRow from './MealPlanRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import ReusableTable from '../ReusableTable.js'

import './MealList.css'


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

    const [meal_plans, setMealPlan] = useState(data);
    const [editMealID, setEditMealID] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const getDBMealPlan = () => {
        axios({
            method: "GET",
            url:"/meal_plans/"
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

    const postDBMealPlan = () => {
        axios({
            method: "POST",
            url:"/meal_plans/",
            data: meal_plans
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
        const lastID = meal_plans[meal_plans.length - 1]['m_id'];
        meal['m_id'] = lastID + 1;
        let newMeal = [...meal_plans, meal];
        setMealPlan(newMeal);
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
        const mealID = key; 
        let newMeal = [...meal_plans];
        newMeal.splice(mealID, 1);
        setMealPlan(newMeal);
    }

    const updateMeal = (key) => {
        let thisID = meal_plans[key]['m_id'];
        if (meal_plans.find((meals) => meals.m_id === thisID))
        {
            let newMeal = [...meal_plans];
            newMeal[key] = editFormData;
            setEditMealID(null);
            setMealPlan(newMeal)
            clearError();
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
        setEditFormData(meal_plans[key]);
    }
    const handleCancelClick = () => {
        setEditMealID(null);
        setEditFormData(null);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Snack Name</th>
                        <th>Meal Name</th>
                        <th>Number of Servings</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each ingredient in ingredients.*/}
                    {meal_plans.map((meal, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this ingredient is the one to be edited, show an editable row instead
                                editMealID === thisKey 
                                ? <EditableMealRow thisKey={thisKey} editFormData={editFormData} updateMeal={updateMeal} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <MealPlanRow thisKey={thisKey} meal={meal} deleteMeal={deleteMeal} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            <h3>Add A Meal</h3>
            <MealPlanForm addMeal={addMeal}></MealPlanForm>
            <button onClick={postDBMealPlan}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}
