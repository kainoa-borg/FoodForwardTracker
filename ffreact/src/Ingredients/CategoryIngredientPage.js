import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';

const categoryNames = {
    0: "Fruits",
    1: "Vegetables",
    2: "Dairy",
    3: "Protein",
    4: "Grains",
    5: "Specialty",
    6: "Condiments"
};

export default function CategoryIngredientPage() {
    const { categoryId } = useParams();  // Get category ID from URL
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/ingredients/${categoryId}/`)
            .then(response => setIngredients(response.data))
            .catch(error => console.error("Error fetching ingredients:", error));
    }, [categoryId]);

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/ingredient-defs')}>Back to Categories</Button>
            <Typography variant="h5" sx={{ mt: 2 }}>{categoryNames[categoryId]} Ingredients</Typography>

            {ingredients.length > 0 ? (
                <ul>
                    {ingredients.map(ingredient => (
                        <li key={ingredient.ing_name_id}>{ingredient.ing_name}</li>
                    ))}
                </ul>
            ) : (
                <Typography sx={{ mt: 2 }}>No ingredients found for this category.</Typography>
            )}
        </Box>
    );
}
