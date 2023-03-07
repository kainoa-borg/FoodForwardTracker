import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReusableTable from '../ReusableTable.js'

// Packaging List Component
export default function PackagingList() {
    const [packaging, setPackaging] = useState(undefined);

    useEffect(() => {
        getDBPackaging();
    }, []);

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/packaging-report"
          }).then((response)=>{
            const pkgData = response.data
            setPackaging(pkgData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    if (packaging === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            {/* Show a row for each packaging item in packaging.*/}
            <ReusableTable data={packaging}/>
        </div>
    )
}