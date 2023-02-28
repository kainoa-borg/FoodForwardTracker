import {useState} from 'react'
import React from 'react'
import { Grid, Typography, Card, Input, InputLabel, Button} from '@mui/material';

// Kainoa Borges
// Angela McNeese


// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const RecipeInstForm = (props) => {
    const addEntry = props.addEntry;
    const handleClose = props.handleClose;
    
    // The state of this Ingredient Form with each attribute of Ingredient
    const [instruction, setInstruction] = useState({
        step_inst: '',
        stn_name: '',
    });

    // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // Pass ingredient object to IngredientList callback
        addEntry(instruction);
        handleClose();
    }

    const updateEditForm = (names, values) => {
        const newInstruction = {...instruction};
        for (let i = 0; i < names.length; i++) {
            newInstruction[names[i]] = values[i];
        }
        setInstruction(newInstruction);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new instruction object before setting state
        updateEditForm([fieldName], [fieldValue]);
        // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
    <form onSubmit={handleSubmit}>
        {/* Basic instruction info */}
        <Card sx={{marginTop: '1em', padding: '1em'}}>
            <Typography variant='h5'>Add Instruction</Typography>
            <Grid container direction='row' spacing={4}>
            <Grid item>
                <InputLabel>Step Instruction: </InputLabel>
                <Input name='step_inst' type="text" value={instruction.step_inst} onChange={handleFormChange}/>

                <InputLabel>Station: </InputLabel>
                <Input name='stn_name' type="text" value={instruction.stn_name} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
                <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
            </Grid>
            </Grid>
        </Card>
    </form>
    );
}

export default RecipeInstForm