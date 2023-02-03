import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'
import HouseholdsReport from './Households/HouseholdsReport.js'
import { Container, Button, Typography } from '@mui/material'


const ReportsPage = () => {
    const [currPage, setCurrPage] = useState();
    
    const handlePageClick = (pageName) => {
        console.log(pageName)
        if (pageName === 'households-report') setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />);
        else if (pageName === 'households-report') setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />);

    }

    // HTML structure of this component
    return (
        <div className="App">
            <header className="App-header">
                <h2>Generate Report</h2>
                <Button variant='contained' onClick={() => handlePageClick('households-report')}>
                    Households Report
                </Button>
                <Button variant='contained' onClick={() => handlePageClick()}>
                    Ingredients Report
                </Button>
                <Button variant='contained' onClick={() => handlePageClick()}>
                    Packaging Report
                </Button>
                <Button variant='contained' onClick={() => handlePageClick()}>
                    Cost Totals
                </Button>
                <Button variant='contained' onClick={() => handlePageClick()}>
                    Menu Reports
                </Button>
                <Button variant='contained' onClick={() => handlePageClick()}>
                    Purchasing Reports
                </Button>
                {currPage}
            </header>
        </div>
     );
}

export default ReportsPage;