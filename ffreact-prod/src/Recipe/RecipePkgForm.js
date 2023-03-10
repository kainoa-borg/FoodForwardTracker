import {useState} from 'react'
import React from 'react'
import { Grid, Typography, Card, Input, InputLabel, Button} from '@mui/material';
import ModularSelect from '../components/ModularSelect.js'

// Kainoa Borges
// Angela McNeese


// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const RecipePkgForm = (props) => {
    const addEntry = props.addEntry;
    const handleClose = props.handleClose;
    const packaging = props.packaging;
    const ingRows = props.ingRows;
    
    // The state of this Ingredient Form with each attribute of Ingredient
    const [pkg, setPkg] = useState({
        pkg_type: '',
        ing_name: '',
    });

    // Handle form submission (prevent refresh, pass ingredient to addIngredient, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // Pass ingredient object to IngredientList callback
        console.log(pkg);
        addEntry(pkg);
        handleClose();
    }

    const updateEditForm = (names, values) => {
        const newPackaging = {...pkg};
        for (let i = 0; i < names.length; i++) {
            newPackaging[names[i]] = values[i];
        }
        setPkg(newPackaging);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target['name'];
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new packaging object before setting state
        updateEditForm([fieldName], [fieldValue]);
        // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
        <form onSubmit={handleSubmit}>
            {/* Basic packaging info */}
            <Card sx={{marginTop: '1em', padding: '1em'}}>
                <Typography variant='h5'>Add Package</Typography>
                <Grid container direction='row' spacing={4}>
                <Grid item>
                    <InputLabel>Package Type: </InputLabel>
                    {/* <Input name="pkg_type" type="text" maxLength='30' value={packaging.pkg_type} onChange={handleFormChange}/> */}
                    <ModularSelect fieldName={'pkg_type'} value={pkg.pkg_type} options={packaging} searchField={'package_type'} onChange={handleFormChange}/>
                    <InputLabel>Ingredient Contents:</InputLabel>
                    <ModularSelect fieldName={'ing_name'} value={pkg.ing_name} options={ingRows} searchField={'ingredient_name'} onChange={handleFormChange}/>
                </Grid>
                <Grid item>
                    <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
                </Grid>
                </Grid>
            </Card>
        </form>
    );
}

export default RecipePkgForm