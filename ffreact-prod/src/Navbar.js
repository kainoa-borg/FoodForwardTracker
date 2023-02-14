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

import { AppBar, Typography, Toolbar, Tabs, Button, useMediaQuery, useTheme} from "@mui/material"

const PAGES = ["Landing Page", "Clients", "Households", "Inventory", "Meals", "Reports", "Administration"]
  console.log(PAGES)
const Navbar = () => {
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
    isAdmin: false
})
    const [currPage, setCurrPage] = useState();
    const [value, setValue] = useState();
    const theme = useTheme();
      console.log(theme);
    const isMatch = useMediaQuery(theme.breakpoints.down(""))
      console.log(isMatch)
      const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
          case 'loginPage': setCurrPage(<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />); break;
          case 'newUserPage': setCurrPage(<NewUserPage handlePageClick={handlePageClick} />); break;
          case 'landingPage': setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
          case 'households': setCurrPage(<HouseholdList handlePageClick={handlePageClick} />); break;
          case 'householdForm': setCurrPage(<HouseholdForm />); break;
          case 'mealsPage': setCurrPage(<MealsPage handlePageClick={handlePageClick} />); break;
          case 'InventoryPage': setCurrPage(<InventoryPage handlePageClick={handlePageClick} />); break;
          case 'reports': setCurrPage(<ReportsPage handlePageClick={handlePageClick} />); break;
          case 'userPage': setCurrPage(<userPage handlePageClick={handlePageClick} />); break;
          case 'userList': setCurrPage(<UserList handlePageClick={handlePageClick} />); break;
         
    }
  }
  return (
    <React.Fragment>
      <AppBar sx={{ marginLeft: 'auto', background: '#9AB847'}}>
        <Toolbar>
        <Typography component='img' sx={{width: '40%'}} src="/Images/ff_logo.jpg"/>
          <Tabs
          value={value}
          onChange={(e, value) => setValue(value)}
          >
            </Tabs>
                <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('landingPage')}>
                    Landing Page
                </Button>
                <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('households','householdForm')}>
                    Clients
                </Button>
                <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('InventoryPage')}>
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
          <Button sx={{marginLeft: "6%"}} color='lightGreen' variant="contained" onClick={() => handlePageClick('loginPage')
          }>Login{""}</Button>
          <Button sx={{marginLeft: "auto%"}} color='lightGreen' variant="contained" onClick={() => handlePageClick('newUserPage')}>Sign Up{""}</Button>
        </Toolbar>
      </AppBar>
      <div style={{paddingTop: '2.9%'}}>
        {currPage}
        </div>
    </React.Fragment>
  )
}


export default Navbar;
