import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import StationForm from './StationForm.js'
import EditableStationRow from './EditableStationRow.js'
import StationRow from './StationRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './StationList.css'


// Station List Component

export default function StationList() {
    const [stations, setStations] = useState(undefined);
    const [editStationID, setEditStationID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        stn_name: "",
        num_servings: null
    });
    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);

    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Station Name already found!"/>
            )
        }
        if (errCode = 'empty') {
                return <Error text="There doesn't seem to be any data!"/>
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
        setStations(getDBStations());
    }, []);

    const getDBStations = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://localhost:8000/api/stations"
          }).then((response)=>{
            const stnData = response.data
            setStations(stnData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const postDBStations = () => {
        console.log(stations);
        axios({
            method: "POST",
            url: "http://localhost:8000/api/stations/",
            data: stations
          }).then((response)=>{
              setStations(getDBStations());
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setdisplayMsgComponent(<DisplayMessage msg='Submitting changes to database!'/>);
    }

    const addStation = (station) => {
        console.log(JSON.stringify(station));
        // Check to see if we already have a duplicate Station Name
        if (!stations.find((s) => s.stn_name === station.stn_name))
        {
            axios({
                method: "POST",
                url: "http://localhost:8000/api/stations/",
                data: station
              }).then((response)=>{
                  setStations(getDBStations());
              }).catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  }
              });
            clearError();
        }
        else {
            // If this Station is already in Stations list, display error message
            handleError('DuplicateKey');
        }
    }

    const deleteStation = (key) => {
        const stationID = key; 
        axios({
            method: "DELETE",
            url: "http://localhost:8000/api/stations/" + stations[key].stn_name,
          }).then((response)=>{
              setStations(getDBStations());
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
        });
    }

    const updateStation = (key) => {
        let thisName = stations[key].stn_name;
        console.log(JSON.stringify(editFormData));
        axios({
            method: "PATCH",
            url: "http://localhost:8000/api/stations/"+thisName+'/',
            data: editFormData
          }).then((response)=>{
              setStations(getDBStations());
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        setEditStationID(null);
        clearError();
    }

    const handleEditFormChange = (event) => {
        // Get the name and value of the changed field
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
        // Create new Station object before setting state
        const newEditFormData = {...editFormData};
        newEditFormData[fieldName] = fieldValue;
        // Set state with new Station object
        setEditFormData(newEditFormData);
    }
    const updateEditForm = (names, values) => {
        const newEditFormData = {...editFormData};
        for (let i = 0; i < names.length; i++) {
          newEditFormData[names[i]] = values[i];
          console.log('(' + names[i] + ', ' + values[i] + ')', newEditFormData.a_flag);
        }
        setEditFormData(newEditFormData);
      }

    const handleEditClick = (key) => {
        setEditStationID(key);
        setEditFormData(stations[key]);
    }
    const handleCancelClick = () => {
        setEditStationID(null);
        setEditFormData(null);
    }

    if (stations === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            <table className='main-table'>
                <thead>
                    <tr>
                        <th>Station Name</th>
                        <th>Number of Servings</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each station in stations.*/}
                    {stations.map((station, key) => {
                        const thisKey = key;
                        return(
                            <Fragment>
                                {
                                // If this Station is the one to be edited, show an editable row instead
                                editStationID === thisKey 
                                        ? <EditableStationRow thisKey={thisKey} editFormData={editFormData} updateStation={updateStation} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick}/>
                                        : <StationRow thisKey={thisKey} station={station} deleteStation={deleteStation} handleEditClick={handleEditClick}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* If the list is empty display EmptyTableMessage */}
                    {stations.length < 1 ? handleError('empty') : null}
                </tbody>
            </table>
            <h3>Add A Station</h3>
            <StationForm addStation={addStation}></StationForm>
            <button onClick={postDBStations}>Submit Changes</button>
            {errorComponent}
            {displayMsgComponent}
        </div>
    )
}