import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Fruits', value: 0 },
    { name: 'Vegetables', value: 1 },
    { name: 'Dairy', value: 2 },
    { name: 'Protein', value: 3 },
    { name: 'Grains', value: 4 },
    { name: 'Specialty', value: 5 },
    { name: 'Condiments', value: 6 },
];

export default function IngredientDefinitionPage() {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="table-div">
            <Typography id="page-header" variant="h5" gutterBottom>
                Ingredient Categories
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">Select a Category</Typography>
                <Grid container spacing={2} sx={{ mt: 2, maxWidth: 600 }}>
                    {categories.map(category => (
                        <Grid item xs={6} sm={4} key={category.value}>
                            <Paper 
                                elevation={3} 
                                sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} 
                                onClick={() => navigate(`/ingredients/${category.value}`)} // Ensure category.value is passed correctly
                            >
                                <Typography variant="body1">{category.name}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* View All Button */}
                <Button 
                    variant="contained" 
                    sx={{ mt: 4 }} 
                    onClick={() => navigate('/ingredients/all')}
                >
                    View All Ingredients
                </Button>
            </Box>
        </div>
    );
}
