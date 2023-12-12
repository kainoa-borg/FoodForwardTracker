import React from 'react'
import { useState, useEffect } from 'react';
import { Box, List, Typography } from '@mui/material'; 
import { Button } from '@mui/material';
import {ReactPDF, Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer'

const StationInstructions = (props) => {
    const instructions = props.instructions;
    const mealPlan = props.mealPlan
    const handleClose = props.handleClose;
    const [stationComponents, setStationComponents] = useState();

    const Divider = () => (
        <div style={{ height: '1px', borderTop: '1px solid #C5CAE9' }} />
    );

    const handlePrint = () => {
        window.print();
    }

    useEffect(() => {
        setStationComponents(instructions.map((station) => {
            return (
            <Box sx={{breakAfter: 'all'}}>
            <Box sx={{display: 'flex', flexDirection: 'column' , paddingY: '.5rem'}}>
                        <Divider/>
                        <Typography variant='h6' sx={{fontWeight: 'bold'}}>Station: {station.stn_name}</Typography>
                        <Typography variant='p' sx={{width: '50%', marginBottom: '1rem'}}>Description: {station.stn_desc}</Typography>
                        {
                            station.servings.map((serving) => {
                                console.log(serving);
                                return ( 
                                <Box sx={{paddingLeft: '.5rem', paddingY: '.1rem', border: 1, width: '90%', margin: 'auto'}}>
                                    <Typography variant='h7' sx={{fontWeight: 'bold'}}>{serving.meal_servings} servings ({serving.households.length})</Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
                                        <List sx={{listStyleType: 'disc', minWidth: '25%'}}>
                                            <Typography variant='h7' sx={{fontWeight: 'bold'}}>Ingredients</Typography>
                                            {serving.ingredients.map((ing) => 
                                                <Typography sx={{display: 'list-item'}} variant='p'>{ing.ing_amt} {ing.ing_unit} {ing.ing_name}</Typography>
                                            )}
                                        </List>
                                        <List sx={{listStyleType: 'disc', minWidth: '25%'}}>
                                        <Typography variant='h7' sx={{fontWeight: 'bold'}}>Clients</Typography>
                                            {serving.households.map((household) => 
                                                <Typography sx={{display: 'list-item'}} variant='p'>{household.hh_first_name} {household.hh_last_name}</Typography>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                            )})
                        }
                    </Box>
                    <div style={{pageBreakAfter: 'always', height: 0, display: 'block', clear: 'both'}}></div>
                </Box>
            )
        }))
    }, [instructions])

    return (
        <Box sx={{padding: '1%', maxWidth: '800px', minWidth: '40%', paddingX: '2rem',}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h5' sx={{fontWeight: 'bold'}}>Station Instructions</Typography>
                <Box sx={{displayPrint: 'none'}}>
                    <Button variant='contained' onClick={handlePrint}>Print</Button>
                    <Button variant='contained' onClick={handleClose}>Close</Button>
                </Box>
            </Box>
            <Typography variant='h6' sx={{fontWeight: 'bold'}}>Meal: {mealPlan.meal_name}</Typography> 
            <Typography variant='h6' sx={{fontWeight: 'bold'}}>Snack: {mealPlan.snack_name}</Typography>
            <Box sx={{display: 'flex', spacing: '1'}}> 
                <Typography variant='h6' sx={{paddingRight: '1rem', fontWeight: 'bold'}}>Date: {mealPlan.m_date} Total Servings: {mealPlan.meal_servings}</Typography>
            </Box>
            {stationComponents}
        </Box>
    )
}

export default StationInstructions;