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
            <Button color='lightGreen' variant='contained' onClick={() => props.handlePageClick('ingredients')}>
                <Typography color='white'>Ingredients</Typography>
            </Button>
            <Button color='lightGreen' variant='contained' onClick={() => props.handlePageClick('packaging')}>
                <Typography color='white'>Packaging</Typography>
            </Button>
        </Fragment>
    );
}

export default LandingPage;