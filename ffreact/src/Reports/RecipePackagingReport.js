import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Card, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function RecipePackagingReport(props) {
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
            <h2>Recipe Packaging Report</h2>
            <Box style={{display: "flex", width: '100vw', flexWrap: 'wrap', md: {justifyContent: 'space-between'}}}>
                {recipeData.map((thisRecipe) => {
                    return (
                        // Outer shell of the "Recipe Packaging Information component"
                        <Box component={Card} style={{display: 'flex', width: '45vw', paddingLeft: '1rem', paddingRight: '1rem', marginRight: '1rem', marginBottom: '2rem', border: 10}}>
                            <Box style={{width: '30%'}}>
                                <h4>{thisRecipe.r_name}</h4>
                                <h4>Servings: {thisRecipe.r_servings}</h4>
                            </Box>
                            {/* Table of packaging data */}
                            <Box style={{width: '70%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{width: '30%'}}>Package Type</TableCell>
                                            <TableCell style={{width: '70%'}}>Contents</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {thisRecipe.r_packaging.map((pkg) => {
                                            return (
                                                    <TableRow>
                                                        <TableCell style={{width: '30%'}}>{pkg.pkg_type}</TableCell>
                                                        <TableCell style={{width: '70%'}}>{pkg.pkg_contents}</TableCell>
                                                    </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
};