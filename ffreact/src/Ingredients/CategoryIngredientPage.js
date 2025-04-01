import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
    const [newIngredient, setNewIngredient] = useState('');
    const [open, setOpen] = useState(false);
    const [editIngredient, setEditIngredient] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (subCategoryId !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}ingredients/category/${categoryId}/subcategory/${subCategoryId}/`)
                .then(response => setIngredients(response.data))
                .catch(error => {
                    console.error("Error fetching ingredients:", error);
                    if (error.response && error.response.status === 404) {
                        setIngredients([]); // Clear ingredients if no data is found
                    }
                });
        }
    }, [categoryId, subCategoryId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddIngredient = () => {
        axios.get(`${process.env.REACT_APP_API_URL}ingredients/category/${categoryId}/subcategory/${subCategoryId}/`)
            .then(response => {
                setIngredients(prevIngredients => [...prevIngredients, response.data]); // Update state to include the new ingredient
                setNewIngredient('');
                handleClose();
            })
            .catch(error => console.error("Error adding ingredient:", error));
    };

    const handleEditClickOpen = (ingredient) => {
        setEditIngredient(ingredient);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditIngredient(null);
    };

    const handleEditIngredient = () => {
        axios.put(`${process.env.REACT_APP_API_URL}ingredients/${categoryId}/${subCategoryId}/${editIngredient.ing_name_id}/`, { ing_name: editIngredient.ing_name })
            .then(response => {
                setIngredients(ingredients.map(ingredient => ingredient.ing_name_id === editIngredient.ing_name_id ? response.data : ingredient));
                handleEditClose();
            })
            .catch(error => console.error("Error editing ingredient:", error));
    };

    const handleDeleteIngredient = (ingredientId) => {
        axios.delete(`${process.env.REACT_APP_API_URL}ingredients/${categoryId}/${subCategoryId}/${ingredientId}/`)
            .then(() => {
                setIngredients(ingredients.filter(ingredient => ingredient.ing_name_id !== ingredientId));
            })
            .catch(error => console.error("Error deleting ingredient:", error));
    };

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
                {subCategoryNames[categoryId] && subCategoryNames[categoryId].map((subCategory, index) => (
                    <MenuItem key={index} value={index}>{subCategory}</MenuItem>
                ))}
            </Select>

            {subCategoryId !== '' && (
                <>
                    <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mb: 2 }}>
                        Add Ingredient
                    </Button>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add New Ingredient</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Ingredient Name"
                                type="text"
                                fullWidth
                                value={newIngredient}
                                onChange={(e) => setNewIngredient(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Cancel</Button>
                            <Button onClick={handleAddIngredient} color="primary">Add</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={editOpen} onClose={handleEditClose}>
                        <DialogTitle>Edit Ingredient</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Ingredient Name"
                                type="text"
                                fullWidth
                                value={editIngredient ? editIngredient.ing_name : ''}
                                onChange={(e) => setEditIngredient({ ...editIngredient, ing_name: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose} color="primary">Cancel</Button>
                            <Button onClick={handleEditIngredient} color="primary">Save</Button>
                        </DialogActions>
                    </Dialog>

                    {ingredients.length > 0 ? (
                        <ul>
                            {ingredients.map(ingredient => (
                                <li key={ingredient.ing_name_id}>
                                    {ingredient.ing_name}
                                    <Button onClick={() => handleEditClickOpen(ingredient)}>Edit</Button>
                                    <Button onClick={() => handleDeleteIngredient(ingredient.ing_name_id)}>Delete</Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography sx={{ mt: 2 }}>No ingredients found for this subcategory.</Typography>
                    )}
                </>
            )}
        </Box>
    );
}
