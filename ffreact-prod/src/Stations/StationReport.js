import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import StationForm from './StationForm.js'
import EditableStationRow from './EditableStationRow.js'
import StationRow from './StationRow.js'
import ReusableTable from '../ReusableTable.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './StationList.css'


// Station List Component
export default function StationList() {

    const [stations, setStations] = useState(undefined);

    useEffect(() => {
        getDBStations();
    }, []);

    const getDBStations = () => {
        axios({
            method: "GET",
            url:"http://localhost:8000/api/stations"
          }).then((response)=>{
            const hhData = response.data
            setStations(hhData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    if (stations === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            {/* Show a row for each Station in Stations.*/}
            <ReusableTable data={stations}/>
        </div>
    )
}