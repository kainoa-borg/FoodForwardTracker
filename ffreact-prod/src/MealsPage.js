import React, { useState } from 'react'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import Dropdown from './components/Dropdown'
import StationList from './Stations/StationList.js'
import RecipePage from './Recipe/RecipePage.js'
import Recipe from './Recipe/Recipe.js'
import MealPlan from './Meals/MealList.js'
import MealPlanPage from './Meals/MealPlanPage.js'


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

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex-box',
    justifyContent: 'space-between',
};

const MealsPage = (props) => {
    const [currPage, setCurrPage] = useState();
    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'stations': setCurrPage(<StationList handlePageClick={handlePageClick} />); break;
            case 'meals': setCurrPage(<MealPlan handlePageClick={handlePageClick} />); break;
            case 'mealsPage': setCurrPage(<MealPlanPage handlePageClick={handlePageClick} />); break;
            case 'recipePage': setCurrPage(<RecipePage setCurrPage={setCurrPage}></RecipePage>); break;
            case 'recipe': setCurrPage(<Recipe/>); break;
        }
    } 
    // HTML structure of this component
    return (
        <ThemeProvider theme={theme}>
        <div style={style}>
        <CssBaseline />
        <Dropdown
            trigger={<Button color='lightGreen' variant='contained'> Meal Options</Button>}
            menu={[
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('meals')}>
                    Meal Plans</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('recipePage')}>
                    Recipes</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('stations')}>
                    Stations</button>
                ]}/>
            {currPage}
        </div>
        </ThemeProvider>
    );   
}

export default MealsPage;