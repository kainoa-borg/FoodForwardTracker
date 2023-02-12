import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import PwResetPage from './PwResetPage.js'
import LandingPage from './LandingPage.js'
import MealsPage from './MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdList from './Households/HouseholdList.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
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
import EntryPage from './EntryPage.js'
import Search from './Search.js'
import React from 'react'
import ReactDOM from "react-dom"
import { useState } from 'react'
import { CssBaseline, Box } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container, Button, Typography } from '@mui/material'

import { ThemeProvider, createTheme } from '@mui/material/styles'

// import { ThemeProvider } from 'styled-components'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//import Header from './components/Header'
import MenuItems from './components/MenuItems'
import NavBar from './components/NavBar'
import Dropdown, { useOutsideClick} from './components/Dropdown'
import './App.css';

import {Grid} from '@mui/material'
import { useEffect } from 'react'

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
};


const App = () => {
    const [currPage, setCurrPage] = useState();
    const [open, setOpen] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [loginState, setLoginState] = useState({
        username: "",
        password: "",
        isAdmin: false
    })
    const handleClickOutside = () => {
        setCount(0);
      };
    const ref = useOutsideClick(handleClickOutside);
    
    const handleClick = () => {
        setCount((state) => state + 1);
      };  
    
    const handleHeaderClick = (event) => {
        // do something
        event.stopPropagation();
      };
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
            case 'households': setCurrPage(<HouseholdList handlePageClick={handlePageClick} />); break;
            case 'households-report': setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />); break;
            case 'ingredients': setCurrPage(<Ingredients handlePageClick={handlePageClick} />); break;
            case 'packaging': setCurrPage(<Packaging handlePageClick={handlePageClick} />); break;
            case 'stations': setCurrPage(<StationList handlePageClick={handlePageClick} />); break;
            case 'meals': setCurrPage(<MealPlan handlePageClick={handlePageClick} />); break;
            case 'recipes': setCurrPage(<Recipe handlePageClick={handlePageClick} />); break;
            case 'reports': setCurrPage(<ReportsPage handlePageClick={handlePageClick} />); break;
            case 'userPage': setCurrPage(<UserPage handlePageClick={handlePageClick} />); break;
            case 'userList': setCurrPage(<UserList handlePageClick={handlePageClick} />); break;
            // case 'allergies': setCurrPage(<AllergiesList allergies={[{ aType: 'Gluten' }, { aType: 'Peanut' }]} />); break;
        }
    }

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
                {currPage}
            </header>
            </Box>
        </div>
        </ThemeProvider>
    );
};

export default App;

/*   Dropdown example
         <Dropdown
                trigger={<button>Dropdown</button>}
                menu={[
                    <button ref={ref} type="button" onClick={handleClick}>Count: {count}</button>
                ]}/>
*/