import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem } from '@mui/material';
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

const subCategoryNames = {
    0: ["Melons", "Berries", "Other Fruits"],
    1: ["Dark green Vegetables", "Red/Orange Vegetables", "Starchy Vegetables", "Beans, Peas, Lentils", "Other Vegetables"],
    2: ["Milk", "Cheese", "Yogurt", "Non-Dairy Calcium Alternatives"],
    3: ["Meats", "Poultry", "Seafood", "Eggs", "Nuts/Seeds", "Beans, Peas, Lentils (Protein)"],
    4: ["Whole Grains", "Refined Grains"],
    5: ["Gluten Free", "Vegan", "Allergies"],
    6: ["Sauces", "Seasonings", "Broths"]
};

export default function CategoryIngredientPage() {
    const { categoryId } = useParams();  // Get category ID from URL
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState('');

    useEffect(() => {
        if (subCategoryId !== '') {
            axios.get(`http://localhost:8000/api/ingredients/${categoryId}/${subCategoryId}/`)
                .then(response => setIngredients(response.data))
                .catch(error => console.error("Error fetching ingredients:", error));
        }
    }, [categoryId, subCategoryId]);

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/ingredient-defs')}>Back to Categories</Button>
            <Typography variant="h5" sx={{ mt: 2 }}>{categoryNames[categoryId]} Ingredients</Typography>
            
            <Select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                displayEmpty
                sx={{ mt: 2, mb: 2 }}
            >
                <MenuItem value="" disabled>Select Subcategory</MenuItem>
                {subCategoryNames[categoryId].map((subCategory, index) => (
                    <MenuItem key={index} value={index}>{subCategory}</MenuItem>
                ))}
            </Select>

            {ingredients.length > 0 ? (
                <ul>
                    {ingredients.map(ingredient => (
                        <li key={ingredient.ing_name_id}>{ingredient.ing_name}</li>
                    ))}
                </ul>
            ) : (
                <Typography sx={{ mt: 2 }}>No ingredients found for this subcategory.</Typography>
            )}
        </Box>
    );
}
