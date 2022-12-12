import {useState} from 'react'
import React from 'react'

// Angela McNeese

// User Form component
// Takes AddUser callback function
// Returns a form that can be used to define a new User object in a UserList
const UserForm = (props) => {

    const clearUser = () => {
    return {
      u_id: undefined,
      username: "",
      password: "",
      admin_flag: undefined,
      email: "",
     
     // hh_allergies: []
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
        props.addUser(user)
      // Clear the form state
        setUser(clearUser());
    }

    const updateEditForm = (names, values) => {
        const newUser = { ...user };
      for (let i = 0; i < names.length; i++) {
          newUser[names[i]] = values[i];
        // console.log('(' + names[i] + ', ' + values[i] + ')', newUser.aFlag);
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
      <form onSubmit={handleSubmit}>
          {/* Basic User info */}
       
          <label htmlFor='username'>Username: </label>
            <input name='username' id="username" type="text" value={user.username} onChange={handleFormChange} />

          <label htmlFor='admin_flag'>User Level: </label>
            <input name='admin_flag' id="admin_flag" type="text" value={user.admin_flag} onChange={handleFormChange} />

          <label htmlFor='email'>Email: </label>
            <input name='email' id="email" type="text" value={user.email} onChange={handleFormChange} />

          <button type='Submit'>Add</button>
      </form>
    );
}

export default UserForm