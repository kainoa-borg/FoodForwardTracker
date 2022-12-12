import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'

const UserPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    const [user, setUser] = useState(
        {
            username: '',
            email: ''
        }
    );

    const handleLoginChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const thisUser = { ...user };
        thisUser[fieldName] = fieldValue;
        setUser(thisUser);
    }
   
    // HTML structure of this component
    return (
        <Fragment>
            <h3>User Account</h3>
            <button onClick={() => handlePageClick('UserPage')}>
                Change Username
            </button>
            <button onClick={() => handlePageClick('UserPage')}>
                Change Password
            </button>
            <button onClick={() => handlePageClick('UserPage')}>
                Account Permissions
            </button>
            <button onClick={() => handlePageClick('UserPage')}>
                Update Email
            </button>
        </Fragment>
    );
}

export default UserPage;

