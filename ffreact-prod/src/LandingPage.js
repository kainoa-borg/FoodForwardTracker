import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'


const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Fragment>
            <h3>Landing Page</h3>
            <button onClick={() => handlePageClick('households')}>
                Clients
            </button>
            <button onClick={() => handlePageClick('ingredients')}>
                Inventory
            </button>
            <button onClick={() => handlePageClick('recipes')}>
                Meals
            </button>
            <button onClick={() => handlePageClick('reportsPage')}>
                Reports
            </button>
            <button onClick={() => handlePageClick('userPage')}>
                Administration
            </button>
        </Fragment>
    );
}

export default LandingPage;