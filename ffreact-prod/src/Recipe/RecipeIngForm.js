import {useState} from 'react'
import React from 'react'
import { Grid, Typography, Card, Input, InputLabel, Select, MenuItem, Button} from '@mui/material';

// Kainoa Borges
// Angela McNeese


// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const RecipeIngForm = (props) => {
    const addEntry = props.addEntry;
    const latestKey = props.latestKey;
    
    // The state of this Ingredient Form with each attribute of Ingredient
    const [ingredient, setIngredient] = useState({
        ingredient_name: '',
        amt: '',
        unit: '',
        prep: '',
        ri_ing: latestKey + 1
    });

    // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // Pass ingredient object to IngredientList callback
        addEntry(ingredient)
    }

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
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new ingredient object before setting state
        updateEditForm([fieldName], [fieldValue]);
        // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
    <form onSubmit={handleSubmit}>
        {/* Basic ingredient info */}
        <Card sx={{marginTop: '1em', padding: '1em'}}>
            <Typography variant='h5'>Add Ingredient</Typography>
            <Grid container direction='row' spacing={4}>
            <Grid item>
                <InputLabel>Ingredient Name: </InputLabel>
                <Input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleFormChange}/>
                
                <InputLabel>Amount: </InputLabel>
                <Input name='amt' type="text" value={ingredient.storage_type} onChange={handleFormChange}/>

                <InputLabel>Unit: </InputLabel>
                <Input name='unit' type="text" value={ingredient.unit} onChange={handleFormChange}/>
                
                <InputLabel>Prep: </InputLabel>
                <Input name="prep" type="text" value={ingredient.prep} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
                <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
            </Grid>
            </Grid>
        </Card>
    </form>
    );
}

export default RecipeIngForm