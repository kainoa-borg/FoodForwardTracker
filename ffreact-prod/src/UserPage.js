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
}

export default UserPage;

