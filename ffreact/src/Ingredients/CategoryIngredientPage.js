import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DialogContentText } from '@mui/material';
import axios from 'axios';

const categoryNames = {
    0: "No Category",
    1: "Fruits",
    2: "Vegetables",
    3: "Dairy",
    4: "Protein",
    5: "Grains",
    6: "Specialty",
    7: "Condiments"
};

const subCategoryNames = {
    0: [{ value: 0, label: 'No Category' }],
    1: [ // Fruits
        { value: 1, label: 'Melons' },
        { value: 2, label: 'Berries' },
        { value: 3, label: 'Other Fruits' }
    ],
    2: [ // Vegetables
        { value: 4, label: 'Darkgreen Vegetables' },
        { value: 5, label: 'Red Orange Vegetables' },
        { value: 6, label: 'Starchy Vegetables' },
        { value: 7, label: 'Beans Peas Lentils' },
        { value: 8, label: 'Other Vegetables' }
    ],
    3: [ // Dairy
        { value: 9, label: 'Milk' },
        { value: 10, label: 'Cheese' },
        { value: 11, label: 'Yogurt' },
        { value: 12, label: 'Non-Dairy Calcium Alternatives' }
    ],
    4: [ // Protein
        { value: 13, label: 'Meats' },
        { value: 14, label: 'Poultry' },
        { value: 15, label: 'Seafood' },
        { value: 16, label: 'Eggs' },
        { value: 17, label: 'Nuts Seeds' },
        { value: 18, label: 'Beans Peas Lentils (Protein)' }
    ],
    5: [ // Grains
        { value: 19, label: 'Whole Grains' },
        { value: 20, label: 'Refined Grains' },
        { value: 21, label: 'Gluten Free' }
    ],
    6: [ // Specialty
        { value: 22, label: 'Vegan' },
        { value: 23, label: 'Allergies' }
    ],
    7: [ // Condiments
        { value: 24, label: 'Sauces' },
        { value: 25, label: 'Seasonings' },
        { value: 26, label: 'Broths' }
    ]
};

const UnitConversionCalculator = ({ ingredient, onClose }) => {
    const [amountA, setAmountA] = useState('');
    const [unitA, setUnitA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [unitB, setUnitB] = useState('');

    const unitMapping = {
        1: 'oz',
        2: 'cups',
        3: 'grams',
        4: 'kilograms',
        5: 'milliliters',
        6: 'liters',
        7: 'tablespoons',
        8: 'teaspoons',
        9: 'ounces',
        10: 'pounds',
    };

    const handleSave = () => {
        if (amountA && unitA && unitB && amountB) {
            const conversionData = {
                ingredientId: ingredient.i_id,
                unit_a: parseInt(unitA, 10), // Send as integer
                unit_b: parseInt(unitB, 10), // Send as integer
                amt_a: parseFloat(amountA),
                amt_b: parseFloat(amountB),
            };

            console.log("Sending conversion data:", conversionData);

            axios.post(`${process.env.REACT_APP_API_URL}ingredient-conversions/`, conversionData)
                .then(() => {
                    alert('Conversion saved successfully!');
                    onClose();
                })
                .catch(function (error) {
                    console.error("Error saving conversion:", error.response && error.response.data ? error.response.data : error.message);
                    alert('Failed to save conversion.');
                });
        } else {
            alert('Please fill in all fields before saving.');
        }
    };

    return (
        <Box>
            <DialogContentText>
                Conversion for: {ingredient.ingredient_name}
            </DialogContentText>
            <TextField
                label="Amount A"
                type="number"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            />
            <Select
                label="Unit A"
                value={unitA}
                onChange={(e) => setUnitA(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            >
                {Object.entries(unitMapping).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                label="Amount B"
                type="number"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            />
            <Select
                label="Unit B"
                value={unitB}
                onChange={(e) => setUnitB(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            >
                {Object.entries(unitMapping).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
                Save Conversion
            </Button>
        </Box>
    );
};

const ViewConversionsDialog = ({ conversions, onClose }) => {
    return (
        <Dialog open={conversions.length > 0} onClose={onClose}>
            <DialogTitle>Saved Conversions</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Unit A</TableCell>
                                <TableCell>Amount A</TableCell>
                                <TableCell>Unit B</TableCell>
                                <TableCell>Amount B</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conversions.map((conversion, index) => (
                                <TableRow key={index}>
                                    <TableCell>{conversion.unit_a}</TableCell>
                                    <TableCell>{conversion.amt_a}</TableCell>
                                    <TableCell>{conversion.unit_b}</TableCell>
                                    <TableCell>{conversion.amt_b}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
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
    const [viewConversionsOpen, setViewConversionsOpen] = useState(false);
    const [conversions, setConversions] = useState([]);

    useEffect(() => {
        if (subCategoryId !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}ingredients/foodgroup/${categoryId}/specific/${subCategoryId}/`)
                .then(response => setIngredients(response.data))
                .catch(error => {
                    console.error("Error fetching ingredients:", error);
                    if (error.response && error.response.status === 404) {
                        setIngredients([]); // Clear ingredients if no data is found
                    } else {
                        alert("An error occurred while fetching ingredients.");
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

    const handleViewConversions = (ingredientId) => {
        axios.get(`${process.env.REACT_APP_API_URL}ingredient-conversions/?ingredientId=${ingredientId}`)
            .then(response => {
                setConversions(response.data || []); // Ensure conversions is always an array
                setViewConversionsOpen(true); // Open the dialog box
            })
            .catch(error => {
                console.error("Error fetching conversions:", error);
                setConversions([]); // Reset conversions if there's an error
                setViewConversionsOpen(true); // Open dialog even if no conversions are found
            });
    };

    const handleCloseConversions = () => {
        setViewConversionsOpen(false);
        setConversions([]); // Reset conversions to ensure dialog closes properly
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
                    <MenuItem key={index} value={subCategory.value}>{subCategory.label}</MenuItem>
                ))}
            </Select>

            {subCategoryId !== '' && (
                <>
                    {ingredients.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ingredient Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>Conversions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ingredients.map(ingredient => (
                                        <TableRow key={ingredient.i_id}>
                                            <TableCell>{ingredient.ingredient_name}</TableCell>
                                            <TableCell>{ingredient.in_qty}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEditClickOpen(ingredient)}>Edit</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleViewConversions(ingredient.i_id)}>View Conversions</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ mt: 2 }}>No ingredients found for this subcategory.</Typography>
                    )}
                </>
            )}

            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Unit Conversion Calculator</DialogTitle>
                <DialogContent>
                    {editIngredient && <UnitConversionCalculator ingredient={editIngredient} onClose={handleEditClose} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <ViewConversionsDialog conversions={conversions} onClose={handleCloseConversions} />
        </Box>
    );
}
