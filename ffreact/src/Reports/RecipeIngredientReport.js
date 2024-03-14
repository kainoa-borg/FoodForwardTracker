import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Box } from "@mui/material";

export default function RecipeIngredientReport(props) {
    const [recipeData, setRecipeData] = useState([]);
    // Get data from the API
    const getData = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/mealrecipes"
          }).then((response)=>{
            setRecipeData(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    useEffect(()=>{
        getData();
    }, [])

    // ---- RETURNED JSX (HTML) STRUCTURE ----
    // (For each recipe)
        // FlexBox
            // Recipe Ingredient Information component:
                // Recipe name, meal/snack, servings --- (Separate component)
                // (For each recipe ingredient)
                    // Recipe ingredient name, quantity, unit --- (Separate component)
    // ----
    return (
        <Box style={{margin: '-5%'}}>
            <h2 style={{paddingTop: '5%'}}>Recipe Ingredient Report</h2>
            <Box style={{display: "flex", width: '100vw', flexWrap: 'wrap', md: {justifyContent: 'space-between'}}}>
                {recipeData.map((thisRecipe) => {
                    return (
                        // Outer shell of the "Recipe Ingredient Information component"
                        <Box style={{display: 'flex', width: '20vw', paddingLeft: '1rem', paddingRight: '1rem', marginBottom: '2rem', border: 10}}>
                            <h4 style={{width: '50%'}}>{thisRecipe.r_name}</h4>
                            <Box>
                                <h4 style={{width: '50%', paddingRight: '1%'}}>Ingredients:</h4>
                                {thisRecipe.r_ingredients.map((ing) => {
                                    return (
                                        <p>{ing.ingredient_name}</p>
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