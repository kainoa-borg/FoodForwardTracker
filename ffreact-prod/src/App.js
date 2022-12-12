import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import HouseholdList from './Households/HouseholdList.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
import AllergiesList from './Households/AllergiesList.js'
import Ingredients from './Ingredients/IngredientList.js'
import StationList from './Stations/StationList.js'
import ReportsPage from "./ReportsPage.js"
import UserPage from "./UserPage.js"
import UserList from "./User/UserList.js"
import NewUserPage from "./NewUserPage.js"
import Recipe from './Recipe/RecipeList.js'
import MealPlan from './Meals/MealList.js'
import Packaging from './Packaging/PackagingList.js'
import React from 'react'
import { useState } from 'react'

const App = () => {
    const [currPage, setCurrPage] = useState();

    const handlePageClick = (pageName) => {
        console.log(pageName)
        if (pageName === 'householdForm') setCurrPage(<HouseholdForm />);
        else if (pageName === 'loginPage') setCurrPage(<LoginPage handlePageClick={handlePageClick} />);
        else if (pageName === 'newUserPage') setCurrPage(<NewUserPage handlePageClick={handlePageClick} />);
        else if (pageName === 'pwResetPage') setCurrPage(<PwResetPage handlePageClick={handlePageClick} />);
        else if (pageName === 'landingPage') setCurrPage(<LandingPage handlePageClick={handlePageClick} />);
        else if (pageName === 'households') setCurrPage(<HouseholdList />);
        else if (pageName === 'households-report') setCurrPage(<HouseholdsReport />);
        else if (pageName === 'ingredients') setCurrPage(<Ingredients />);
        else if (pageName === 'packaging') setCurrPage(<Packaging />);
        else if (pageName === 'stations') setCurrPage(<StationList />);
        else if (pageName === 'landing') setCurrPage(<HouseholdList />);
        else if (pageName === 'meals') setCurrPage(<MealPlan />);
        else if (pageName === 'recipes') setCurrPage(<Recipe />);
        else if (pageName === 'reports') setCurrPage(<ReportsPage />);
        else if (pageName === 'userPage') setCurrPage(<UserPage handlePageClick={handlePageClick} />);
        else if (pageName === 'userList') setCurrPage(<UserList handlePageClick={handlePageClick} />);
        else if (pageName === 'allergies') setCurrPage(<AllergiesList allergies={[{ aType: 'Gluten' }, { aType: 'Peanut' }]} />);
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
                <button onClick={() => handlePageClick('landingPage')}>
                    Landing Page
                </button>
                <button onClick={() => handlePageClick('households')}>
                    Households
                </button>
                <button onClick={() => handlePageClick('households-report')}>
                    Households Report
                </button>
                <button onClick={() => handlePageClick('ingredients')}>
                    Ingredients
                </button>
                <button onClick={() => handlePageClick('packaging')}>
                    Packaging
                </button>
                <button onClick={() => handlePageClick('stations')}>
                    Stations
                </button>
                <button onClick={() => handlePageClick('reports')}>
                    Reports
                </button>
                <button onClick={() => handlePageClick('userPage')}>
                    User Account
                </button>
                <button onClick={() => handlePageClick('userList')}>
                    User Admin.
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