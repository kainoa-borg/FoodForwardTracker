import {useState} from 'react'
import AllergiesList from './AllergiesList.js'
import React from 'react'

// Kainoa Borges

// Household Form component
// Takes AddHousehold callback function
// Returns a form that can be used to define a new household object in a HouseholdList
const HouseholdForm = (props) => {

  const clearHousehold = () => {
    return {
      hh_name: '',
      num_adult: 0,
      num_child: 0,
      veg_flag: false,
      gf_flag: false,
      a_flag: false,
      sms_flag: false,
      paused_flag: false,
      phone: '',
      street: '',
      city: '',
      pcode: '',
      delivery_notes: '',
      state: 'MI',
      hh_allergies: []
    }
  }

  // The state of this Household Form with each attribute of Household, using the clearHousehold helper function
  const [household, setHousehold] = useState(clearHousehold());

    // Handle form submission (prevent refresh, pass household to addHousehold, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass household object to HouseholdList callback
      props.addHousehold(household)
      // Clear the form state
      setHousehold(clearHousehold());
    }

    const updateEditForm = (names, values) => {
      const newHousehold = {...household};
      for (let i = 0; i < names.length; i++) {
        newHousehold[names[i]] = values[i];
        console.log('(' + names[i] + ', ' + values[i] + ')', newHousehold.aFlag);
      }
      setHousehold(newHousehold);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new household object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
          {/* Basic household info */}
          <label htmlFor="hh_name">Name: </label>
          <input name="hh_name" id="hh_name" type="text" maxLength='30' required={true} value={household.hh_name} onChange={handleFormChange}/>
          
          <label htmlFor='num_adult'>Number of Adults: </label>
          <input name='num_adult' id="num_adult" type="number" value={household.num_adult} onChange={handleFormChange}/>
          
          <label htmlFor='num_child'>Number of Children: </label>
          <input name='num_child' id="num_child" type="number" value={household.num_child} onChange={handleFormChange}/>
          

          {/* Flags should be on separate lines */}
          <br/>

          <label htmlFor='veg_flag'>Vegan/Vegetarian: </label>          
          <input name='veg_flag' id='veg_flag' type="checkbox" checked={household.veg_flag} onChange={handleFormChange}/>
          
          <br/>

          <label htmlFor='gf_flag'>Gluten Free: </label>          
          <input name='gf_flag' id='gf_flag' type='checkbox' checked={household.gf_flag} onChange={handleFormChange}/>
          
          <br/>

          <label htmlFor='a_flag'>Allergy: </label>
          <input name='a_flag' id='a_flag' type='checkbox' checked={household.a_flag} onChange={handleFormChange}/>
          
          <br/>
          
          <label htmlFor='sms_flag'>Recieving SMS: </label>
          <input name='sms_flag' id='sms_flag' type='checkbox' checked={household.sms_flag} onChange={handleFormChange}/>
          
          <br/>

          <label htmlFor='paused_flag'>Is Paused: </label>          
          <input name='paused_flag' id='paused_flag' type='checkbox' checked={household.paused_flag} onChange={handleFormChange}/>
          
          {/* Delivery info should be a separate line */}
          <br/>

          <label htmlFor='phone'>Phone Number: </label>          
          <input name='phone' id='phone' type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' minLength='12' maxLength='12' value={household.phone} onChange={handleFormChange}/>
          
          <label htmlFor='street'>Street: </label>          
          <input name='street' id='street' maxLength='50' value={household.street} onChange={handleFormChange}/>

          <label htmlFor='city'>City: </label>
          <input name='city' id='city' maxLength='50' value={household.city} onChange={handleFormChange}/>

          <label htmlFor='pcode'>Postal Code: </label>
          <input name='pcode' id='pcode' minLength='5' maxLength='5' value={household.pcode} onChange={handleFormChange}/>

          <label htmlFor='state'>State: </label>
          <input name='state' id='state' minLength='2' maxLength='2' value={household.state} onChange={handleFormChange}/>

          <label htmlFor='delivery_notes'>Delivery Notes: </label>
          <textarea name='delivery_notes' id='delivery_notes' maxLength='255' value={household.delivery_notes} onChange={handleFormChange}/>

          {/* Allergies input should be on a separate line */}
          <br/>

          <label>Allergies</label>
          <AllergiesList allergies={household.hh_allergies} isEditable={true} updateEditForm={updateEditForm}/>

          <button type='Submit'>Add</button>
      </form>
    );
}

export default HouseholdForm