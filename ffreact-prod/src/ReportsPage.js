import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'


const ReportsPage = (props) => {
    const handlePageClick = props.handlePageClick;
    // HTML structure of this component
    return (
        <Fragment>
            <h3>Generate Report</h3>
            <button onClick={() => handlePageClick('reportsPage')}>
                Ingredients Report
            </button>
            <button onClick={() => handlePageClick('reportsPage')}>
                Packaging Report
            </button>
            <button onClick={() => handlePageClick('reportsPage')}>
                Cost Totals
            </button>
            <button onClick={() => handlePageClick('reportsPage')}>
                Menu Reports
            </button>
            <button onClick={() => handlePageClick('reportsPage')}>
                Purchasing Reports
            </button>
        </Fragment>
    );
}

export default ReportsPage;