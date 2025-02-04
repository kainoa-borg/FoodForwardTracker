import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Typography, Stack, Button, Box, Card, Grid, TextField, Snackbar} from "@mui/material"
import ffLogo from '../Images/ff_logo.jpg'
import { createSearchParams } from 'react-router-dom'

// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const NewUserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const navigate = props.navigate;
    const [user, setUser] = useState(
        {
            username: '',
            password: '',
            email: '',
            admin_flag: 0,
        }
    );
    const [errorSBOpen, setErrorSBOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        if (errorMessage) {
            setErrorSBOpen(true);
        }
    }, [errorMessage])

    const sendCreateRequest = () => {
        console.log(JSON.stringify(user));
        axios({
            method: "POST",
            url: process.env.REACT_APP_API_URL + "users/",
            data: user
        }).then((response) => {
            // handlePageClick('loginPage');
            let params = {
                successMessage: "Account created! Please log in."
            }
            navigate({pathname: "login", search: `?${createSearchParams(params)}`})
            const data = response.data;
            console.log(data);
        }).catch((error) => {
            if (error.response) {
                if (error.response.data.errorText) {
                    setErrorMessage(error.response.data.errorText);
                }
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }

    // Handle input change for user login
    // Takes input change event information (name, value)
    // Returns none
    const createNewUser = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = { ...user };
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
    }

    // Handle login form submit
    // Takes login form event information (form submission)
    // Returns none
    const handleCreateUser = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send login to backend
        sendCreateRequest();
    }

    const handleSBClose = (event, reason, setOpen) => {
        // if (reason === "clickaway") {
        //     setOpen(false);
        // }
        setOpen(false);
    }

    // HTML structure of this component
    return (
        <Grid container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md={7} sx={{display: {xs: 'none', md: 'block'}}}>
                <Box component='img' sx={{width: '80%'}} src={ffLogo}/>
                <Typography variant='h3' sx={{paddingBottom: '1em'}}>Welcome to Food Forward!</Typography>
            </Grid>

            {/* Sign up Box */}
            <Grid item component={Card} md={5} sm={12} elevation='4' sx={{padding: '2em', marginBottom: '5em', height: 'fit-content'}}>
                <Typography variant='h5' sx={{paddingBottom: '1em'}}>Create New User</Typography>
                <form onSubmit={handleCreateUser}>
            
                    <Stack sx={{textAlign: 'center', justifyContent: 'center', marginTop: '2em'}}>
                        <TextField
                        type = 'text'
                        maxLength = '30' 
                        label = 'Username'
                        name = 'username' 
                        value = {user.username} 
                        onChange = {createNewUser}
                        />
                        
                        <TextField
                        type='password'
                        maxLength = '30' 
                        label = 'Password'
                        name = 'password' 
                        value = {user.password} 
                        onChange = {createNewUser}
                        />

                        <TextField
                        type = 'email'
                        maxLength = '30' 
                        label = 'Email'
                        name = 'email'
                        value = {user.email} 
                        onChange = {createNewUser}
                        />
                        <Button color='lightGreen' variant='contained' type='Submit' onClick={handleCreateUser}>
                            Submit
                        </Button>
                    </Stack>            
                </form>
            </Grid>
            <Snackbar
                open={errorSBOpen}
                autoHideDuration={3000}
                onClose={(event, reason) => handleSBClose(event, reason, setErrorSBOpen)}
                message={errorMessage}
            />
        </Grid>
    );
}

export default NewUserPage;