import React, {useState} from 'react'

export default function ReusableTable(props) {

    const [dataState /*, setDataState*/] = useState(props.data);

    console.log(dataState);

    return (
        <table>
            <thead>
                {Object.keys(dataState[1]).map((thisKey) => {
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
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}