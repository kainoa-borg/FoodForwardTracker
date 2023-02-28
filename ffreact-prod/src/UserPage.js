import React from 'react'
//import { useState } from 'react'

const UserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    /*const [user, setUser] = useState(
        {
            username: '',
            email: ''
        }
    );*/

   /* const handleUser = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = { ...user };
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
    }*/
   
    // HTML structure of this component
    return (
        <div className="App">
            <header className="App-header">
                <h3>User Account</h3>
                <label htmlFor='username'>Username: </label>
                <br /><label htmlFor='username'>Change Password: </label>
                <br /><button onClick={() => handlePageClick('pwResetPage')}>
                    Change Password
                </button>
                <br /><text>Account Type: </text>

                <br /><text>Email: </text>
                <br /><button onClick={() => handlePageClick('UserPage')}>
                    Update Email
                </button>
            </header>
        </div >
    );
}

export default UserPage;

