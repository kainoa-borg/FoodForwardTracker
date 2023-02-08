import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Container, Button, Typography } from '@mui/material'


const MealsPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Fragment>
            <h2>Meals Page</h2>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('meals')}>
                Meal Plan
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('recipes')}>
                Recipes
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => handlePageClick('stations')}>
                Stations
            </Button>
        </Fragment>
    );
}

export default MealsPage;