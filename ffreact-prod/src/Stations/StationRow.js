//import StationCalcList from './StationCalcList.js'
import React from 'react'

// Station Row component
// Takes: key of current row, the state of the Station Page's hh list, deleteStation callback, handleEditClick callback
// Returns a Station table row component 
const StationRow = (props) => {
    const { thisKey, station, deleteStation, handleEditClick} = props;
    const key = thisKey;
    const s = station;

    const HhTable = (props) => {
        const hh_portions = props.households
        if (hh_portions) {
            // console.log(JSON.stringify(this_ing.usages))
            if (hh_portions.length > 0) {
                return(
                    <table>
                            <th>household name</th>
                            <th>Adults</th>
                            <th>Children over 6</th>
                            <th>Children under 6</th>
                            <th>sms</th>
                            <th>Vegan</th>
                            <th>Allergies</th>
                            <th>Gluten free</th>
                            <th>ls</th>
                            <th>Paused</th>
                        {hh_portions.map((servings, key) => {
                            return (
                                <tr>
                                    <td>{servings.hh_name}</td>
                                    <td>{servings.num_adult}</td>
                                    <td>{servings.num_child_gt_6}</td>
                                    <td>{servings.num_child_lt_6}</td>
                                    <td>{servings.sms_flag}</td>
                                    <td>{servings.veg_flag}</td>
                                    <td>{servings.allergy_flag}</td>
                                    <td>{servings.gf_flag}</td>
                                    <td>{servings.ls_flag}</td>
                                    <td>{servings.paused_flag}</td>
                                </tr>
                                )
                            })
                        }
                    </table>
                        );
            }
        }
        else {
            return
        }
    }

    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{s.stn_name}</td>
            <td>
                <HhTable households={s.household}/>
            </td>
            
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deleteStation is called with this row's key */}
            <td><button onClick={() => deleteStation(key)}>Delete</button></td>
        </tr>
    )
}

export default StationRow;