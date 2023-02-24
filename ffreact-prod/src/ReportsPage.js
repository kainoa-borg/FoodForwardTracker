import React, { useState } from 'react'
import { Button, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Dropdown from './components/Dropdown'

import HouseholdsReport from './Households/HouseholdsReport.js'
import IngredientsReport from './Ingredients/IngredientsReport.js'
import PackagingReport from './Packaging/PackagingReport.js'
import PurchasingReport from './Reports/PurchasingReport.js'
import PackagingReturns from './Reports/PackagingReturns.js'
import MealPlanReport from './Reports/MealPlanReport.js'
import MealHistory from './Reports/MealHistory.js'
import CostTotals from './Reports/CostTotals.js'

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
        if (pageName === 'ingredients-report') setCurrPage(<IngredientsReport handlePageClick={handlePageClick} />);
        if (pageName === 'packaging-report') setCurrPage(<PackagingReport handlePageClick={handlePageClick} />);
        if (pageName === 'purchasing-report') setCurrPage(<PurchasingReport handlePageClick={handlePageClick} />);
        if (pageName === 'packaging-returns') setCurrPage(<PackagingReturns handlePageClick={handlePageClick} />);
        if (pageName === 'meal-plan-report') setCurrPage(<MealPlanReport handlePageClick={handlePageClick} />);
        if (pageName === 'meal-history') setCurrPage(<MealHistory handlePageClick={handlePageClick} />);
        else if (pageName === 'cost-totals') setCurrPage(<CostTotals handlePageClick={handlePageClick} />);
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
                    Ingredients Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('packaging-report')}>
                    Packaging Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('purchasing-report')}>
                    Purchasing Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('packaging-returns')}>
                    Packaging Returns</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('meal-plan-report')}>
                    Meal Plan Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('meal-history')}>
                    Meal History</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('cost-totals')}>
                    Cost Totals</button>,
                ]}/>
            {currPage}
        </div>
        </ThemeProvider>
     );
}

export default ReportsPage;