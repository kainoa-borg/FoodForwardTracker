import React, { useState, useEffect} from 'react'
import { Box, Button, Input, Snackbar, Typography, FormControl} from '@mui/material';

const styles = {
    printButton:{
        '@media print': {
            display: 'none'
        }
    },
    printBody: {
        '@media print': {
            position:  'fixed',
            backgroundColor: 'red',
            top: 0
        }
    },
    ingName: {
        minWidth: '20rem'
    },
    header: {
        fontSize: '1.25rem',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    cell: {
        fontSize: '1rem',
        border: 1,
        paddingTop: '.5rem',
        paddingBottom: '.5rem'
    },
    centerCell: {
        textAlign: 'center'
    },
    emptyCell: {
        minWidth: '5rem'
    }
}

const ReportGrid = (props) => {
    const doPrint = () => {
        window.print();
    }

    const classes = styles;
    const columns = props.columns;
    const rows = props.rows;

    return (
        <table style={{...classes.printBody, width: '100%'}}>
            <thead>
                <Button variant='contained' onClick={doPrint} sx={{...classes.printButton, marginBottom: '1rem'}}>Print</Button>
                <Box sx={{display: "flex", flexDirection: 'row', width: "90%"}}>
                    {columns.map((column) => 
                        <Typography variant="p" sx={{...classes.header, flexShrink: 1, width: column.width}}>{column.headerName}</Typography>
                    )}
                </Box>
            </thead>   
            <tbody>
                {
                    rows
                    ?
                    rows.map((row) => {
                        console.log(Object.keys(row));
                        console.log(columns.map((column) => column.field));
                        return (
                            <Box sx={{display: "flex", width: "90%"}}>
                                {columns.map((column) => {
                                    if (Object.keys(row).includes(column.field)) {
                                        console.log(column.field);
                                        return (
                                            <Typography variant="p" sx={{...classes.cell, flexShrink: 1, width: column.width}}>{row[column.field]}</Typography>
                                        )
                                    }
                                    else if(column.field == 'actions') {
                                        return (
                                            <Box sx={{...classes.cell, width: column.width}}>{column.renderCell()}</Box>
                                        );
                                    }
                                })}
                            </Box>
                        )
                    })
                    :
                    <>loading...</>
                }
            </tbody>
        </table>
    )
};

export default ReportGrid;