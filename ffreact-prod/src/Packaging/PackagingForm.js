import {useState} from 'react'
import React from 'react'
import ReusableForm from '../ReusableForm.js'

// Kainoa Borges

// Packaging Form component
// Takes AddPackaging callback function
// Returns a form that can be used to define a new Packaging object in a PackagingList
const PackagingForm = (props) => {
  
    const clearPackaging = () => {
    return {
      p_id: null,
      packaging_type: '',
      unit_qty: null,
      unit_cost: null,
      qty_holds: null,
      unit: '',
      returnable: null,
      in_date: null,
      in_qty: null,
      exp_date: null,
      qty_on_hand: null,
      flat_fee: null,
      psupplier_name: null,
      pref_psupplier_name: null
    }
  }

  // The state of this Packaging Form with each attribute of Packaging
    const [packaging, setPackaging] = useState(clearPackaging());
  const [supplierList, setSupplierList] = useState([{s_id: 1, supplier_name: 'Second Harvest Food Bank'}, {s_id: 2, supplier_name: 'Third Harvest Food Bank'}]);

    // Handle form submission (prevent refresh, pass Packaging to addPackaging, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = (event) => {
      // Prevent refresh
      event.preventDefault();
      // Pass Packaging object to PackagingList callback
        props.addPackaging(packaging)
      // Clear the form state
        setPackaging(clearPackaging());
    }

    const updateEditForm = (names, values) => {
        const newPackaging = { ...packaging };
      for (let i = 0; i < names.length; i++) {
          newPackaging[names[i]] = values[i];
        console.log('(' + names[i] + ', ' + values[i] + ')');
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
          {/* Basic Packaging info */}
            <label htmlFor="package_type">Packaging Name: </label>
            <input name="package_type" type="text" maxLength='30' value={packaging.package_type} onChange={handleFormChange}/>
          
          <label htmlFor='unit_qty'>Unit Quantity: </label>
            <input name='unit_qty' type="number" value={packaging.unit_qty} onChange={handleFormChange}/>
          
          <label htmlFor='unit_cost'>Unit Cost: </label>
            <input name='unit_cost' type="number" step="0.01" value={packaging.unit_cost} onChange={handleFormChange}/>
          
          <label htmlFor="qty_holds">Quantity Holds: </label>
            <input name="qty_holds" type="number" value={packaging.qty_holds} onChange={handleFormChange}/>

          <label htmlFor="unit">Unit: </label>
            <input name="unit" type="text" value={packaging.unit} onChange={handleFormChange}/>

          <label htmlFor="returnable">Returnable: </label>
            <input name="returnable" type="number" value={packaging.returnable} onChange={handleFormChange}/>

          <label htmlFor="in_date">In Date: </label>
            <input name="in_date" type="date" value={packaging.in_date} onChange={handleFormChange}/>

          <label htmlFor="in_qty">In Qantity: </label>
            <input name="in_qty" type="number" value={packaging.in_qty} onChange={handleFormChange}/>

          <label htmlFor="exp_date">Expiration Date: </label>
            <input name="exp_date" type="date" value={packaging.exp_date} onChange={handleFormChange}/>

          <label htmlFor="qty_on_hand">Qantity on Hand: </label>
            <input name="qty_on_hand" type="number" value={packaging.qty_on_hand} onChange={handleFormChange} />

          <label htmlFor="flat_fee">Flat Fee: </label>
            <input name="flat_fee" type="number" step="0.01" value={packaging.flat_fee} onChange={handleFormChange} />

          <label htmlFor="psupplier">Supplier: </label>
          <select name="psupplier_id" onChange={handleFormChange}>
            <option selected="true">N/A</option>
            {supplierList.map((supplier, key) => {
              return (
                <option name='psupplier_id' value={supplier.s_id}>{supplier.supplier_name}</option>
              )
            })}
          </select>

          <label htmlFor="pref_psupplier">Supplier: </label>
          <select name="pref_psupplier_id">
            <option selected="true">N/A</option>
            {supplierList.map((supplier, key) => {
              return (
                <option value={supplier.s_id}>{supplier.supplier_name}</option>
              );
            })}
          </select>

          <button type='Submit'>Add</button>
      </form>
    );
}

export default PackagingForm