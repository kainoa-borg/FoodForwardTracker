import * as React from 'react'
import {useState} from 'react'
import {Fragment} from 'react'
import axios from 'axios'
import NewUserPage from "./NewUserPage.js"
import PwResetPage from './PwResetPage.js'

import Button from '@mui/material/Button'
import { Grid, Container, Typography, Stack} from '@mui/material'
import TextField from '@mui/material/TextField'


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
            url:"http://localhost:8000/api/users/"
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
        <Grid item container spacing='12' marginTop='4em' justifyContent='center'>
            <Grid item xs={6} justifyContent='space-between'>
                <img width='50%' src="https://static.wixstatic.com/media/961f8a_8d810ec655dc4874a0c0356adf4430ce~mv2.png/v1/fill/w_142,h_107,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/961f8a_8d810ec655dc4874a0c0356adf4430ce~mv2.png"></img>
                <Typography paddingTop='1em' variant='h4'>Welcome to Food Forward</Typography>
            </Grid>
            <Grid item xs={6}>
                <form onSubmit={handleLoginSubmit}>
                    <Stack maxWidth='50%'>
                        <TextField type='Text' maxLength='30' label='Username' name='username' value={user.username} onChange={handleLoginChange}/>
                        <TextField type='password' maxLength='30' label='Password' name='password' value={user.password} onChange={handleLoginChange}/>
                        <Button variant='contained' type='Submit' onClick={sendLoginRequest}>
                            Log In
                        </Button>
                        <Typography textAlign='center'>
                            Don't have an account?
                        </Typography>
                        <Button variant='outlined' size='small' onClick={() => handleCreateClick('newUserPage')}>
                            Sign Up
                        </Button>
                        <Typography textAlign='center'>
                            Forgot your password?
                        </Typography>
                        <Button variant='outlined' size='small' onClick={() => handleResetClick('pwResetPage')}>
                            Reset Password
                        </Button>
                    </Stack>
                </form>
            </Grid>
        </Grid>
    );
}

export default LoginPage;