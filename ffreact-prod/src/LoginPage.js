import React from 'react'
import {useState} from 'react'
import {Fragment} from 'react'
import axios from 'axios'
import NewUserPage from "./NewUserPage.js"
import PwResetPage from './PwResetPage.js'


// Login Page Component
// Takes handlePageClick callback function to enable page switching when login is completed
// Returns a login page component that allows users to enter account information 
const LoginPage = (props) => {
    const handlePageClick = props.handlePageClick;
    const [user, setUser] = useState(
        {
            username: '',
            password: ''
        }
    );

    const sendLoginRequest = () => {
        axios({
            method: "POST",
            url:"http://localhost:8000/api/users",
            data: user
          }).then((response)=>{
            const data = response.data;
              console.log(data);
              //handlePageClick('landingPage');
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
    const handleLoginChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = {...user};
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
    }
    
    // Handle login form submit
    // Takes login form event information (form submission)
    // Returns none
    const handleLoginSubmit = (event) => {
        // Prevent refresh
        event.preventDefault();
        // send login to backend
        sendLoginRequest();
        // Switch to 'landing' page
        handlePageClick('landingPage');
        // TO DO;
    }

    const handleCreateClick = (event) => {
        handlePageClick('newUserPage');
        //else if (pageName === 'pwResetPage') setCurrPage(<PwResetPage handlePageClick={handlePageClick} />);
    }

    const handleResetClick = (event) => {
        handlePageClick('pwResetPage');
    }

    // HTML structure of this component
    return (
        <Fragment>
            <h3>Login Page</h3>
            <form onSubmit={handleLoginSubmit}>
                <label htmlFor='username'>Username: </label>
                <input type='text' maxLength='30' name='username' value={user.username} onChange={handleLoginChange}></input>
                <br/><label htmlFor='username'>Password: </label>
                <input type='password' maxLength='30' name='password' value={user.password} onChange={handleLoginChange}></input>
                <br /><br /><button type='Submit'>Submit</button>
                <br /><text>  Don't have an account?  </text><button onClick={() => handleCreateClick('newUserPage')}>
                    Create New User
                </button>
                <br /><text>  Forgot Password?  </text><button onClick={() => handleResetClick('pwResetPage')}>
                    Reset Password
                </button>
            </form>
        </Fragment>
    );
}

export default LoginPage;