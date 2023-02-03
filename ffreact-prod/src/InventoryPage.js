import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Container, Button, Typography } from '@mui/material'


const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Fragment>
            <h2>Landing Page</h2>
            <Button variant='contained' onClick={() => handlePageClick('ingredients')}>
                Ingredients
            </Button>
            <Button variant='contained' onClick={() => handlePageClick('packaging')}>
                Packaging
            </Button>
        </Fragment>
    );
}

export default LandingPage;