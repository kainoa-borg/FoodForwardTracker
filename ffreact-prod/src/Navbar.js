import React, { useState } from 'react';
import { AppBar, Button, Typography, Toolbar, Tabs, Grid} from "@mui/material"
import Dropdown from './components/Dropdown'

// const PAGES = ["Landing Page", "Clients", "Households", "Inventory", "Meals", "Reports", "Administration"]
// console.log(PAGES)
  const Navbar = (props) => {
  const [value, setValue] = useState();
  // const theme = useTheme();
  // console.log(theme);
  // const isMatch = useMediaQuery(theme.breakpoints.down(""))
  // console.log(isMatch)
  const loginState = props.loginState;
  const handleLogout = props.handleLogout;

  const displayLoginSignup = () => {
    if (loginState.isAuthenticated) {
      return (
        <Grid item>
          <Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained' onClick={() => handlePageClick('userPage')}>My Account</Button>
          <Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained' onClick={handleLogout}>Sign Out</Button>
        </Grid>
      )
    }
    else {
      return (
        <Grid item>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('loginPage')
            }>Login{""}</Button>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('newUserPage')}>Sign Up{""}</Button>
        </Grid>
      )
    }
  }


  const handlePageClick = props.handlePageClick;
  return (
    <React.Fragment>
      {/* #9AB847 */}
      <AppBar sx={{ background: '#9AB847'}}>
        <Toolbar>
        <Tabs
          value={value}
          onChange={(e, value) => setValue(value)}
        >
        </Tabs>
      
        <Grid container justifyContent='space-between' alignItems='center' direction='row'>
          <Grid item sx={{width: '70%'}} container alignItems='center' direction='row'>
            <Typography component='img' sx={{width: '7%'}} src="ffreact-prod/src/Images/ff_logo.jpg" onClick = {() => handlePageClick('landingPage')}/>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant='contained' onClick={() => handlePageClick('households')}>
                Clients
            </Button>
            <Dropdown
            trigger={<Button color='lightGreen' sx={{boxShadow:'0'}} variant='contained'> Inventory </Button>}
            menu={[
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredientPage')}>
                    Ingredients</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packagingPage')}>
                    Packaging</Button>
                ]}/>
            <Dropdown
            trigger={<Button color='lightGreen' sx ={{boxShadow: '0'}} variant='contained'> Meals </Button>}
            menu={[
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meals')}>
                    Meal Plans</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('recipePage')}>
                    Recipes</Button>
                ]}/>
            <Dropdown
            sx={{ alignItems: 'left' }}
            trigger={<Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained'> Reports </Button>}
            menu={[
              <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('cost-totals')}>
                    Cost Totals</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                    Households Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredients-report')}>
                    Ingredients Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ing-purchase-report')}>
                    Ingredient Purchasing</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meal-history-report')}>
                    Meal History</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meal-plan-report')}>
                    Meal Plan Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('under-construction')}>
                    Package Purchasing</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('under-construction')}>
                    Packaging Returns</Button>,
                ]}/>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('userList')}>
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
