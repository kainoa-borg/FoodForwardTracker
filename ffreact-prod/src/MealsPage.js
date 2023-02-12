import React from 'react'
import { useState, Fragment } from 'react'
import { Container, Button, Typography } from '@mui/material'
import Dropdown from './components/Dropdown'
import { CssBaseline, Box } from '@mui/material'
import StationList from './Stations/StationList.js'
import Recipe from './Recipe/RecipeList.js'
import MealPlan from './Meals/MealList.js'
import { ThemeProvider, createTheme } from '@mui/material/styles'

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
            case 'recipes': setCurrPage(<Recipe handlePageClick={handlePageClick} />); break;
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
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('recipes')}>
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