import React, { useState, useEffect} from 'react'
import axios from 'axios'
// import IngredientForm from './IngredientForm.js'
// import IngredientRow from './IngredientRow.js'
// import EditableIngredientRow from './EditableIngredientRow'
import ReusableTable from '../ReusableTable.js'
import ReportsPage from 'src/ReportsPage.js';
// import Error from '../Error.js'
// import DisplayMessage from '../DisplayMessage.js'


// Ingredient List Component
export default function IngredientReport() {
    const [ingredients, setIngredients] = useState(undefined);

    useEffect(() => {
        getDBIngredients();
    }, []);

    const getDBIngredients = () => {
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
    }

    if (ingredients === undefined) {
        return (<>loading</>);
    }

    // The HTML structure of this component
    return (
        <div className='table-div'>
            {/* Show a row for each ingredient in ingredientts.*/}
            <ReusableTable data={ingredients}/>
        </div>
    )
}