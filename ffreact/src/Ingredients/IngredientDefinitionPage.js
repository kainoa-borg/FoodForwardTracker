import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'No Category', value: 0 },
    { name: 'Fruits', value: 1 },
    { name: 'Vegetables', value: 2 },
    { name: 'Dairy', value: 3 },
    { name: 'Protein', value: 4 },
    { name: 'Grains', value: 5 },
    { name: 'Specialty', value: 6 },
    { name: 'Condiments', value: 7 },
];

export default function IngredientDefinitionPage() {
    const navigate = useNavigate(); // Hook for navigation

    const navigateToCategory = (categoryId, subcategoryId = null) => {
        const path = subcategoryId !== null 
            ? `/ingredients/${categoryId}/subcategory/${subcategoryId}` 
            : `/ingredients/${categoryId}`;
        navigate(path);
    };

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
                                onClick={() => navigateToCategory(category.value)} // Updated navigation logic
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
                    onClick={() => navigate('/ingredients')}
                >
                    View All Ingredients
                </Button>
            </Box>
        </div>
    );
}
