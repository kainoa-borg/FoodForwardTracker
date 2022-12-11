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
                Households
            </button>
            <button onClick={() => handlePageClick('ingredients')}>
                Ingredients
            </button>
            <button onClick={() => handlePageClick('packaging')}>
                Packaging
            </button>
        </Fragment>
    );
}

export default LandingPage;