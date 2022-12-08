import React, {Fragment, useState} from 'react'
import axios from 'axios'
import PackagingForm from './PackagingForm.js'
import EditablePackagingRow from './EditablePackagingRow.js'
import PackagingRow from './PackagingRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import ReusableTable from '../ReusableTable.js'

import './PackagingList.css'


// Packaging List Component
export default function PackagingList() {
    const data = [
        { p_id: 1, packaging_type: 'Mason Jar', unit_qty: 1, unit_cost: null, qty_holds: 8, unit: 'oz', returnable: 1, in_date: '11-20-24', in_qty: 10, exp_date: '11-20-24', qty_on_hand: 10, flat_fee: 0.00, psupplier_name: 'Second Harvest Food Bank', pref_psupplier_name: 'N/A', usages: []},
        { p_id: 2, packaging_type: 'Mason Jar', unit_qty: 1, unit_cost: null, qty_holds: 24, unit: 'oz', returnable: 1, in_date: '12-7-22', in_qty: 2, exp_date: '11-20-24', qty_on_hand: 10, flat_fee: 0.00, psupplier_name: 'Second Harvest Food Bank', pref_psupplier_name: 'N/A', usages: []},
        { p_id: 3, packaging_type: 'Snack Bag', unit_qty: 50, unit_cost: null, qty_holds: 1, unit: 'gal', returnable: 0, in_date: '12-7-22', in_qty: 5, exp_date: '11-20-24', qty_on_hand: 10, flat_fee: 0.00, psupplier_name: 'Second Harvest Food Bank', pref_psupplier_name: 'N/A', usages: []}
    ]

    const [packaging, setPackaging] = useState(data);
    const [editPackagingID, setEditPackagingID] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"/packaging/"
          }).then((response)=>{
            const pacData = response.data
              setPackaging(pacData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const postDBPackaging = () => {
        axios({
            method: "POST",
            url:"/packaging/",
            data: packaging
          }).then((response)=>{
              getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Packaging ID already found!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    const addPackaging = (package_item) => {
        const lastID = packaging[packaging.length - 1]['p_id'];
        package_item['p_id'] = lastID + 1;
        let newPackaging = [...packaging, package_item];
        setPackaging(newPackaging);
        clearError();
        // Check to see if we already have a duplicate Ingredient Name
        // if (!ingredients.find((ing) => ing.i_id === ing.i_id))
        // {
        //     let newIngredients = [...ingredients, ingredient];
        //     setIngredients(newIngredients);
        //     clearError();
        // }
        // else {
        //     // If this ingredient is already in ingredients list, display error message
        //     handleError('DuplicateKey');
        // }
    }

    const deletePackaging = (key) => {
        const pacID = key; 
        let newPackaging = [...packaging];
        newPackaging.splice(pacID, 1);
        setPackaging(newPackaging);
    }

    const updatePackaging = (key) => {
        let thisID = packaging[key]['i_id'];
        if (packaging.find((pac) => pac.p_id === thisID))
        {
            let newPackaging = [...packaging];
            newPackaging[key] = editFormData;
            setEditPackagingID(null);
            setPackaging(newPackaging)
            clearError();
        }
        else {
            // If this Packaging is already in Packaging list, display error message
            handleError('DuplicateKey');
        }
        
    }

    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        // Create new Packaging object before setting state
        const newEditFormData = {...editFormData};
        newEditFormData[fieldName] = fieldValue;
        // Set state with new Packaging object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.aFlag);
        }
        setEditFormData(newEditFormData);
      }

    const handleEditClick = (key) => {
        setEditPackagingID(key);
        setEditFormData(packaging[key]);
    }
    const handleCancelClick = () => {
        setEditPackagingID(null);
        setEditFormData(null);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Packaging Name</th>
                        <th>Unit Qty</th>
                        <th>Unit Cost</th>
                        <th>Qty Holds</th>
                        <th>Unit</th>
                        <th>Returnable</th>
                        <th>In Date</th>
                        <th>In Qty</th>
                        <th>Expiration Date</th>
                        <th>Qty On Hand</th>
                        <th>Flat Fee</th>
                        <th>Supplier</th>
                        <th>Preferred Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each package type in packaging.*/}
                    {packaging.map((package_item, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this Packaging is the one to be edited, show an editable row instead
                                editPackagingID === thisKey 
                                        ? <EditablePackagingRow thisKey={thisKey} editFormData={editFormData} updatePackaging={updatePackaging} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                        : <PackagingRow thisKey={thisKey} package_item={package_item} deletePackaging={deletePackaging} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
            <h3>Add Packaging</h3>
            <PackagingForm addPackaging={addPackaging}></PackagingForm>
            <button onClick={postDBPackaging}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}