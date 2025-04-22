import {useEffect, useState} from 'react'
import React from 'react'
import { Grid, Typography, Card, Input, InputLabel, Button } from '@mui/material';
import ModularSelect from '../components/ModularSelect.js';
import axios from 'axios';

// Kainoa Borges
// Angela McNeese

// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const RecipeIngForm = (props) => {
    const { addEntry, handleClose } = props;

    // The state of this Ingredient Form with each attribute of Ingredient
    const [ingredient, setIngredient] = useState({
        ingredient_name: '',
        amt: '',
        unit: '',
        prep: '',
    });

    const [dbIngredients, setDbIngredients] = useState([]);

    // Add function to fetch ingredients from database
    const getDBIngredients = () => {
        axios({
            method: "GET",
            url: process.env.REACT_APP_API_URL + "ingredient-inventory"
        }).then((response) => {
            setDbIngredients(response.data);
        }).catch((error) => {
            console.error("Error fetching ingredients:", error);
        });
    }

    useEffect(() => {
        getDBIngredients();
    }, []);

    const updateEditForm = (names, values) => {
        const newIngredient = {...ingredient};
        for (let i = 0; i < names.length; i++) {
            newIngredient[names[i]] = values[i];
        }
        setIngredient(newIngredient);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        
        console.log('Field changing:', { fieldName, fieldValue }); // Debug log
        
        if (fieldName === 'ingredient_name') {
            // Find the ingredient directly from the dropdown options
            const selectedIngredient = dbIngredients.find(ing => ing.ingredient_name === fieldValue);
            console.log('Selected ingredient:', selectedIngredient); // Debug log
            
            if (selectedIngredient) {
                // Update both name and unit in one call
                updateEditForm(
                    ['ingredient_name', 'unit'], 
                    [selectedIngredient.ingredient_name, selectedIngredient.unit]
                );
            }
        } else {
            updateEditForm([fieldName], [fieldValue]);
        }
    }

    // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
        event.preventDefault();
        
        console.log('Current ingredient state:', ingredient); // Debug log
        console.log('Available ingredients:', dbIngredients); // Debug log
        
        const selectedIngredient = dbIngredients.find(ing => 
            ing.ingredient_name.toLowerCase() === ingredient.ingredient_name.toLowerCase()
        );
        
        console.log('Found ingredient:', selectedIngredient); // Debug log

        if (!selectedIngredient) {
            alert('Please select a valid ingredient from the list');
            return;
        }

        if (!ingredient.amt) {
            alert('Please enter an amount');
            return;
        }

        const formattedIngredient = {
            ingredient_name: selectedIngredient.ingredient_name,
            amt: parseFloat(ingredient.amt),
            unit: selectedIngredient.unit,
            prep: ingredient.prep || ''
        };
        
        console.log('Submitting ingredient:', formattedIngredient); // Debug log
        
        addEntry(formattedIngredient);
        handleClose();
    };

    // HTML structure of this component
    return (
        <form onSubmit={handleSubmit}>
            <Card sx={{marginTop: '1em', padding: '1em'}}>
                <Typography variant='h5'>Add Recipe Ingredient</Typography>
                <Typography component='h6' variant='h6'>Required * </Typography>

                <Grid container direction='row' spacing={4}>
                    <Grid item>
                        <InputLabel>Ingredient Name*: </InputLabel>
                        <ModularSelect 
                            name="ingredient_name"
                            value={ingredient.ingredient_name}
                            options={dbIngredients}
                            required
                            searchField={'ingredient_name'}
                            onChange={handleFormChange}
                            noDuplicates
                            noAdd={true}
                            displayField="ingredient_name" // Add this prop
                            valueField="ingredient_name"   // Add this prop
                        />

                        <InputLabel>Amount*: </InputLabel>
                        <Input 
                            name='amt' 
                            type="number" 
                            value={ingredient.amt} 
                            inputProps={{
                                required: true,
                                min: 0,
                                step: "0.01"
                            }} 
                            onChange={handleFormChange}
                        />

                        <InputLabel>Unit*: </InputLabel>
                        <Input 
                            name='unit'
                            required
                        />
                    </Grid>
                    <Grid item>
                        <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
                    </Grid>
                </Grid>
            </Card>
        </form>
    );
}

export default RecipeIngForm;