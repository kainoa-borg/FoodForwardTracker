import * as React from 'react'
import {useState} from 'react'
import {Fragment} from 'react'
import axios from 'axios'
import NewUserPage from "./NewUserPage.js"
import PwResetPage from './PwResetPage.js'

import Button from '@mui/material/Button'
import { Grid, Typography, Stack, Paper, Box} from '@mui/material'
import TextField from '@mui/material/TextField'
import { Card } from '@mui/material'
import Slider from 'react-slick'

// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const EntryPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, setUser] = useState(
        {
            username: '',
            password: ''
        }
    );
    const [carouselIndex, setCarouselIndex] = useState(0);

    const sendLoginRequest = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/users/"
          }).then((response)=>{
            let userInList = false;
            let userData = undefined;
            for (let i = 0; i < response.data.length; ++i) {
                if (response.data[i].username === user.username) {
                    if (response.data[i].password === user.password) {
                        userInList = true;
                        userData = response.data[i];
                    }
                }
            }
            if (userInList) {
                props.setLoginState(userData);
                handlePageClick('landingPage');
            }
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Handle input change for user login
    // Takes input change event information (name, value)
    // Returns none
    const handleLoginChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = {...user};
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
        console.log(user.username, user.password)
    }
    
    // Handle login form submit
    // Takes login form event information (form submission)
    // Returns none
    const handleLoginSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send login to backend
        sendLoginRequest();
        // Switch to 'landing' page
        //handlePageClick('landingPage');
        // TO DO;
    }

    const handleCreateClick = (event) => {
        handlePageClick('newUserPage');
        //else if (pageName === 'pwResetPage') setCurrPage(<PwResetPage handlePageClick={handlePageClick} />);
    }

    const handleResetClick = (event) => {
        handlePageClick('pwResetPage');
    }

    const handleChangeIndex = index => {
        setCarouselIndex({
            index
        });
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    // HTML structure of this component
    return (
        <Grid container direction='row' spacing='12' sx={{marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md='7' sx={{display: {xs: 'none', md: 'block'}}}>
                <Stack justifyContent={'space-around'}>
                    <Box component='img' sx={{width: '50%'}} src="/Images/ff_logo.jpg"/>
                    <Typography variant='h3'>Welcome to Food Forward!</Typography>
                    <Typography variant='h5' sx={{paddingBottom: '1em'}}>Providing healthy and semi-prepared meals in Central Hillside</Typography>
                </Stack>
            </Grid>
            <Grid item>
                <Slider settings={settings}>
                    <Box key={0} component='img' src='./Images/ff_logo.jpg'></Box>
                    <Box key={1} component='img' src='./Images/ff_logo.jpg'></Box>
                    <Box key={2} component='img' src='./Images/ff_logo.jpg'></Box>
                </Slider>
            </Grid>
        </Grid>
    );
}

export default EntryPage;