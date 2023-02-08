import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import MealsPage from './MealsPage.js'
import InventoryPage from './InventoryPage.js'
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
import RecipeDropDown from './Recipe/RecipeDropDown.js'
import Search from './Search.js'
import React from 'react'
import ReactDOM from "react-dom"
import { useState } from 'react'
import { CssBaseline, Box } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const App = () => {
    const [currPage, setCurrPage] = useState();
    const [loginState, setLoginState] = useState({
        username: "",
        password: "",
        isAdmin: false
    })

    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'householdForm': setCurrPage(<HouseholdForm />); break;
            case 'loginPage': setCurrPage(<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />); break;
            case 'newUserPage': setCurrPage(<NewUserPage handlePageClick={handlePageClick} />); break;
            case 'pwResetPage': setCurrPage(<PwResetPage handlePageClick={handlePageClick} />); break;
            case 'landingPage': setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
            case 'mealsPage': setCurrPage(<MealsPage handlePageClick={handlePageClick} />); break;
            case 'inventoryPage': setCurrPage(<InventoryPage handlePageClick={handlePageClick} />); break;
            case 'households': setCurrPage(<HouseholdList />); break;
            case 'households-report': setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />); break;
            case 'ingredients': setCurrPage(<Ingredients />); break;
            case 'packaging': setCurrPage(<Packaging />); break;
            case 'stations': setCurrPage(<StationList />); break;
            case 'meals': setCurrPage(<MealPlan />); break;
            case 'recipes': setCurrPage(<Recipe />); break;
            case 'reports': setCurrPage(<ReportsPage />); break;
            case 'userPage': setCurrPage(<UserPage handlePageClick={handlePageClick} />); break;
            case 'userList': setCurrPage(<UserList handlePageClick={handlePageClick} />); break;
            // case 'allergies': setCurrPage(<AllergiesList allergies={[{ aType: 'Gluten' }, { aType: 'Peanut' }]} />); break;
        }
    }

    const theme = createTheme({
        palette: {
            lightGreen: {
                main: '#9AB847', // light green logo color
                contrastText: '#fff'
            },
            darkGreen: {
                main: '#093B31',
            },
            lightBlue: {
                main: '#3E8477',
            },
            lightOrange: {
                main: '#A35426'
            },
            darkBlue: {
                main: '#070D3A'
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
        <div className="App">
            <CssBaseline />
            <Box sx={{
                bgcolor: (theme) => theme.
                palette.background.default,
                minHeight: "100vh",
                width: '90%',
                margin: 'auto'
            }}>
                <header className="App-header">
                    <Typography variant='h4'>Food Forward Tracker</Typography>
                    <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('loginPage')}>
                        Login Page
                    </Button>
                    <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('landingPage')}>
                        Landing Page
                    </Button>
                    <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('userPage')}>
                        User Account
                    </Button>
                    <select>
                        <button onClick={() => handlePageClick('RecipeDropDown')}></button>
                    </select>
                    <button onClick={() => handlePageClick('Search')}>
                        Search
                    </button>
                    {currPage}
                </header>
            </Box>
        </div>
        </ThemeProvider>
    );
}

export default App;
/*
export default function App() {
    return <div>
        <CssBaseline />
        <Router>
            <Box sx={{
                bgcolor: (theme) => theme.
                palette.background.default,
                minHeight: "100vh"
            }}>
                <Routes>
                    <route path="/example"
                    element={<Example />} />
                </Routes>
            </Box>
        </Router>
    </div>
}

ReactDOM.render(<App />, document.getElementById("root"))
*/