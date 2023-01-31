import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import axios from 'axios'
import HouseholdsReport from './Households/HouseholdsReport.js'


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
                <h1>Generate Report</h1>
                <button onClick={() => handlePageClick('households-report')}>
                    Households Report
                </button>
                <button onClick={() => handlePageClick()}>
                    Ingredients Report
                </button>
                <button onClick={() => handlePageClick()}>
                    Packaging Report
                </button>
                <button onClick={() => handlePageClick()}>
                    Cost Totals
                </button>
                <button onClick={() => handlePageClick()}>
                    Menu Reports
                </button>
                <button onClick={() => handlePageClick()}>
                    Purchasing Reports
                </button>
                {currPage}
            </header>
        </div>
     );
}

export default ReportsPage;