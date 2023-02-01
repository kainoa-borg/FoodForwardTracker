import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import HouseholdList from './Households/HouseholdList.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
import AllergiesList from './Households/AllergiesList.js'
import Ingredients from './Ingredients/IngredientList.js'
//import IngredientReport from './Ingredients/IngredientReport.js'
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
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider } from 'styled-components'

const App = () => {
    const [currPage, setCurrPage] = useState();
    const [loginState, setLoginState] = useState({
        username: "",
        password: "",
        isAdmin: false
    })

    const handlePageClick = (pageName) => {
        console.log(pageName)
        if (pageName === 'householdForm') setCurrPage(<HouseholdForm />);
        else if (pageName === 'loginPage') setCurrPage(<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />);
        else if (pageName === 'newUserPage') setCurrPage(<NewUserPage handlePageClick={handlePageClick} />);
        else if (pageName === 'pwResetPage') setCurrPage(<PwResetPage handlePageClick={handlePageClick} />);
        else if (pageName === 'landingPage') setCurrPage(<LandingPage handlePageClick={handlePageClick} />);
        else if (pageName === 'households') setCurrPage(<HouseholdList />);
        else if (pageName === 'households-report') setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />);
        else if (pageName === 'ingredients') setCurrPage(<Ingredients />);
        //else if (pageName === 'ingredients-report') setCurrPage(<IngredientReport handlePageClick={handlePageClick} />);
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
        <Container maxWidth='xl' className="this-container">
            <header className="App-header">
                <Typography variant='h4'>Food Forward Tracker</Typography>
                {/* <button onClick={() => handlePageClick('householdForm')}>
          Household Form
        </button> */}
                <Button variant='contained' onClick={() => handlePageClick('loginPage')}>
                    Login Page
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('userPage')}>
                    User Account
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('userList')}>
                    User Admin.
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('landingPage')}>
                    Landing Page
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('households')}>
                    Households
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('ingredients')}>
                    Ingredients
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('packaging')}>
                    Packaging
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('stations')}>
                    Stations
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('reports')}>
                    Reports
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('meals')}>
                    Meal Plan
                </Button>
                <Button variant='contained' onClick={() => handlePageClick('recipes')}>
                    Recipes
                </Button>
                {currPage}
            </header>
        </Container>
    );
}

export default App;