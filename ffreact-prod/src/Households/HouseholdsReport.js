import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import HouseholdForm from './HouseholdForm.js'
import EditableHouseholdRow from './EditableHouseholdRow.js'
import HouseholdRow from './HouseholdRow.js'
import ReusableTable from '../ReusableTable.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'


// Household List Component
export default function HouseholdList() {

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