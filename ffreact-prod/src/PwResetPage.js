import React from 'react'
import axios from 'axios'
import {useState} from 'react'
import { Typography, Stack, Button, Box, Card, Grid, TextField} from "@mui/material"
import ffLogo from './Images/ff_logo.jpg'

// PW Reset Page Component
// Takes handlePageClick callback function to enable page switching when reset request is complete
// Returns a reset request page component that allows users to enter account information 
const PwResetPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, sendEmail] = useState(
        {
            username: '',
            email: ''
        }
    );

    const sendResetRequest = () => {
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/users/",
            data: user
          }).then((response)=>{
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

    // Handle input change for user password reset
    // Takes input change event information (name, value)
    // Returns none
    const handleResetChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = {...user};
        thisUser[fieldName] = fieldValue;
        sendEmail(thisUser);                                //*** Function needs to be implemented ***/
// Send email if account and email match
    }
    
    // Handle reset form submit
    // Takes reset form event information (form submission)
    // Returns none
    const handleResetSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send reset request to backend
        sendResetRequest();
        // Switch to 'Login Page' page
        handlePageClick('loginPage');
        // TO DO;
    }
    
    // HTML structure of this component
    return (
        <Grid container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
            {/* Logo and Welcome Message (left-side) */}
            <Grid item md={7} sx={{display: {xs: 'none', md: 'block'}}}>
                <Box component='img' sx={{width: '80%'}} src={ffLogo}/>
            </Grid>

            {/* Sign up Box */}
            <Grid item component={Card} md={5} sm={12} elevation='4' sx={{padding: '2em', marginBottom: '5em', height: 'fit-content'}}>
                <Typography variant='h5' sx={{paddingBottom: '1em'}}>Password Reset</Typography>
                <form onSubmit={handleResetSubmit}>
            
                    <Stack sx={{textAlign: 'center', justifyContent: 'center', marginTop: '2em'}}>
                        <TextField
                        type = 'text'
                        maxLength = '30' 
                        label = 'Username'
                        name = 'username' 
                        value = {user.username} 
                        onChange = {handleResetChange}
                        />

                        <TextField
                        type = 'text'
                        maxLength = '30' 
                        label = 'Email'
                        name = 'email'
                        value = {user.email} 
                        onChange = {handleResetChange}
                        />
                        <Button color='lightGreen' variant='contained' type='Submit' onClick={sendResetRequest}>
                            Submit
                        </Button>
                    </Stack>            
                </form>
            </Grid>
        </Grid>
    );
}

export default PwResetPage;