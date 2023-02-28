import * as React from 'react'
import {useState} from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import { Grid, Typography, Stack, Box} from '@mui/material'
import TextField from '@mui/material/TextField'
import { Card } from '@mui/material'

import ffLogo from './Images/ff_logo.jpg'

// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const LoginPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const setLoginState = props.setLoginState;
    
    
    const [errorState, setErrorState] = useState('');

    const [user, setUser] = useState(
        {
            username: '',
            password: ''
        }
    );

    const setLoginCookie = (username, isAuthenticated, isAdmin) => {
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        now.setTime(expireTime);
        document.cookie = 'username='+username+';'+'expires='+expireTime+';'
        document.cookie = 'isAuthenticated='+isAuthenticated+';'+'expires='+expireTime+';'
        document.cookie = 'isAdmin='+isAdmin+';'+'expires='+expireTime+';'
    }

    const sendLoginRequest = () => {
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/user-auth/",
            data: user
          }).then((response)=>{
            console.log(response.data);
            if (response.data === 200) {
                // Log in success
                setLoginState({
                    username: user.username,
                    isAuthenticated: true,
                    isAdmin: true
                });
                // Set the cookie login data
                setLoginCookie(user.username, 'true', 'true');
                handlePageClick('landingPage');
            }
            else if (response.data === 500) {
                // Password incorrect
                console.log('user not found');
                setErrorState('usernameError');
                setLoginState({
                    username: undefined,
                    isAuthenticated: false,
                    isAdmin: false
                })
            }
            else if (response.data === 400) {
                // User not found
                console.log('password incorrect');
                setErrorState('pwError');
                setLoginState({
                    username: user.username,
                    isAuthenticated: false,
                    isAdmin: false
                })
            }
          }).catch((error) => {
            if (error.response) {
            //   console.log(error.response);
            //   console.log(error.response.status);
            //   console.log(error.response.headers);
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
        <Grid container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md={7} sx={{display: {xs: 'none', md: 'block'}}}>
                <Box component='img' sx={{width: '80%'}} src={ffLogo}/>
                <Typography variant='h3' sx={{paddingBottom: '1em'}}>Welcome to Food Forward!</Typography>
            </Grid>

            {/* Login Box */}
            <Grid item component={Card} md={5} sm={12} elevation='4' sx={{padding: '2em', marginBottom: '5em', height: 'fit-content'}}>
                <Typography variant='h5' sx={{paddingBottom: '1em'}}>Sign In</Typography>
                <form onSubmit={handleLoginSubmit}>
            
                    <Stack>
                        <TextField 
                            error={errorState === 'usernameError'}
                            id='outlined-error-helper-text'
                            helperText={errorState === 'usernameError' ? 'User not found!': ''}
                            type='Text' 
                            maxLength='30' 
                            label='Username' 
                            name='username' 
                            value={user.username}
                            onChange={handleLoginChange}/>
                        <TextField 
                            error={errorState === 'pwError'}
                            id='outlined-error-helper-text'
                            helperText={errorState === 'pwError' ? 'Incorrect password' : ''}
                            type='password'
                            maxLength='30' 
                            label='Password' 
                            name='password' 
                            value={user.password} 
                            onChange={handleLoginChange}/>
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