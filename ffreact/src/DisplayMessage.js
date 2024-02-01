import React from 'react'

// A display message component
// Takes message text
// Returns an <h4> display message component
const DisplayMessage = (props) => {
    const text = props.text;
    return (
        <h4>{text}</h4>
    )
}

export default DisplayMessage;