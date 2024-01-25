import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'

// returns data from the ingredients_usage table
const IngUsageTable = (props) => {
    const ing_usages = props.ingredient_usages
    if (ing_usages) {
        // console.log(JSON.stringify(this_ing.usages))
        if (ing_usages.length > 0) {
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableCell>Used Date</TableCell>
                            <TableCell>Used Amount</TableCell>
                        </TableHead>
                        {ing_usages.map((usage, key) => {
                            return (
                                <TableRow>
                                    <TableCell>{usage.used_date}</TableCell>
                                    <TableCell>{usage.used_qty}</TableCell>
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

export default IngUsageTable;