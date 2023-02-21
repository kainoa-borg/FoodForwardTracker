import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'
import HouseholdsReport from './Households/HouseholdsReport.js'
import IngredientsReport from './Ingredients/IngredientsReport'
import { Container, Button, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Dropdown from './components/Dropdown'
import { CssBaseline, Box } from '@mui/material'

const theme = createTheme({
    palette: {
        lightGreen: {
            main: '#9AB847', // light green logo color
            contrastText: '#fff'
        },
        darkGreen: {
            main: '#093B31',
            contrastText: '#fff'
        },
        lightBlue: {
            main: '#3E8477',
            contrastText: '#fff'
        },
        lightOrange: {
            main: '#A35426',
            contrastText: '#fff'
        },
        darkBlue: {
            main: '#070D3A',
            contrastText: '#fff'
        }
    }
})

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex-box',
    justifyContent: 'space-between',
};

const ReportsPage = (props) => {
    const [currPage, setCurrPage] = useState();
    
    const handlePageClick = (pageName) => {
        console.log(pageName)
        if (pageName === 'households-report') setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />);
        else if (pageName === 'ingredients-report') setCurrPage(<IngredientsReport handlePageClick={handlePageClick} />);
    }

    // HTML structure of this component
    return (
        <ThemeProvider theme={theme}>
        <div style={style}>
        <CssBaseline />
        <Dropdown
            trigger={<Button color='lightGreen' variant='contained'>Generate Report</Button>}
            menu={[
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Households Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('ingredients-report')}>
                    Ingredients Report</button>
                // <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                //     Packaging Report</button>,
                // <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                //     Cost Totals</button>,
                // <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                //     Menu Reports</button>,
                // <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                //     Purchasing Reports</button>
                ]}/>
            {currPage}
        </div>
        </ThemeProvider>
     );
}

export default ReportsPage;