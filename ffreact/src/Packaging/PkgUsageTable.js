import { Table, TableHead, TableCell, TableRow, Paper, TableContainer } from '@mui/material'
import React from 'react'

const PkgUsageTable = (props) => {
    const pkg_usages = props.packaging_usage
    if (pkg_usages) {
        // console.log(JSON.stringify(this_ing.usages))
        if (pkg_usages.length > 0) {
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableCell>Used Date</TableCell>
                            <TableCell>Used Amount</TableCell>
                        </TableHead>
                        {pkg_usages.map((usage, key) => {
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
            )
        }
    }
    else {
        return
    }
}

export default PkgUsageTable;