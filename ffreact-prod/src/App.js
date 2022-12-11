import MealRepositoryTable from './MealPlan.js'
import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import HouseholdList from './Households/HouseholdList.js'
import AllergiesList from './Households/AllergiesList.js'
import Ingredients from './Ingredients/IngredientList.js'
import Recipe from './Recipe/RecipeList.js'
import MealPlan from './Meals/MealList.js'
import React from 'react'
import {useState} from 'react'

const App = () => {
  const [currPage, setCurrPage] = useState();

  const handlePageClick = (pageName) => {
    console.log(pageName)
    if (pageName === 'householdForm') setCurrPage(<HouseholdForm/>);
    else if (pageName === 'loginPage') setCurrPage(<LoginPage handlePageClick={handlePageClick}/>);
    else if (pageName === 'mealRepositoryTable') setCurrPage(<MealRepositoryTable/>);
    else if (pageName === 'households') setCurrPage(<HouseholdList/>);
    else if (pageName === 'ingredients') setCurrPage(<Ingredients/>);
    else if (pageName === 'landing') setCurrPage(<MealRepositoryTable/>);
    else if (pageName === 'meals') setCurrPage(<MealPlan/>);
    else if (pageName === 'recipes') setCurrPage(<Recipe/>);
    else if (pageName === 'allergies') setCurrPage(<AllergiesList allergies={[{aType: 'Gluten'}, {aType: 'Peanut'}]}/>);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Food Forward Tracker</h1>
        {/* <button onClick={() => handlePageClick('householdForm')}>
          Household Form
        </button> */}
        <button onClick={() => handlePageClick('loginPage')}>
          Login Page
        </button>
        <button onClick={() => handlePageClick('households')}>
          Households
        </button>
        <button onClick={() => handlePageClick('ingredients')}>
          Ingredients
        </button>
        <button onClick={() => handlePageClick('meals')}>
          Meal Plan
        </button>
        <button onClick={() => handlePageClick('recipes')}>
          Recipes
        </button>
        {currPage}
      </header>
    </div>
  );
}

export default App;