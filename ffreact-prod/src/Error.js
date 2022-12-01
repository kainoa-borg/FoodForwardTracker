import React from 'react'

// Error message component
// Takes error text
// Returns an <h3> error message component
const Error = (props) => {
    const errorText = props.text;
    return (
        <h3 style={{color: 'red'}}>{errorText}</h3>
    )
}

export default Error;