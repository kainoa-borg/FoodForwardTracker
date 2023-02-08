import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios'
import StationForm from './StationForm.js'
import EditableStationRow from './EditableStationRow.js'
import StationRow from './StationRow.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'
import { Button, Box, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material"
import MealsPage from '../MealsPage'
import { BrowserRouter as Router, Link } from "react-router-dom"

import './StationList.css'

// Station List Component

export default function StationList() {
    const [recipes] = useState(undefined);
    const [stations, setStations] = useState(undefined);
    const [households, setHouseholds] = useState(undefined);
    const [editStationID, setEditStationID] = useState(null);
    const [editFormData, setEditFormData] = useState({
        stn_name: "",
        household: []
    });

    const [errorComponent, setErrorComponent] = useState(null);
    const [displayMsgComponent, setdisplayMsgComponent] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(null);
    
    const handleError = (errCode) => {
        if (errCode === 'DuplicateKey') {
            setErrorComponent(
                <Error text="Station Name already found!"/>
            )
        }
        else if (errCode = 'empty') {
            setErrorComponent(
                <Error text="There doesn't seem to be any data!"/>
            )
        }
    }
    const clearError = () => {
        setErrorComponent(null);
    }

    useEffect(() => {
//        setStations(getDBStations());
        getDBStations();
        getDBHhref();
    }, []);

    const getDBHhref = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/households"
        }).then((response)=>{
            console.log(response.data[0])
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

    const getDBStations = () => {
        console.log("MAKING REQUEST TO DJANGO")
        setLoadingComponent(<Error text="LOADING DATA..."/>);
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/stations"
          }).then((response)=>{
            const stnData = response.data
            setStations(stnData);
            setLoadingComponent(null);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const postDBStations = () => {
        axios({
            method: "POST",
            url: "/stations/",
            data: stations
          }).then((response)=>{
              getDBStations();
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
        const lastID = stations[stations.length - 1]['s_id'];
        station['s_id'] = lastID + 1;
        axios({
            method: "POST",
            url:"http://4.236.185.213:8000/api/stations/",
            data: station
          }).then((response)=>{
            getDBStations();
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
        clearError();
    }
    const deleteStation = (key) => {
        const stationID = key; 
        axios({
            method: "DELETE",
            url: "http://4.236.185.213:8000/api/stations/" + stations[key].stn_name,
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
            url: "http://4.236.185.213:8000/api/stations/"+thisName+'/',
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

    if (stations === undefined || households === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
            <div className='table-div'>
            <MealsPage />
                <h3>Prep Stations</h3>
                <table className='main-table'>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 360 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">
                                        <h4>Recipe Selection</h4>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stations.map((station, key) => {
                                    const thisKey = key
                                    return (
                                        <Fragment key={thisKey}>
                                            {
                                                // If this Station is the one to be edited, show an editable row instead
                                                editStationID === thisKey
                                                    ? <EditableStationRow thisKey={thisKey} editFormData={editFormData} households={households} updateStation={updateStation} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick} />
                                                    : <StationRow thisKey={thisKey} station={station} deleteStation={deleteStation} handleEditClick={handleEditClick} />}
                                        </Fragment>
                                    )
                                })}
                                {/* If the list is empty display EmptyTableMessage */}
                                {stations.length < 1 ? handleError('empty') : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </table>
                <table className='main-table'>
                    <thead>
                        <tr>
                            <th>Station Select Dropdown</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Show a row for each station in stations.*/}
                        {stations.map((station, key) => {
                            const thisKey = key
                            return (
                                <Fragment key={thisKey}>
                                    {
                                        // If this Station is the one to be edited, show an editable row instead
                                        editStationID === thisKey
                                            ? <EditableStationRow thisKey={thisKey} editFormData={editFormData} households={households} updateStation={updateStation} handleEditFormChange={handleEditFormChange} updateEditForm={updateEditForm} handleCancelClick={handleCancelClick} />
                                            : <StationRow thisKey={thisKey} station={station} deleteStation={deleteStation} handleEditClick={handleEditClick} />}
                                </Fragment>
                            )
                        })}
                        {/* If the list is empty display EmptyTableMessage */}
                        {stations.length < 1 ? handleError('empty') : null}
                    </tbody>
                </table>
                {loadingComponent}

                <h3>Add A Station</h3>
                <StationForm addStation={addStation}></StationForm>
                <button onClick={postDBStations}>Submit Changes</button>
                {errorComponent}
                {displayMsgComponent}
            </div>
    )
}
/*
<table className='main-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th># Adults</th>
                        <th># Children 0-6</th>
                        <th># Children 7-17</th>
                        <th>SMS</th>
                        <th>Vegan</th>
                        <th>Allergies</th>
                        <th>Gluten Free</th>
                        <th>Lactose Free</th>
                        <th>Paused</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show a row for each station in stations.}
                    {households.map((hhref, key) => {
                        const thisKey = key;
                        return(
                            <Fragment key={thisKey}>
                                {
                                // If this Station is the one to be edited, show an editable row instead
                                <HhrefRow thisKey={thisKey} hhref={hhref}/>
                                }
                            </Fragment>
                        );
                    })}
                    {/* If the list is empty display EmptyTableMessage }
                    {households.length < 1 ? handleError('empty') : null}
                </tbody>
            </table>
        */