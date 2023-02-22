import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm.js'
import { Button, Grid, Input, Typography } from '@mui/material'
import { InputLabel } from '@mui/material'
import { Stack } from '@mui/system'
import { Card } from '@mui/material'
// Kainoa Borges
// Angela McNeese

// Packaging Form component
// Takes AddPackaging callback function
// Returns a form that can be used to define a new packaging object in a PackagingList
const PackagingForm = (props) => {
  const supplierList = props.suppliers;
  const clearPackaging = () => {
    return {
      p_id: null,
      package_type: "",
      unit_qty: null,
      qty_holds: null,
      unit: "",
      returnable: null,
      in_date: null,
      in_qty: null,
      packaging_usage: [],
      qty_on_hand: null,
      unit_cost: null,
      flat_fee: null,
      psupplier_id: null,
      pref_psupplier_id: null
  }
  }

  // The state of this Packaging Form with each attribute of Packaging
  const [packaging, setPackaging] = useState(clearPackaging());

    // Handle form submission (prevent refresh, pass packaging to addPackaging, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass packaging object to PackagingList callback
      props.addPackaging(packaging)
      // Clear the form state
      setPackaging(clearPackaging());
    }

    const updateEditForm = (names, values) => {
      const newPackaging = {...packaging};
      for (let i = 0; i < names.length; i++) {
        newPackaging[names[i]] = values[i];
      }
      setPackaging(newPackaging);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new packaging object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <Card sx={{marginTop: '1em', padding: '1em'}}>
        <Typography component='h5' variant='h5'>Add Packaging: </Typography>
        <form onSubmit={handleSubmit}>
          {/* Packaging info fields */}
          <Grid container spacing={4}>
            <Grid item>
            <InputLabel htmlFor="package_type">Package Type: </InputLabel>
                <Input name="package_type" id="package_type" type="text" maxLength='30' required={true} value={packaging.package_type} onChange={handleFormChange}/>
                
                <InputLabel htmlFor='unit_qty'>Purchased Amount: </InputLabel>
                <Input name='unit_qty' id="unit_qty" type="number" value={packaging.unit_qty} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <InputLabel htmlFor='qty_holds'>Size: </InputLabel>
              <Input name='qty_holds' id="qty_holds" type="number" value={packaging.qty_holds} onChange={handleFormChange}/>
                
              <InputLabel htmlFor='unit_cost'>Unit Cost: </InputLabel>
              <Input name='unit_cost' id="unit_cost" type="number" value={packaging.unit_cost} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <InputLabel htmlFor='unit'>Unit: </InputLabel>
              <Input name='unit' id="unit" type="text" value={packaging.unit} onChange={handleFormChange}/>

              <InputLabel htmlFor='psupplier'>Supplier: </InputLabel>
              <Input name='psupplier' id="psupplier" type="number" value={packaging.psupplier} onChange={handleFormChange}/>
            </Grid>
            <Grid item>
              <InputLabel htmlFor='returnable'>Returnable: </InputLabel>          
              <Input name='returnable' id='returnable' type="checkbox" checked={packaging.returnable} onChange={handleFormChange}/>

              <InputLabel htmlFor='in_date'>Purchased Date: </InputLabel>
              <Input name='in_date' id="in_date" type="date" value={packaging.in_date} onChange={handleFormChange}/>
            </Grid>
          </Grid>
          <Button type='Submit' color='lightBlue' variant='contained'>Add Packaging</Button>
        </form>
      </Card>

      //<form onSubmit={handleSubmit}>       
/*          <label htmlFor="flat_fee">Flat Fee: </label>
          <input name="flat_fee" type="number" step="0.01" value={packaging.flat_fee} onChange={handleFormChange}/>

          <label htmlFor="psupplier">Supplier: </label>
          <select name="psupplier_id" onChange={handleFormChange}>
            <option defaultValue={true} value={null}>N/A</option>
            {/* Get supplier_name from  *///}
 /*           {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              )
            })}
          </select>

          <label htmlFor="pref_psupplier">Supplier: </label>
          <select name="pref_psupplier_id">
            <option defaultValue={true} value={null}>N/A</option>
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              );
            })}
          </select>

          <button type='Submit'>Add</button>
      </form>*/
    );
}

export default PackagingForm