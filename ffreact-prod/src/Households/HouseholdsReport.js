import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import HouseholdForm from './HouseholdForm.js'
import EditableHouseholdRow from './EditableHouseholdRow.js'
import HouseholdRow from './HouseholdRow.js'
import ReusableTable from '../ReusableTable.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import './HouseholdList.css'


// Household List Component
export default function HouseholdList() {
    // const data = [
    //     {hh_name: 'Anom', num_adult: 2, num_child: 1, veg_flag: false, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '123-456-7890', street: '1234 aStreet', city: 'aCity', pcode: '12345', state: 'MI', delivery_notes: 'N/A', allergies: []},
    //     {hh_name: 'Jean', num_adult: 1, num_child: 1, veg_flag: true, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '234-567-8912', street: '4321 bStreet', city: 'bCity', pcode: '54321', state: 'MI', delivery_notes: 'Leave on porch', allergies: [{aType: 'Peanut'}]}
    // ]

    const [households, setHouseholds] = useState(undefined);

    useEffect(() => {
        getDBHouseholds();
    }, []);

    const getDBHouseholds = () => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/households-report"
          }).then((response)=>{
            const hhData = response.data
            setHouseholds(hhData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    if (households === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            {/* Show a row for each household in households.*/}
            <ReusableTable data={households}/>
        </div>
    )
}