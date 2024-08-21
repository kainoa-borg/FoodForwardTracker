import React, { useState, useEffect} from 'react'
import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'

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
                <Typography variant="h5" sx={{paddingBottom: '1rem'}}>Ingredient Management Report</Typography>
                <Button variant='contained' onClick={doPrint} sx={{...classes.printButton, marginBottom: '1rem'}}>Print</Button>
                <Box sx={{display: "grid", gridTemplateColumns: '2fr 2fr 1fr 2fr 2fr', width: "90%"}}>
                    {columns.map((column) => 
                        <Typography variant="p" sx={classes.header}>{column.headerName}</Typography>
                    )}
                    <Typography variant="p" sx={{...classes.header, textAlign: 'center'}}>Pack Size</Typography>
                    <Typography variant="p" sx={{...classes.header, textAlign: 'center'}}>Qty on Hand</Typography>
                    <Typography variant="p" sx={classes.header}>Closing Qty</Typography>
                    <Typography variant="p" sx={classes.header}>Need to Update?</Typography>
                </Box>
            </thead>   
            <tbody>
                {
                    rows
                    ?
                    rows.map((row) => {
                        return (
                            <Box sx={{display: "grid", gridTemplateColumns: '2fr 2fr 1fr 2fr 2fr', width: "90%"}}>
                                {row.keys().forEach((key) => {return (
                                    <Typography variant="p" sx={classes.cell}>{row[key]}</Typography>
                                )})}
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

const IngredientManagementReport = (props) => {
    const [reportData, setReportData] = useState();

    const classes = styles;
    
    const getData = () => {
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "ing-name-definitions"
          }).then((response)=>{
            setReportData(response.data);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    const doPrint = () => {
        window.print();
    }

    useEffect(() => {
        getData();
    }, [])
    
    return (
        <table style={{...classes.printBody, width: '100%'}}>
            <thead>
                <Typography variant="h5" sx={{paddingBottom: '1rem'}}>Ingredient Management Report</Typography>
                <Button variant='contained' onClick={doPrint} sx={{...classes.printButton, marginBottom: '1rem'}}>Print</Button>
                <Box sx={{display: "grid", gridTemplateColumns: '2fr 2fr 1fr 2fr 2fr', width: "90%"}}>
                    <Typography variant="p" sx={classes.header}>Ingredient Name</Typography>
                    <Typography variant="p" sx={{...classes.header, textAlign: 'center'}}>Pack Size</Typography>
                    <Typography variant="p" sx={{...classes.header, textAlign: 'center'}}>Qty on Hand</Typography>
                    <Typography variant="p" sx={classes.header}>Closing Qty</Typography>
                    <Typography variant="p" sx={classes.header}>Need to Update?</Typography>
                </Box>
            </thead>   
            <tbody>
                {
                    reportData
                    ?
                    reportData.map((ingredient) => {
                        return (
                            <Box sx={{display: "grid", gridTemplateColumns: '2fr 2fr 1fr 2fr 2fr', width: "90%"}}>
                                    <Typography variant="p" sx={classes.cell}>{ingredient.ingredient_name}</Typography>
                                    <Typography variant="p" sx={{...classes.cell, ...classes.centerCell}}>{ingredient.unit}</Typography>
                                    <Typography variant="p" sx={{...classes.cell, ...classes.centerCell}}>{ingredient.qty_on_hand}</Typography>
                                    <Box sx={{...classes.cell, ...classes.emptyCell}}></Box>
                                    <Box sx={{...classes.cell, ...classes.emptyCell}}></Box>
                            </Box>
                        )
                    })
                    :
                    <>loading...</>
                }
            </tbody>
        </table>
    );
}

export default IngredientManagementReport