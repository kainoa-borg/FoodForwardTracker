import React, { useState, useEffect} from 'react'
import axios from 'axios'
import ReusableTable from '../ReusableTable.js'

// Packaging List Component
export default function MealPlanReport() {
    const [packaging, setPackaging] = useState(undefined);
    // const [ingredients, setIngredients] = useState(undefined);

    useEffect(() => {
        getDBPackaging();
        //getDBIngredients();
    }, []);

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/packaging-reports"
          }).then((response)=>{
            const pkgRetData = response.data
            setPackaging(pkgRetData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    /*const getDBIngredients = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ingredients-report"
          }).then((response)=>{
            const ingData = response.data
            setIngredients(ingData);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }*/

    if (packaging === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        <div className='table-div'>
            {/* Show a row for each entry in packaging.*/}
            <ReusableTable data={packaging}/>
        </div>
    )
}