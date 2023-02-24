import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import MealsPage from './MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdList from './Households/HouseholdList.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
import Ingredients from './Ingredients/IngredientList.js'
import IngredientsReport from './Ingredients/IngredientsReport.js'
import StationList from './Stations/StationList.js'
import ReportsPage from "./ReportsPage.js"
import UserPage from "./UserPage.js"
import UserList from "./User/UserList.js"
import NewUserPage from "./NewUserPage.js"
import Recipe from './Recipe/RecipeList.js'
import RecipePage from './Recipe/RecipePage.js'
import MealPlan from './Meals/MealList.js'
import Packaging from './Packaging/PackagingList.js'
import PackagingReport from './Packaging/PackagingReport.js'
import EntryPage from './EntryPage.js'
import Search from './Search.js'
import Navbar from './Navbar.js'
import React from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NavBar from './components/NavBar'
import Dropdown, { useOutsideClick} from './components/Dropdown'
import './App.css';

// SERVER IP 4.236.185.213

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
};

const App = () => {
    const [currPage, setCurrPage] = useState();
    const [loginState, setLoginState] = useState({
        username: "",
        isAuthenticated: false,
        isAdmin: false
    })

    const handleClickOutside = () => {
      };
    const ref = useOutsideClick(handleClickOutside);
    
    const handleHeaderClick = (event) => {
        event.stopPropagation();
      };
      
    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'loginPage': setCurrPage(<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />); break;
            case 'newUserPage': setCurrPage(<NewUserPage handlePageClick={handlePageClick} />); break;
            case 'pwResetPage': setCurrPage(<PwResetPage handlePageClick={handlePageClick} />); break;
            case 'landingPage': setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
            case 'mealsPage': setCurrPage(<MealsPage handlePageClick={handlePageClick} />); break;
            case 'households': setCurrPage(<HouseholdList handlePageClick={handlePageClick} />); break;
            case 'householdForm': setCurrPage(<HouseholdForm />); break;
            case 'households-report': setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />); break;
            case 'ingredients': setCurrPage(<Ingredients handlePageClick={handlePageClick} />); break;
            case 'ingredients-report': setCurrPage(<IngredientsReport handlePageClick={handlePageClick} />); break;
            case 'inventoryPage': setCurrPage(<InventoryPage handlePageClick={handlePageClick} />); break;
            case 'packaging': setCurrPage(<Packaging handlePageClick={handlePageClick} />); break;
            case 'packaging-report': setCurrPage(<PackagingReport handlePageClick={handlePageClick} />); break;
            case 'stations': setCurrPage(<StationList handlePageClick={handlePageClick} />); break;
            case 'meals': setCurrPage(<MealPlan handlePageClick={handlePageClick} />); break;
            case 'recipes': setCurrPage(<Recipe handlePageClick={handlePageClick} />); break;
            case 'reports': setCurrPage(<ReportsPage handlePageClick={handlePageClick} />); break;
            case 'userPage': setCurrPage(<UserPage handlePageClick={handlePageClick} />); break;
            case 'userList': setCurrPage(<UserList handlePageClick={handlePageClick} />); break;
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
                contrastText: '#fff'
            },
            lightBlue: {
                main: '#3E8477',
                contrastText: '#fff'
            },
            lightOrange: {
                main: '#A35426',
                contrastText: '#fff'
            },
            darkBlue: {
                main: '#070D3A',
                contrastText: '#fff'
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
        <div className="App" style={style} onClick={handleHeaderClick}>
            <Navbar handlePageClick={handlePageClick} />
            <Box sx={{
                bgcolor: (theme) => theme.
                palette.background.default,
                minHeight: "100vh",
                width: '90%',
                margin: 'auto',
                marginTop: '5%',
            }}>
                {currPage}
            </Box>
        </div>
        </ThemeProvider>
    );
};

export default App;
