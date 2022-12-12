import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import PackagingForm from './PackagingForm.js'
import EditablePackagingRow from './EditablePackagingRow.js'
import PackagingRow from './PackagingRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './PackagingList.css'


// Packaging List Component
export default function PackagingList() {
    const data = [
        {i_id: 1, ingredient_name: 'Lasagna Noodles', pkg_type: 'DRY-BAG', storage_type: 'N/A', in_date: '11/20/22', in_qty: 10, unit: 'lbs', exp_date: '11-20-24', qty_on_hand: 10, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: []},
        {i_id: 2, ingredient_name: 'Ground Beef', pkg_type: 'FROZEN', storage_type: 'N/A', in_date: '11/11/22', in_qty: 2, unit: 'lbs', exp_date: '12-7-22', qty_on_hand: 2, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: []},
        {i_id: 3, ingredient_name: 'Ground Beef', pkg_type: 'FROZEN', storage_type: 'N/A', in_date: '11/20/22', in_qty: 5, unit: 'lbs', exp_date: '12-7-22', qty_on_hand: 5, unit_cost: 0.75, flat_fee: 0.00, isupplier_name: 'Second Harvest Food Bank', pref_isupplier_name: 'N/A', usages: [{i_usage_id: 1, used_date: '11/29/22', used_qty: 2}]}
    ]

    const [packaging, setPackaging] = useState(undefined);
    const [suppliers, setSuppliers] = useState(undefined);
    const [editPackagingID, setEditPackagingID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        p_id: '',
        package_type: "",
        unit_qty: '',
        qty_holds: '',
        unit: "",
        returnable: '',
        in_date: '',
        in_qty: '',
        packaging_usage: [],
        qty_on_hand: '',
        unit_cost: '',
        flat_fee: '',
        psupplier_id: '',
        pref_psupplier_id: ''
    });
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Packaging ID already found!"/>
            )
        } 
        else if (errCode === 'empty') {
            setErrorComponent(
                <Error text="There doesn't seem to be any data!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        getDBPackaging();
        getDBSuppliers();
    }, []);

    const getDBSuppliers = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://localhost:8000/api/suppliers"
          }).then((response)=>{
            setSuppliers(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const getDBPackaging = () => {
        console.log("MAKING REQUEST TO DJANGO")
        setLoadingComponent(<Error text="LOADING DATA..."/>);
        axios({
            method: "GET",
            url:"http://localhost:8000/api/packaging-inventory"
          }).then((response)=>{
            const pkgData = response.data
            setPackaging(pkgData);
            setLoadingComponent(null);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const addPackaging = (pkg) => {
        const lastID = packaging[packaging.length - 1]['p_id'];
        pkg['p_id'] = lastID + 1;
        axios({
            method: "POST",
            url:"http://localhost:8000/api/packaging-inventory/",
            data: pkg
          }).then((response)=>{
            getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        clearError();
        // Check to see if we already have a duplicate Packaging Name
        // if (!ingredients.find((ing) => ing.i_id === ing.i_id))
        // {
        //     let newPackagings = [...ingredients, ingredient];
        //     setPackagings(newPackagings);
        //     clearError();
        // }
        // else {
        //     // If this ingredient is already in ingredients list, display error message
        //     handleError('DuplicateKey');
        // }
    }

    const deletePackaging = (key) => {
        const pkgID = packaging[key]['p_id']; 
        axios({
            method: "DELETE",
            url:"http://localhost:8000/api/packaging-inventory/"+pkgID+'/',
          }).then((response)=>{
            getDBPackaging();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const updatePackaging = (key) => {
        let thisID = packaging[key]['p_id'];
        if (packaging.find((pkg) => pkg.p_id === thisID))
        {
            setEditPackagingID(null);
            axios({
                method: "PATCH",
                url:"http://localhost:8000/api/packaging-inventory/"+thisID+'/',
                data: editFormData
              }).then((response)=>{
                getDBPackaging();
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  }
              });
        }
        else {
            // If this Packaging is already in ingredients list, display error message
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
        // Set state with new ingredient object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (name, value) => {
        const newEditFormData = {...editFormData};
        newEditFormData[name] = value;
        setEditFormData(newEditFormData);
        console.log(editFormData);
      }

    const handleEditClick = (key) => {
        setEditPackagingID(key);
        setEditFormData(packaging[key]);
    }
    const handleCancelClick = () => {
        setEditPackagingID(null);
        setEditFormData(null);
    }

    if (packaging === undefined || suppliers === undefined) {
        return (<>loading</>)
    }
    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div class='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>Package Type</th>
                        <th>Returnable</th>
                        <th>Unit Qty</th>
                        <th>Unit</th>
                        <th>Qty Holds</th>
                        <th>Date In</th>
                        <th>Qty In</th>
                        <th>Usages</th>
                        <th>Qty On Hand</th>
                        <th>Unit Cost</th>
                        <th>Flat Fee</th>
                        <th>Supplier</th>
                        <th>Preferred Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each ingredient in ingredients.*/}
                    {packaging.map((pkg, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this ingredient is the one to be edited, show an editable row instead
                                editPackagingID === thisKey 
                                ? <EditablePackagingRow thisKey={thisKey} editFormData={editFormData} suppliers={suppliers} updatePackaging={updatePackaging} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                : <PackagingRow thisKey={thisKey} packaging={pkg} deletePackaging={deletePackaging} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* {ingredients.length < 1 ? handleError('empty') : null} */}
                </tbody>
            </table>
            {loadingComponent}
            <h3>Add Packaging</h3>
            <PackagingForm addPackaging={addPackaging} suppliers={suppliers}></PackagingForm>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}