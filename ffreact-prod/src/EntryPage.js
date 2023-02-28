import * as React from 'react'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { Grid, Typography, Box} from '@mui/material'
import ffLogo from './Images/ff_logo.jpg'
import entryImage from './Images/food_placeholder.jpg'

// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const EntryPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const setLoginState = props.setLoginState;

    const readLoginCookie = () => {
        const parseCookie = str =>
            str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});

        if (document.cookie !== '') {
            return parseCookie(document.cookie);
        }
        else {
            return undefined;
        }
    }

    useEffect(() => {
        let cookieData = readLoginCookie();

        if (cookieData !== undefined) {
            setLoginState({
                username: cookieData.username,
                isAuthenticated: cookieData.isAuthenticated === 'true' ? true : false,
                isAdmin: cookieData.isAdmin === 'true' ? true : false            
            });
        }
    }, [])

    // HTML structure of this component
    return (
        <Grid container direction='row' spacing={6} sx={{bgColor: 'lightBlue'}}>
            <Grid item container direction='column' md={6}>
                <Grid item sx={{overflow: 'hidden'}} md={6}>
                    <Box component='img' sx={{margin: 'auto', width: '70%', height: 'auto'}} src={ffLogo}/>
                </Grid>
                <Grid item md={5}>
                    <Typography variant='h3'>Welcome to Food Forward!</Typography>
                    <Typography variant='h5'>Providing healthy and semi-prepared meals in Central Hillside</Typography>
                    <Button color='darkGreen' variant='contained' sx={{width: '40%', marginTop: '1em', alignSelf: 'center'}} onClick={() => handlePageClick('landingPage')}>Enter</Button>
                </Grid>
            </Grid>
            <Grid item container direction='column' md={6}>
                <Grid item md={5} sx={{overflow: 'hidden', marginRight: '-20%'}}>
                    <Box component='img' sx={{width: '100%', height: 'auto'}} src={entryImage}/>
                </Grid>
                <Grid item md={7} sx={{paddingTop: '3%', width: '70%', alignSelf: 'flex-end'}}>
                    <Typography variant='h4'>Food Forward Functions</Typography>
                    <ul>
                        <li><Typography variant='h6'>Manage Clients</Typography></li>
                        <li><Typography variant='h6'>Manage Ingredient and Packaging Inventory</Typography></li>
                        <li><Typography variant='h6'>Create Recipes</Typography></li>
                        <li><Typography variant='h6'>Plan Meals for delivery</Typography></li>
                        <li><Typography variant='h6'>Receive Reports on Food Forward</Typography></li>
                    </ul>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EntryPage;