import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const IngUnitReportTable = (props) => {
    const ing_units = props.ing_units

    if (ing_units) {
        if (ing_units.length > 0) {
            return (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableCell style={{fontWeight: 'bold', fontSize: '.6rem'}}>Recipe Amt to Shop Amt</TableCell>
                        </TableHead>
                        {ing_units.map((unit, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell>{String(unit.recipe_amt)} {unit.recipe_unit} to {String(unit.shop_amt)} {unit.shop_unit}</TableCell>
                                </TableRow>
                                )
                            })
                        }
                    </Table>
                </TableContainer>
            );
        }
    }
    else {
        return
    }
}

export default function IngredientDefReport(props) {
    const [ingDefs, setIngDefs] = useState([]);
    // Get data from the API
    const getData = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/ing-name-definitions"
          }).then((response)=>{
            setIngDefs(response.data);
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

    // ---- HTML STRUCTURE ----
    // FlexBox
        // Ingredient Definitions with conversions
            // 1/3rd of the container width
            // Listed alphabetically
    // ----
    return (
        <Box style={{margin: '-5%'}}>
            <h2>Ingredient Definitions Report</h2>
            <Box style={{display: "flex", width: '100vw', flexWrap: 'wrap', md: {justifyContent: 'space-between'}}}>
                {ingDefs.map((ingDef) => {
                    return (
                        <Box style={{width: '20vw', paddingLeft: '1rem', paddingRight: '1rem', marginBottom: '2rem'}}>
                            <p style={{fontWeight: 'bold', fontSize: '1rem'}}>{ingDef.ing_name}</p>
                            <IngUnitReportTable ing_units={ingDef.ing_units}/>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
};