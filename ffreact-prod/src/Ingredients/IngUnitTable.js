import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'

// returns data from the ingredients_usage table
const IngUnitTable = (props) => {
    const ing_units = props.ing_units
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
                                    <TableCell>{unit.recipe_amt}</TableCell>
                                    <TableCell>{unit.recipe_unit}</TableCell>
                                    <TableCell>{unit.shop_amt}</TableCell>
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