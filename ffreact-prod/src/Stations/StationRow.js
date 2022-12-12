import AllergiesList from './AllergiesList.js'
import React from 'react'

// Station Row component
// Takes: key of current row, the state of the Station Page's hh list, deleteStation callback, handleEditClick callback
// Returns a Station table row component 
const StationRow = (props) => {
    const { thisKey, station, deleteStation, handleEditClick} = props;
    const key = thisKey;
    const s = station;

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{s.stn_name}</td>
            <td>{s.num_servings}</td>
            <td></td>
            
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteStation is called with this row's key */}
            <td><button onClick={() => deleteStation(key)}>Delete</button></td>
        </tr>
    )
}

export default StationRow;