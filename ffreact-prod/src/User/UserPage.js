import React from 'react'
import axios from 'axios'
import { useState, useEffect} from 'react'
import { Typography, Stack, Input, InputLabel, Button, Box, Card, Grid, TextField} from "@mui/material"
import Error from '../Error.js'
import ffLogo from '../Images/ff_logo.jpg'

const UserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const cookies = document.cookie.split(';');
    const [editUser, setEdituser] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);
    const [user, setUser] = useState(
        {
            username: cookies[1].split('='),
            isAuthenticated: cookies[2],
            isAdmin: cookies[3],
            password: '',
            email: ''
        }
    );

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleResetChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = {...user};
        thisUser[fieldName] = fieldValue;   
    }

    const getUserInfo = () => {
        console.log("MAKING REQUEST TO DJANGO")
        setLoadingComponent(<Error text="LOADING DATA..."/>);
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/users/"+user.username[1]+'/',
          }).then((response)=>{
            const userData = response.data
            setUser(userData);
            setLoadingComponent(null);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }
   
  /*  const handleEditClick = (key) => {
        setEditPackagingID(key);
        setEditFormData(packaging[key]);
    }
    const handleCancelClick = () => {
        setEditPackagingID(null);
        setEditFormData(null);
    } */

   /* const getLoginCookie = (cookie) => {
        username = cookie.username
        isAuthenticated = cookie.isAuthenticated
        isAdmin = cookie.isAdmin
    }*/

    // HTML structure of this component
    return (

        <Grid container spacing='12' sx={{margin: 'auto', marginTop: '1em', maxWidth: '90%', justifyContent: 'center', alignItems: 'center'}}>
            
        {/* Logo and Welcome Message (left-side) */}
        <Grid item md={7} sx={{display: {xs: 'none', md: 'block'}}}>
            <Box component='img' sx={{width: '80%'}} src={ffLogo}/>
        </Grid>

        {/* Sign up Box */}
        <Grid item component={Card} md={5} sm={12} elevation='4' sx={{padding: '2em', marginBottom: '2em', height: 'fit-content'}}>
            <Typography variant='h5' sx={{paddingBottom: '1em'}}>User Account</Typography>
                <Grid container direction='row' spacing={4} sx={{textAlign: 'left', justifyContent: 'left', marginTop: '1em'}}>
                    <Grid item>
                    <Typography variant='h6' sx={{paddingBottom: '1em'}}>User Name: {user.username[1]}</Typography>
                    <Button color='lightGreen' variant='contained' type='Submit' onClick={() => handlePageClick('pwResetPage')}>
                        Change Username
                    </Button>                   
                    
                    <Typography variant='h6' sx={{paddingBottom: '1em', paddingTop: '1em'}}>Password: </Typography>
                    <Button color='lightGreen' variant='contained' type='Submit' onClick={() => handlePageClick('pwResetPage')}>
                        Change Password
                    </Button>

                    <Typography variant='h6' sx={{paddingBottom: '1em', paddingTop: '1em'}}>Email: {user.email}</Typography> 
                    <Button color='lightGreen' variant='contained' type='Submit' onClick={() =>  handlePageClick('UserPage')}>
                        Update Email
                    </Button>
                    </Grid> 
                </Grid>                
        </Grid>
    </Grid>
    );
}

export default UserPage;

