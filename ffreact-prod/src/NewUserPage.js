import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'

// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const NewUserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, setUser] = useState(
        {
            username: '',
            password: '',
            email: '',
            admin_flag: 0,
        }
    );

    const sendCreateRequest = () => {
        axios({
            method: "POST",
            url: "http://4.236.185.213:8000/api/users",
            data: user
        }).then((response) => {
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

    // Handle input change for user login
    // Takes input change event information (name, value)
    // Returns none
    const createNewUser = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = { ...user };
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
    }

    // Handle login form submit
    // Takes login form event information (form submission)
    // Returns none
    const handleCreateUser = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send login to backend
        sendCreateRequest();
        // Switch to 'landing' page
        handlePageClick('loginPage');
        // TO DO;
    }

    // HTML structure of this component
    return (
        <Fragment>
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
                <label htmlFor='username'>Username: </label>
                <input type='text' maxLength='30' name='username' value={user.username} onChange={createNewUser}></input>
                <br/><label htmlFor='username'>Password: </label>
                <input type='password' maxLength='30' name='password' value={user.password} onChange={createNewUser}></input>
                <br/><label htmlFor='username'>Email: </label>
                <input type='email' maxLength='30' name='email' value={user.email} onChange={createNewUser}></input>
                <br/><br/><button type='Submit'>Submit</button>
            </form>
        </Fragment>
    );
}

export default NewUserPage;