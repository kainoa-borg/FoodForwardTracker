import {useState} from 'react'
import React from 'react'
import { Grid, Typography, Card, Input, InputLabel, Button} from '@mui/material';

// Kainoa Borges
// Angela McNeese

// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const IngredientDefForm = (props) => {
  // Structs
  const addEntry = props.addEntry;
  const handleClose = props.handleClose;

  // Clear Ingredient Form data between uses.
  const clearIngredient = () => {
    return {
      ingredient_name: "",
  }
  }
  // The state of this Ingredient Form with each attribute of Ingredient
   const [ingredient, setIngredient] = useState(clearIngredient());

  // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
  // Takes submit event information (form submission)
  // Returns none
  const handleSubmit = (event) => {
    // Prevent refresh
    event.preventDefault();
    // Pass ingredient object to IngredientList callback
    // props.addIngredient(ingredient)
    addEntry(ingredient);
    handleClose();
    // Clear the form state
    setIngredient(clearIngredient());
  }

  // Updates field values before the new data is sent to be saved in the database
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
    const fieldName = event.target.name;
    const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    // Create new ingredient object before setting state
    updateEditForm([fieldName], [fieldValue]);
    // updateEditForm('aFlag', true);
  }

  // HTML structure of this component
  // Returns the popup view of the Add Ingredient Form
  return (
    <form onSubmit={handleSubmit}>
        {/* Basic ingredient info */}
        <Card sx={{marginTop: '1em', padding: '1em'}}>
          <Typography variant='h5'>Add Ingredient</Typography>
          <Typography component='h6' variant='h6'>Required * </Typography>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              <InputLabel htmlFor="ingredient_name">Ingredient Name*: </InputLabel>
              {/* <Input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleFormChange}/> */}
              <Input name="ing_name" value={ingredient.ing_name} required onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
            </Grid>
          </Grid>
        </Card>
    </form>
  );
}

export default IngredientDefForm