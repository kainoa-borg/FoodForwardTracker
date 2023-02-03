import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Container, Button, Typography } from '@mui/material'


const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <header  className="App-header">
        <Fragment>
            <h2>Landing Page</h2>
            <Button variant='contained' onClick={() => handlePageClick('households')}>
                Clients
            </Button>
            <Button variant='contained' onClick={() => handlePageClick('mealsPage')}>
                Meals
            </Button>
            <Button variant='contained' onClick={() => handlePageClick('inventoryPage')}>
                Inventory
            </Button>
            <Button variant='contained' onClick={() => handlePageClick('reports')}>
                Reports
            </Button>
            <Button variant='contained' onClick={() => handlePageClick('userList')}>
                Administration
            </Button>
        </Fragment>
        </header>
    );
}

export default LandingPage;