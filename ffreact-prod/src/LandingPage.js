import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { Container, Button, Typography, Card, Grid, CardContent, CardActionArea } from '@mui/material'


const LandingPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Grid 
            container 
            justifyContent='space-around' 
            alignItems='stretch'
            direction='row'
            spacing={2}
            sx={{maxHeight: '40vh', maxWidth: '80vw', margin: 'auto'}}>
            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('households')}>
                        <CardContent>
                            <Typography component='div' variant='h5'>Clients</Typography>
                            <Typography component='div' variant='body1'>- View client information</Typography>
                            <Typography component='div' variant='body1'>- Add/Update client information</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('mealsPage')}>
                        <CardContent>
                            <Typography component='div' variant='h5'>Meals</Typography>
                            <Typography component='div' variant='body1'>- View meals</Typography>
                            <Typography component='div' variant='body1'>- Add/Update meals</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('inventoryPage')}>
                        <CardContent>
                            <Typography component='div' variant='h5'>Inventory</Typography>
                            <Typography component='div' variant='body1'>- View ingredients and packaging</Typography>
                            <Typography component='div' variant='body1'>- Add/Update ingredients and packaging</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('reports')}>
                        <CardContent>
                            <Typography component='div' variant='h5'>Reports</Typography>
                            <Typography component='div' variant='body1'>- View reports</Typography>
                            <Typography component='div' variant='body1'>- Print or send reports via email</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>

            <Grid item sm={12} md={4}>
                <Card elevation='4' sx={{height: '100%'}}>
                    <CardActionArea sx={{height: '100%'}} onClick={() => handlePageClick('userList')}>
                        <CardContent>
                            <Typography component='div' variant='h5'>Administration</Typography>
                            <Typography component='div' variant='body1'>- View users in the system</Typography>
                            <Typography component='div' variant='body1'>- Add/Edit users</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>    
            </Grid>
        </Grid>
    );
}

export default LandingPage;