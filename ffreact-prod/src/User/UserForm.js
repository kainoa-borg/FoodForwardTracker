import {useState, useEffect} from 'react'
import React from 'react'
import { Button, Grid, Input, Typography } from '@mui/material'
import { InputLabel } from '@mui/material'
import { Card } from '@mui/material'
// Angela McNeese

// User Form component
// Takes AddUser callback function
// Returns a form that can be used to define a new User object in a UserList
const UserForm = (props) => {
    const addEntry = props.addEntry;
    const handleClose = props.handleClose;
    const clearUser = () => {
    return {
      u_id: 0,
      username: "",
      password: "",
      admin_flag: 0,
      email: ""
    }
  }

  // The state of this User Form with each attribute of User, using the clearUser helper function
    const [user, setUser] = useState(clearUser());

    // Handle form submission (prevent refresh, pass User to addUser, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass User object to UserList callback
      addEntry(user);
      // Clear the form state
      setUser(clearUser());
    }

    const updateEditForm = (names, values) => {
        const newUser = { ...user };
      for (let i = 0; i < names.length; i++) {
          newUser[names[i]] = values[i];
      }
      setUser(newUser);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
      // Create new User object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <Card sx={{marginTop: '1em', padding: '1em'}}>
        <Typography component='h5' variant='h5'>Add a User: </Typography>
        <form onSubmit={handleSubmit}>
          {/* Basic User info */}
          <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor='username'>Username: </InputLabel>
                <Input name='username' id='username' type='text' required value={user.username} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='password'>Password: </InputLabel>
                <Input name='password' id='password' type='password' required value={user.password} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='email'>Email: </InputLabel>
                <Input name='email' id='email' type='email' required value={user.email} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='admin_flag'>Is Admin.: </InputLabel>
                <Input name='admin_flag' id='admin_flag' type='checkbox' value={user.admin_flag} onChange={handleFormChange}/>
              </Grid>
            </Grid>
            <Button type='Submit' color='lightBlue' variant='contained'>Add User</Button>
          </form>
      </Card>
    );
}

export default UserForm