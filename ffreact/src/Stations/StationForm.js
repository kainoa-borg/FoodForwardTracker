import {useState} from 'react'
import React from 'react'

// Angela McNeese

// Station Form component
// Takes AddStation callback function
// Returns a form that can be used to define a new Station object in a StationList
const StationForm = (props) => {
  const clearStation = () => {
    return {
      stn_name: "",
      num_servings: undefined,
      household: [],
      hh_allergies: []
    }
  }

  // The state of this Station Form with each attribute of Station, using the clearStation helper function
    const [station, setStation] = useState(clearStation());

    // Handle form submission (prevent refresh, pass Station to addStation, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass Station object to StationList callback
        props.addStation(station)
      // Clear the form state
        setStation(clearStation());
    }

    const updateEditForm = (names, values) => {
      const newStation = {...station};
      for (let i = 0; i < names.length; i++) {
          newStation[names[i]] = values[i];
        // console.log('(' + names[i] + ', ' + values[i] + ')', newStation.aFlag);
      }
        setStation(newStation);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
      // Create new Station object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
          {/* Basic station info */}
          <label htmlFor="stn_name">Name: </label>
            <input name="stn_name" id="stn_name" type="text" maxLength='50' required={true} value={station.stn_name} onChange={handleFormChange}/>
          <br />
          <button type='Submit'>Add</button>
      </form>
    );
}

export default StationForm