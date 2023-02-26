import {useEffect, useState} from 'react'
import React from 'react'
import axios from 'axios'
import { Grid, Typography, Card, Input, InputLabel, Select, MenuItem, Button} from '@mui/material';

// Kainoa Borges
// Angela McNeese


// Ingredient Form component
// Takes AddIngredient callback function
// Returns a form that can be used to define a new ingredient object in a IngredientList
const IngredientForm = (props) => {

  // Get suppliers from database
  // Return supplierData
  const getDBSuppliers = () => {
    console.log("MAKING REQUEST TO DJANGO")
    axios({
        method: "GET",
        url:"http://4.236.185.213:8000/api/suppliers"
      }).then((response)=>{
        setSupplierList(response.data)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          }
      });
  }

  const [supplierList, setSupplierList] = useState();
  const addEntry = props.addEntry;
  const handleClose = props.handleClose;
  const latestKey = props.latestKey;

  useEffect(() => {
    getDBSuppliers();
  }, []);

  const clearIngredient = () => {
    return {
      i_id: latestKey + 1,
      ingredient_name: "",
      pkg_type: "",
      storage_type: "",
      in_date: null,
      in_qty: null,
      ingredient_usage: [],
      qty_on_hand: null,
      unit: "",
      exp_date: null,
      unit_cost: null,
      flat_fee: null,
      isupplier_id: null,
      pref_isupplier_id: null
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

  if (supplierList === undefined) {
    return (<>loading...</>)
  }

  // HTML structure of this component
  return (
    <form onSubmit={handleSubmit}>
        {/* Basic ingredient info */}
        <Card sx={{marginTop: '1em', padding: '1em'}}>
          <Typography variant='h5'>Add Ingredient</Typography>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              <InputLabel htmlFor="ingredient_name">Ingredient Name: </InputLabel>
              <Input name="ingredient_name" type="text" maxLength='30' value={ingredient.ingredient_name} onChange={handleFormChange}/>
              
              <InputLabel htmlFor='storage_type'>Category: </InputLabel>
              <Input name='storage_type' type="text" value={ingredient.storage_type} onChange={handleFormChange}/>

              <InputLabel htmlFor='pkg_type'>Package Type: </InputLabel>
              <Input name='pkg_type' type="text" value={ingredient.pkg_type} onChange={handleFormChange}/>
              
              <InputLabel htmlFor="unit">Measure: </InputLabel>
              <Input name="unit" type="text" value={ingredient.unit} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <InputLabel htmlFor="unit_cost">Unit Cost: </InputLabel>
              <Input name="unit_cost" type="number" step="0.01" value={ingredient.unit_cost} onChange={handleFormChange}/>

              <InputLabel htmlFor="pref_isupplier">Supplier: </InputLabel>
              <Select type='select' name="pref_isupplier_id" value={undefined} label={'Supplier'}>
                <MenuItem value={'Select A Supplier'}></MenuItem>
                {supplierList.map((supplier, key) => {
                  return (
                    <MenuItem key={supplier.s_id} value={supplier.s_id}>{supplier.s_name}</MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item>
              <InputLabel htmlFor="in_date">Purchase Date: </InputLabel>
              <Input name="in_date" type="date" value={ingredient.in_date} onChange={handleFormChange}/>

              <InputLabel htmlFor="in_qty">Purchase Amount: </InputLabel>
              <Input name="in_qty" type="number" value={ingredient.in_qty} onChange={handleFormChange}/>

              <InputLabel htmlFor="exp_date">Exp Date: </InputLabel>
              <Input name="exp_date" type="date" value={ingredient.exp_date} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
            </Grid>
          </Grid>
        </Card>
    </form>
  );
}

export default IngredientForm