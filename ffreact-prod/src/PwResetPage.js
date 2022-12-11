import React from 'react'
import {useState} from 'react'
import {Fragment} from 'react'
import axios from 'axios'

// PW Reset Page Component
// Takes handlePageClick callback function to enable page switching when reset request is complete
// Returns a reset request page component that allows users to enter account information 
const PwResetPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, sendEmail] = useState(
        {
            username: '',
            email: ''
        }
    );

    const sendResetRequest = () => {
        axios({
            method: "POST",
            url:"",
            data: user
          }).then((response)=>{
            const data = response.data;
            console.log(data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    // Handle input change for user password reset
    // Takes input change event information (name, value)
    // Returns none
    const handleResetChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = {...user};
        thisUser[fieldName] = fieldValue;
        sendEmail(thisUser);                                //*** Function needs to be implemented ***/
// Send email if account and email match
    }
    
    // Handle reset form submit
    // Takes reset form event information (form submission)
    // Returns none
    const handleResetSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send reset request to backend
        sendResetRequest();
        // Switch to 'Login Page' page
        handlePageClick('loginPage');
        // TO DO;
    }
    
    // HTML structure of this component
    return (
        <Fragment>
            <h3>Password Reset Page</h3>
            <form onSubmit={handleResetSubmit}>
                <label htmlFor='username'>Username: </label>
                <input type='text' maxLength='30' name='username' value={user.username} onChange={handleResetChange}></input>
                <label htmlFor='username'>Email: </label>
                <input type='email' maxLength='30' name='email' value={user.email} onChange={handleResetChange}></input>
                <button type='Submit'>Submit</button>
            </form>
        </Fragment>
    );
}

export default PwResetPage;