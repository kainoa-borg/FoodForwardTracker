import React from 'react'
import { Fragment } from 'react'
import { Typography, Card, Grid, CardContent, CardActionArea, Button } from '@mui/material'
import { Stack } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Dropdown from './components/Dropdown';

const cardStyle = {
    height: '100%',
    borderWidth: '.1rem',
}

const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;

    // HTML structure of this component
    return (
        <Fragment>
            <Typography variant='h3' sx={{textAlign: 'center', marginTop: '.5em', marginBottom: '1em'}}>
                Welcome to Food Forward!
            </Typography>

            <Grid 
            container 
            justifyContent='center' 
            alignItems='stretch'
            direction='row'
            spacing={2}
            sx={{maxHeight: '40vh', maxWidth: '80vw', margin: 'auto'}}>
            <Grid item sm={12} md={4}>
                <Card variant='outlined' sx={cardStyle}>
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
                <Dropdown
                    trigger={
                    <Card variant='outlined' sx={cardStyle}>
                    <CardActionArea sx={{height: '100%'}}/*onClick={() => handlePageClick('mealsPage')}*/>
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
                    }
                    menu={[
                        <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meals')}>
                            Meal Plans</Button>,
                        <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('recipePage')}>
                            Recipes</Button>
                        ]}
                />
            </Grid>

            <Grid item sm={12} md={4}>
                <Dropdown
                trigger={
                <Card variant='outlined' sx={cardStyle}>
                    <CardActionArea sx={{height: '100%'}}>
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
                }
                menu={[
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredientPage')}>
                        Ingredients</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packagingPage')}>
                        Packaging</Button>
                ]}/>
                    
            </Grid>

            <Grid item sm={12} md={4}>
                <Dropdown
                sx={{ alignItems: 'left' }}
                trigger={
                <Card variant='outlined' sx={cardStyle}>
                    <CardActionArea sx={{height: '100%'}}>
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
                }
                menu={[
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Households Report</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredients-report')}>
                        Ingredients Report</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Packaging Report</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Purchasing Report</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Packaging Returns</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Meal Plan Report</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Meal History</Button>,
                    <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                        Cost Totals</Button>,
                ]}/>
            </Grid>

            <Grid item sm={12} md={4}>
                <Card variant='outlined' sx={cardStyle}>
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
        </Fragment>
    );
}

export default LandingPage;