import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import MealsPage from './MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdPage from './Households/HouseholdPage.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
import Ingredients from './Ingredients/IngredientList.js'
import IngredientPage from './Ingredients/IngredientPage.js'
import IngredientsReport from './Ingredients/IngredientsReport.js'
import StationList from './Stations/StationList.js'
import ReportsPage from "./ReportsPage.js"
import UserPage from "./UserPage.js"
import UserList from "./User/UserList.js"
import NewUserPage from "./NewUserPage.js"
import Recipe from './Recipe/RecipeList.js'
import RecipePage from './Recipe/RecipePage.js'
import MealPlan from './Meals/MealList.js'
import MealPlanReport from './Reports/MealPlanReport.js'
import MealHistory from './Reports/MealHistory.js'
import CostTotals from './Reports/CostTotals.js'
import Packaging from './Packaging/PackagingList.js'
import PackagingPage from './Packaging/PackagingPage.js'
import PackagingReport from './Packaging/PackagingReport.js'
import PackagingReturns from './Reports/PackagingReturns.js'
import PurchasingReport from './Reports/PurchasingReport.js'
import EntryPage from './EntryPage.js'
import Navbar from './Navbar.js'
import React from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// import { useOutsideClick} from './components/Dropdown'
import './App.css';

// SERVER IP 4.236.185.213

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
};

const App = () => {
    const [loginState, setLoginState] = useState({
        username: "",
        isAuthenticated: false,
        isAdmin: false
    })

    // const handleClickOutside = () => {};
    // const ref = useOutsideClick(handleClickOutside);
    
    const handleHeaderClick = (event) => {
        event.stopPropagation();
      };

    /*const readLoginCookie = () => {
        const parseCookie = str =>
            str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
        return parseCookie(document.cookie);
    }*/

    const handleLogout = () => {
        document.cookie = 'username=;'
        document.cookie = 'isAuthenticated=false;'
        document.cookie = 'isAdmin=false;'
        setLoginState({
            username: '',
            isAuthenticated: false,
            isAdmin: false
        })
    }

    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'cost-totals': setCurrPage(<CostTotals handlePageClick={handlePageClick} />); break;
            case 'loginPage': setCurrPage(<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />); break;
            case 'newUserPage': setCurrPage(<NewUserPage handlePageClick={handlePageClick} />); break;
            case 'pwResetPage': setCurrPage(<PwResetPage handlePageClick={handlePageClick} />); break;
            case 'landingPage': setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
            case 'mealsPage': setCurrPage(<MealsPage handlePageClick={handlePageClick} />); break;
            case 'households': setCurrPage(<HouseholdPage handlePageClick={handlePageClick} />); break;
            case 'householdForm': setCurrPage(<HouseholdForm />); break;
            case 'households-report': setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />); break;
            case 'ingredients': setCurrPage(<Ingredients handlePageClick={handlePageClick} />); break;
            case 'ingredientPage': setCurrPage(<IngredientPage handlePageClick={handlePageClick} />); break;
            case 'ingredients-report': setCurrPage(<IngredientsReport handlePageClick={handlePageClick} />); break;
            case 'inventoryPage': setCurrPage(<InventoryPage handlePageClick={handlePageClick} />); break;
            case 'packaging': setCurrPage(<Packaging handlePageClick={handlePageClick} />); break;
            case 'packagingPage': setCurrPage(<PackagingPage handlePageClick={handlePageClick} />); break;
            case 'packaging-report': setCurrPage(<PackagingReport handlePageClick={handlePageClick} />); break;
            case 'packaging-returns': setCurrPage(<PackagingReturns handlePageClick={handlePageClick} />); break;
            case 'purchasing-report': setCurrPage(<PurchasingReport handlePageClick={handlePageClick} />); break;
            case 'stations': setCurrPage(<StationList handlePageClick={handlePageClick} />); break;
            case 'meals': setCurrPage(<MealPlan handlePageClick={handlePageClick} />); break;
            case 'meal-plan-report': setCurrPage(<MealPlanReport handlePageClick={handlePageClick} />); break;
            case 'meal-history': setCurrPage(<MealHistory handlePageClick={handlePageClick} />); break;
            case 'recipes': setCurrPage(<Recipe handlePageClick={handlePageClick} />); break;
            case 'recipePage': setCurrPage(<RecipePage handlePageClick={handlePageClick} />); break;
            case 'reports': setCurrPage(<ReportsPage handlePageClick={handlePageClick} />); break;
            case 'userPage': setCurrPage(<UserPage handlePageClick={handlePageClick} />); break;
            case 'userList': setCurrPage(<UserList handlePageClick={handlePageClick} />); break;
            case 'entryPage': setCurrPage(<EntryPage handlePageClick={handlePageClick}/>); break;
            default: setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
        }
    }

    const [currPage, setCurrPage] = useState(<EntryPage handlePageClick={handlePageClick} setLoginState={setLoginState} />);

    // useEffect(() => {setCurrPage(<EntryPage handlePageClick={handlePageClick}/>)}, [])

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
            <Navbar handlePageClick={handlePageClick} handleLogout={handleLogout} loginState={loginState} />
            <Box sx={{
                bgcolor: (theme) => theme.palette.background.default,
                minHeight: "100%",
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
