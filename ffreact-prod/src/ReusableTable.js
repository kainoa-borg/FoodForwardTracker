import axios from 'axios';
import React, {useState} from 'react'

export default function ReusableTable(props) {
    // const data = [
    //     {hh_name: 'Anom', num_adult: 2, num_child: 1, veg_flag: false, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '123-456-7890', street: '1234 aStreet', city: 'aCity', pcode: '12345', state: 'MI', delivery_notes: 'N/A', allergies: []},
    //     {hh_name: 'Jean', num_adult: 1, num_child: 1, veg_flag: true, gf_flag: true, a_flag: false, sms_flag: true, paused_flag: false, phone: '234-567-8912', street: '4321 bStreet', city: 'bCity', pcode: '54321', state: 'MI', delivery_notes: 'Leave on porch', allergies: [{aType: 'Peanut'}]}
    // ]

    const [dataState, setDataState] = useState(props.data);
    const [editRowID, setEditRowID] = useState(null);
    const [editData, setEditData] = useState(null);

    return (
        <table>
            <thead>
                {Object.keys(dataState[0]).map((thisKey) => {
                    return (
                        <th>{thisKey}</th>
                    )
                })}
            </thead>
            <tbody>
                {dataState.map((thisData, thisKey) => {
                    // console.log(props.editID, thisKey);
                    return(
                        <tr key={thisKey}>
                        {Object.values(thisData).map((thisValue, colKey) => {
                            let ret = null;
                            if (props.editID === thisKey) {
                                ret = <input name={Object.keys(props.metadata)[colKey]} type={props.metadata[colKey]} value={thisValue}/>
                            }
                            else {
                                if (thisValue === null) {
                                    ret = (<td>N/A</td>)
                                }
                                else if (typeof thisValue === 'object' && thisValue) {
                                    console.log(typeof thisValue);
                                    ret = (<td><ReusableTable data={thisValue}/></td>)
                                }
                                else if (typeof thisValue !== 'object') {
                                    ret = (<td>{thisValue}</td>)
                                }
                            }
                            
                            return(ret)
                        })}

                        <td><button>Edit</button></td>

                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}