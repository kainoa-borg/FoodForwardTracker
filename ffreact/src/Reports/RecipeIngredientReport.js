import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Box, FormControl, MenuItem, Select } from "@mui/material";


function sortForLength(recipeA, recipeB, sortBySelection) {
    //3 cases 
    //before,after,the same
    //checking ingredient length
    recipeA = getValue(recipeA, sortBySelection)
    recipeB = getValue(recipeB, sortBySelection)
    //decending sort right now
    if (recipeA > recipeB) {
        //put before recipe b
        return -1
    } else if (recipeB > recipeA) {
        //put b before recipe a
        return 1
    } else if (recipeA === recipeB) {
        //leave as is
        return 0
    }
    return 0;
}

function getValue(recipeItem, sortBy) {
    switch (sortBy) {
        case 'num_of_ingredients':
            return recipeItem.r_ingredients.length
        case 'sort_alphabeticaly':
            return recipeItem.r_name.toUpperCase()//toUpper makes sure ascii values dont mess it up
        //  case 'sort_foo':
        //return recipeItem.
    }

}

export default function RecipeIngredientReport(props) {
    const [recipeData, setRecipeData] = useState([]);
    const [sortBySelection, setSortBySelection] = useState('sort_alphabeticaly');//default filter is num_of_ingrediants
    // Get data from the API
    const getData = () => {
        axios({
            method: "GET",
            url: "http://4.236.185.213:8000/api/mealrecipes"
        }).then((response) => {
            //sort data
            response.data.sort((recipeA, recipeB) => {
                return sortForLength(recipeA, recipeB, sortBySelection)
            })
            //sets the data
            setRecipeData(response.data);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        getData();
    }, [sortBySelection])
    // ---- RETURNED JSX (HTML) STRUCTURE ----
    // (For each recipe)
    // FlexBox
    // Recipe Ingredient Information component:
    // Recipe name, meal/snack, servings --- (Separate component)
    // (For each recipe ingredient)
    // Recipe ingredient name, quantity, unit --- (Separate component)
    // ----
    return (
        <Box style={{ margin: '-5%' }}>
            <Box style={{ display: "flex", paddingTop: '5%' }}>
                <h2 style={{ marginRight: '5%' }}>Recipe Ingredient Report</h2>
                <FormControl variant="filled">
                    <Select
                        labelId="filter"
                        id="sort by select"
                        value={sortBySelection}
                        label="sort_by"
                        onChange={(event) => {
                            setSortBySelection(event.target.value)//updates on what the user selects
                        }}
                    >
                        <MenuItem value={'num_of_ingredients'}>Number of ingrediants</MenuItem>
                        <MenuItem value={'sort_alphabeticaly'}>Alphabeticaly</MenuItem>
                    </Select></FormControl></Box>
            <Box style={{ display: "flex", width: '100vw', flexWrap: 'wrap', md: { justifyContent: 'space-between' } }}>
                {recipeData.map((thisRecipe) => {
                    return (
                        // Outer shell of the "Recipe Ingredient Information component"
                        // removed width: '15vw'
                        <Box style={{ display: 'flex', paddingLeft: '1rem', paddingRight: '2rem', marginBottom: '1rem', border: 20 }}>
                            <Box style={{ width: 'flex', paddingRight: '1%', paddingLeft: '1%', }}>
                                <h4 style={{ marginBottom: -15 }}>{thisRecipe.r_name}</h4>
                                <h4 style={{ marginBottom: -15 }}>servings: {thisRecipe.r_servings}</h4>
                                <h4 style={{ marginBottom: -15 }}>Ingredients: </h4>
                                {thisRecipe.r_ingredients.map((ing) => {
                                    return (
                                        <Box sx={{ borderBottom: 0 }} style={{ marginBottom: '1rem' }}>
                                            <p style={{ marginBottom: -15, marginTop: 15 }}>{ing.ingredient_name}</p>
                                            <p style={{ marginBottom: -15 }}>Amt:{ing.amt}</p>
                                            <p style={{ marginBottom: 5 }}>Unit:{ing.unit}</p>
                                        </Box>
                                    )
                                })}
                            </Box>
                            {/* Look at 4.236.185.213:8000/api/mealrecipes to see how the data is structured and the key names for each field */}
                            {/* Insert Recipe Info (recipe.r_name, etc.) */}
                            {/* Map each recipe ingredient (recipe.r_ingredients) and return data in a formatted list (similar to IngredientDefReport) */}

                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
};