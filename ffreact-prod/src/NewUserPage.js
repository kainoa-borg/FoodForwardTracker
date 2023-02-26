import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'
import { Typography, Stack, Button, Box, Card, Grid, TextField} from "@mui/material"
// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const NewUserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, setUser] = useState(
        {
            username: '',
            password: '',
            email: '',
            admin_flag: 0,
        }
    );

    const sendCreateRequest = () => {
        console.log(JSON.stringify(user))
        axios({
            method: "POST",
            url: "http://4.236.185.213:8000/api/users/",
            data: user
        }).then((response) => {
            const data = response.data;
            console.log(data);
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
        // Switch to 'landing' page
        handlePageClick('loginPage');
        // TO DO;
    }

    // HTML structure of this component
    return (


        <Grid container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md={7} sx={{display: {xs: 'none', md: 'block'}}}>
                <Box component='img' sx={{width: '80%'}} src="/Images/ff_logo.jpg"/>
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
                        type = 'text'
                        maxLength = '30' 
                        label = 'Password'
                        name = 'password' 
                        value = {user.password} 
                        onChange = {createNewUser}
                        />

                        <TextField
                        type = 'text'
                        maxLength = '30' 
                        label = 'Email'
                        name = 'email'
                        value = {user.email} 
                        onChange = {createNewUser}
                        />
                        <Button color='lightGreen' variant='contained' type='Submit' onClick={sendCreateRequest}>
                            Submit
                        </Button>
                    </Stack>            
                </form>
            </Grid>
        </Grid>

    );
}

export default NewUserPage;