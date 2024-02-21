import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'

// returns data from the ingredients_usage table
const IngUnitTable = (props) => {
    const ing_units = props.ing_units

    const removeTrailingZero = (number) => {
        // Convert to string
        let numString = number.toString();
        let i = numString.length - 1;
        // Start at end of string, stop at first non-zero number
        while (i >= 0) {
            if (numString[i] != 0 && numString[i] != '.') {
                // Truncate trailing zeros
                return numString.slice(0, i+1);
            }
                i -= 1;
        }
    }

    if (ing_units) {
        if (ing_units.length > 0) {
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableCell>Recipe Amt</TableCell>
                            <TableCell>Recipe Unit</TableCell>
                            <TableCell>Shop Amt</TableCell>
                            <TableCell>Shop Unit</TableCell>
                        </TableHead>
                        {ing_units.map((unit, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell>{removeTrailingZero(unit.recipe_amt)}</TableCell>
                                    <TableCell>{unit.recipe_unit}</TableCell>
                                    <TableCell>{removeTrailingZero(unit.shop_amt)}</TableCell>
                                    <TableCell>{unit.shop_unit}</TableCell>
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

export default IngUnitTable;