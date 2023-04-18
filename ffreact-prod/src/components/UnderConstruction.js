import React from 'react'
import { Fragment } from 'react'
import { Typography, Grid } from '@mui/material'
import constructionImage from '../Images/construction.png'

// construction image source https://www.reshot.com/free-vector-illustrations/item/construction-workers-DC8L5WUP23/
// image license https://www.reshot.com/license/
// image license user terms https://www.reshot.com/terms/

const UnderConstruction = (props) => {
    // const handlePageClick = props.handlePageClick;

    // HTML structure of this component
    return (
        <Fragment>
            <Typography variant='h3' sx={{textAlign: 'center', marginTop: '.5em', marginBottom: '.5em'}}>
                Under Construction
            </Typography>
            <Grid container justifyContent={'center'} sx={{width: '100%'}}>
                <Grid item alignSelf='center' sx={{height: {lg: '40%', md: '60%', sm: '85%'}, width: {lg: '40%', md: '60%', sm: '85%'}}}>
                    <img style={{objectFit: 'contain', width: '100%', height: '100%'}} src={constructionImage} alt="Under Construction"/>            
                </Grid>
            </Grid>
            <Typography variant='h6' sx={{textAlign: 'center'}}>This page is currently under construction!</Typography>
            <Typography variant='h6' sx={{textAlign: 'center'}}>Check back later to see what this page has to offer...</Typography>
        </Fragment>
    );
}

export default UnderConstruction;