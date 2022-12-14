import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import IngredientForm from './IngredientForm.js'
import EditableIngredientRow from './EditableIngredientRow.js'
import IngredientRow from './IngredientRow.js'
import ReusableTable from '../ReusableTable.js'
import Error from '../Error.js'
import DisplayMessage from '../DisplayMessage.js'

import './IngredientList.css'


// Ingredient List Component
export default function IngredientList() {

    const [ingredients, setIngredients] = useState(undefined);

    useEffect(() => {
        getDBIngredients();
    }, []);

    const getDBIngredients = () => {
        axios({
            method: "GET",
            url: "http://localhost:8000/api/ingredients-report"
        }).then((response) => {
            const iData = response.data
            setIngredients(iData);
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
        /* Fragment is an invisible tag that can be used to encapsulate multiple JSX elements without changing the HTML structure of the page */
        <div className='table-div'>
            {/* Show a row for each ingredient in ingredients.*/}
            <ReusableTable data={ingredients} />
        </div>
    )
}