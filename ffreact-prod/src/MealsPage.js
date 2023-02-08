import React from 'react'
import { useState, Fragment } from 'react'
import { Container, Button, Typography } from '@mui/material'
import Dropdown from './components/Dropdown'
import { CssBaseline, Box } from '@mui/material'
import StationList from './Stations/StationList.js'
import Recipe from './Recipe/RecipeList.js'
import MealPlan from './Meals/MealList.js'

/*
class handleMenu extends React.Component {
    handleClick() {
        console.log('this is:', this);
    }
    render() {
        return (      
        <button onClick={() => this.handleClick()}>        
            Click me
        </button>
      );
    }
  }
*/

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex',
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
        <div style={style}>
        <CssBaseline />
        <Dropdown
            trigger={<button> Meal Options</button>}
            menu={[
                <button ref={props.ref} type="button" onClick={() => handlePageClick('meals')}>
                    Meal Plans</button>,
                <button ref={props.ref} type="button" onClick={() => handlePageClick('recipes')}>
                    Recipes</button>,
                <button ref={props.ref} type="button" onClick={() => handlePageClick('stations')}>
                    Stations</button>
                ]}/>
            {currPage}
        </div>
    );   
}

export default MealsPage;