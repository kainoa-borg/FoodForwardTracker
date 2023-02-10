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


// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const LoginPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, setUser] = useState(
        {
            username: '',
            password: ''
        }
    );

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

    // HTML structure of this component
    return (
        <Grid item container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md='7' sx={{display: {xs: 'none', md: 'block'}}}>
                <Box component='img' sx={{width: '80%'}} src="/Images/ff_logo.jpg"/>
                <Typography variant='h3' sx={{paddingBottom: '1em'}}>Welcome to Food Forward!</Typography>
            </Grid>

            {/* Login Box */}
            <Grid item component={Card} md='5' sm='12' elevation='4' sx={{padding: '2em', marginBottom: '5em', height: 'fit-content'}}>
                <Typography variant='h5' sx={{paddingBottom: '1em'}}>Sign In</Typography>
                <form onSubmit={handleLoginSubmit}>
            
                    <Stack>
                        <TextField type='Text' maxLength='30' label='Username' name='username' value={user.username} onChange={handleLoginChange}/>
                        <TextField type='password' maxLength='30' label='Password' name='password' value={user.password} onChange={handleLoginChange}/>
                        <Button color='lightGreen' variant='contained' type='Submit' onClick={sendLoginRequest}>
                            Log In
                        </Button>
                    </Stack>
            
                    <Stack sx={{textAlign: 'center', justifyContent: 'center', marginTop: '2em'}}>
                        <Typography>
                            Don't have an account?
                        </Typography>
                        <Button color='darkGreen'variant='outlined' size='small' onClick={() => handleCreateClick('newUserPage')}>
                            Sign Up
                        </Button>
                        <Typography>
                            Forgot your password?
                        </Typography>
                        <Button color='darkGreen' variant='outlined' size='small' onClick={() => handleResetClick('pwResetPage')}>
                            Reset Password
                        </Button>
                    </Stack>            
                </form>
            </Grid>
        </Grid>
    );
}

export default LoginPage;