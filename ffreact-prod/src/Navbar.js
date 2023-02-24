import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage.js'
import LandingPage from './LandingPage.js'
import MealsPage from './MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdForm from './Households/HouseholdForm.js'
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
import RecipePage from './Recipe/RecipePage.js'
import MealPlan from './Meals/MealList.js'
import ff_logo from './Images/ff_logo.jpg'

import { AppBar, Typography, Toolbar, Tabs, Button, useMediaQuery, useTheme, Grid} from "@mui/material"

const PAGES = ["Landing Page", "Clients", "Households", "Inventory", "Meals", "Reports", "Administration"]
// console.log(PAGES)
const Navbar = (props) => {
  const [value, setValue] = useState();
  const theme = useTheme();
  // console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down(""))
  // console.log(isMatch)
  const loginState = props.loginState;
  const handleLogout = props.handleLogout;

  const displayLoginSignup = () => {
    if (loginState.isAuthenticated) {
      return (
        <Grid item>
          <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('userPage')}>My Account</Button>
          <Button color='lightGreen' variant='contained' onClick={handleLogout}>Sign Out</Button>
        </Grid>
      )
    }
    else {
      return (
        <Grid item>
            <Button color='lightGreen' variant="contained" onClick={() => handlePageClick('loginPage')
            }>Login{""}</Button>
            <Button color='lightGreen' variant="contained" onClick={() => handlePageClick('newUserPage')}>Sign Up{""}</Button>
        </Grid>
      )
    }
  }


  const handlePageClick = props.handlePageClick;
  return (
    <React.Fragment>
      <AppBar sx={{ background: '#9AB847'}}>
        <Toolbar>
        <Tabs
          value={value}
          onChange={(e, value) => setValue(value)}
        >
        </Tabs>
        
          
        <Grid container justifyContent='space-between' alignItems='center' direction='row'>
          <Grid item sx={{width: '60%'}} container alignItems='center' direction='row'>
            <Typography component='img' sx={{width: '7%'}} src="ffreact-prod/src/Images/ff_logo.jpg" onClick = {() => handlePageClick('landingPage')}/>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('landingPage')}>
              Landing Page
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('households')}>
                Clients
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('inventoryPage')}>
                Inventory
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('mealsPage')}>
                Meals
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('reports')}>
                Reports
            </Button>
            <Button color='lightGreen' variant="contained" onClick={() => handlePageClick('userList')}>
                Administration
            </Button>
          </Grid>
          {displayLoginSignup()}
        </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}


export default Navbar;
