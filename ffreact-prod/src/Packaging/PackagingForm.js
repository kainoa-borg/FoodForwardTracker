import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm.js'

// Kainoa Borges

// Packaging Form component
// Takes AddPackaging callback function
// Returns a form that can be used to define a new packaging object in a PackagingList
const PackagingForm = (props) => {

  const supplierList = props.suppliers;
  
  const clearPackaging = () => {
    return {
      p_id: null,
      package_type: "",
      unit_qty: null,
      qty_holds: null,
      unit: "",
      returnable: null,
      in_date: null,
      in_qty: null,
      packaging_usage: [],
      qty_on_hand: null,
      unit_cost: null,
      flat_fee: null,
      psupplier_id: null,
      pref_psupplier_id: null
  }
  }

  // The state of this Packaging Form with each attribute of Packaging
  const [packaging, setPackaging] = useState(clearPackaging());

    // Handle form submission (prevent refresh, pass packaging to addPackaging, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass packaging object to PackagingList callback
      props.addPackaging(packaging)
      // Clear the form state
      setPackaging(clearPackaging());
    }

    const updateEditForm = (names, values) => {
      const newPackaging = {...packaging};
      for (let i = 0; i < names.length; i++) {
        newPackaging[names[i]] = values[i];
      }
      setPackaging(newPackaging);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      // Create new packaging object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    // HTML structure of this component
    return (
      <form onSubmit={handleSubmit}>
          {/* Basic packaging info */}          
          <label htmlFor='package_type'>Package Type: </label>
          <input name='package_type' type="text" value={packaging.pkg_type} onChange={handleFormChange}/>
          
          <label htmlFor='returnable'>Returnable: </label>
          <input name='returnable' type='checkbox' value={packaging.returnable} onChange={handleFormChange}/>
          
          <label htmlFor="unit_qty">Unit Qty: </label>
          <input name="unit_qty" type="number" value={packaging.unit_qty} onChange={handleFormChange}/>

          <label htmlFor="unit">Unit: </label>
          <input name="unit" type="text" value={packaging.unit} onChange={handleFormChange}/>

          <label htmlFor="qty_holds">Quantity Holds: </label>
          <input name="qty_holds" type="number" value={packaging.qty_holds} onChange={handleFormChange}/>

          <label htmlFor="in_date">In Date: </label>
          <input name="in_date" type="date" value={packaging.in_date} onChange={handleFormChange}/>

          <label htmlFor="in_qty">In Quantity: </label>
          <input name="in_qty" type="number" value={packaging.in_qty} onChange={handleFormChange}/>

          <label htmlFor="unit_cost">Unit Cost: </label>
          <input name="unit_cost" type="number" step="0.01" value={packaging.unit_cost} onChange={handleFormChange}/>

          <label htmlFor="flat_fee">Flat Fee: </label>
          <input name="flat_fee" type="number" step="0.01" value={packaging.flat_fee} onChange={handleFormChange}/>

          <label htmlFor="psupplier">Supplier: </label>
          <select name="psupplier_id" onChange={handleFormChange}>
            <option defaultValue={true} value={null}>N/A</option>
            {/* Get supplier_name from  */}
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              )
            })}
          </select>

          <label htmlFor="pref_psupplier">Supplier: </label>
          <select name="pref_psupplier_id">
            <option defaultValue={true} value={null}>N/A</option>
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.s_name}</option>
              );
            })}
          </select>

          <button type='Submit'>Add</button>
      </form>
    );
}

export default PackagingForm