import {useState} from 'react'
import AllergiesList from './AllergiesList.js'
import React from 'react'
import { Button, Grid, Input, Typography } from '@mui/material'
import { InputLabel } from '@mui/material'
import { Card } from '@mui/material'
// Kainoa Borges

// Household Form component
// Takes AddHousehold callback function
// Returns a form that can be used to define a new household object in a HouseholdList
const HouseholdForm = (props) => {

  const addEntry = props.addEntry;
  const handleClose = props.handleClose;

  const clearHousehold = () => {
    return {
      hh_name: "",
      num_adult: undefined,
      num_child_lt_6: undefined,
      num_child_gt_6: undefined,
      sms_flag: 0,
      veg_flag: 0,
      allergy_flag: 0,
      gf_flag: 0,
      ls_flag: 0,
      paused_flag: 0,
      phone: "",
      street: "",
      city: "",
      pcode: undefined,
      state: "",
      delivery_notes: "",
      hh_allergies: []
    }
  }

  // The state of this Household Form with each attribute of Household, using the clearHousehold helper function
  const [household, setHousehold] = useState(clearHousehold());

    // Handle form submission (prevent refresh, pass household to addHousehold, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass household object to HouseholdList callback
      // props.addHousehold(household)
      addEntry(household);
      // Clear the form state
      setHousehold(clearHousehold());
    }

    const updateEditForm = (names, values) => {
      const newHousehold = {...household};
      for (let i = 0; i < names.length; i++) {
        newHousehold[names[i]] = values[i];
        // console.log('(' + names[i] + ', ' + values[i] + ')', newHousehold.aFlag);
      }
      setHousehold(newHousehold);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
      // Create new household object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <Card sx={{marginTop: '1em', padding: '1em'}}>
        <Typography component='h5' variant='h5'>Add a Client: </Typography>
        <form onSubmit={handleSubmit}>
            {/* Basic household info */}
            <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor="hh_name">Name: </InputLabel>
                <Input name="hh_name" id="hh_name" type="text" maxLength='30' required={true} value={household.hh_name} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='num_adult'>Number of Adults: </InputLabel>
                <Input name='num_adult' id="num_adult" type="number" value={household.num_adult} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='num_child_lt_6'>Number of Children 0-6: </InputLabel>
                <Input name='num_child_lt_6' id="num_child_lt_6" type="number" value={household.num_child_lt_6} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='num_child_gt_6'>Number of Children 7-17: </InputLabel>
                <Input name='num_child_gt_6' id="num_child_gt_6" type="number" value={household.num_child_gt_6} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='veg_flag'>Vegan/Vegetarian: </InputLabel>          
                <Input name='veg_flag' id='veg_flag' type="checkbox" checked={household.veg_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='gf_flag'>Gluten Free: </InputLabel>          
                <Input name='gf_flag' id='gf_flag' type='checkbox' checked={household.gf_flag} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='sms_flag'>Recieving SMS: </InputLabel>
                <Input name='sms_flag' id='sms_flag' type='checkbox' checked={household.sms_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='paused_flag'>Is Paused: </InputLabel>          
                <Input name='paused_flag' id='paused_flag' type='checkbox' checked={household.paused_flag} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='phone'>Phone Number: </InputLabel>          
                <Input name='phone' id='phone' type='tel' /**pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' minLength='12'*/ maxLength='10' value={household.phone} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='street'>Street: </InputLabel>          
                <Input name='street' id='street' maxLength='50' value={household.street} onChange={handleFormChange}/>

                <InputLabel htmlFor='city'>City: </InputLabel>
                <Input name='city' id='city' maxLength='50' value={household.city} onChange={handleFormChange}/>

                <InputLabel htmlFor='pcode'>Postal Code: </InputLabel>
                <Input name='pcode' id='pcode' minLength='5' maxLength='5' value={household.pcode} onChange={handleFormChange}/>

                <InputLabel htmlFor='state'>State: </InputLabel>
                <Input name='state' id='state' minLength='2' maxLength='2' value={household.state} onChange={handleFormChange}/>

                <InputLabel htmlFor='delivery_notes'>Delivery Notes: </InputLabel>
                <Input name='delivery_notes' id='delivery_notes' maxLength='255' value={household.delivery_notes} onChange={handleFormChange}/>
              </Grid>

              <Grid item>
                <InputLabel>Allergies</InputLabel>
                <AllergiesList allergies={household.hh_allergies} isEditable={true} updateEditForm={updateEditForm}/>
              </Grid>
            </Grid>
            <Button type='Submit' color='lightBlue' variant='contained' onClick={handleClose}>Add Client</Button>
        </form>
      </Card>

    );
}

export default HouseholdForm