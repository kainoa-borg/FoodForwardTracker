import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Container, Button, Typography, Card, Grid, CardContent, CardActionArea, List, Icon } from '@mui/material'
import { Stack } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Grid 
            container 
            justifyContent='center' 
            alignItems='stretch'
            direction='row'
            spacing={2}
            sx={{maxHeight: '40vh', maxWidth: '80vw', margin: 'auto'}}>
            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('households')}>
                        <CardContent>
                            <Stack spacing={4} justifyContent='space-between' direction='row'>
                                <div>
                                    <Typography component='h5' variant='h5'>Clients</Typography>
                                    <ul>
                                        <li><Typography component='p' variant='body1'>View client information</Typography></li>
                                        <li><Typography component='p' variant='body1'>Add/Update client information</Typography></li>
                                    </ul>
                                </div>
                                <HouseIcon color='darkBlue' fontSize='large' sx={{}}></HouseIcon>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('mealsPage')}>
                        <CardContent>
                            <Stack spacing={4} justifyContent='space-between' direction='row'>
                                <div>
                                    <Typography component='h5' variant='h5'>Meals</Typography>
                                    <ul>
                                        <li><Typography component='p' variant='body1'>View meals</Typography></li>
                                        <li><Typography component='p' variant='body1'>Add/Update meals</Typography></li>
                                    </ul>
                                </div>
                                <RestaurantIcon fontSize='large'></RestaurantIcon>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('InventoryPage')}>
                        <CardContent>
                            <Stack spacing={4} justifyContent='space-between' direction='row'>
                                <div>
                                    <Typography component='h5' variant='h5'>Inventory</Typography>
                                    <ul>
                                        <li><Typography component='p' variant='body1'>View ingredients and packaging</Typography></li>
                                        <li><Typography component='p' variant='body1'>Add/Update ingredients and packaging</Typography></li>
                                    </ul>
                                </div>
                                <InventoryIcon fontSize='large'></InventoryIcon>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('reports')}>
                        <CardContent>
                            <Stack spacing={4} justifyContent='space-between' direction='row'>
                                <div>
                                    <Typography component='h5' variant='h5'>Reports</Typography>
                                    <ul>
                                        <li><Typography component='p' variant='body1'>View reports</Typography></li>
                                        <li><Typography component='p' variant='body1'>Print or send reports via email</Typography></li>
                                    </ul>
                                </div>
                                <AssessmentIcon fontSize='large'></AssessmentIcon>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('userList')}>
                        <CardContent>
                            <Stack spacing={4} justifyContent='space-between' direction='row'>
                                <div>
                                    <Typography component='h5' variant='h5'>Administration</Typography>
                                    <ul>
                                        <li><Typography component='p' variant='body1'>View users in the system</Typography></li>
                                        <li><Typography component='p' variant='body1'>Add/edit users</Typography></li>
                                    </ul>
                                </div>
                                <AdminPanelSettingsIcon fontSize='large'></AdminPanelSettingsIcon>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>
        </Grid>
    );
}

export default LandingPage;