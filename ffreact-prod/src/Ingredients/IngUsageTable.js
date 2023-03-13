import { Table, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react'

const IngUsageTable = (props) => {
    const ing_usages = props.ingredient_usages
    if (ing_usages) {
        // console.log(JSON.stringify(this_ing.usages))
        if (ing_usages.length > 0) {
            return (
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
            );
        }
    }
    else {
        return
    }
}

export default IngUsageTable;