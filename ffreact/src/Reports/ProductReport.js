import React, { useState } from 'react';
import axios from 'axios';

const ProductReport = () => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const fetchReport = async (product) => {
        try {
            axios({
                method: "GET",
                url: process.env.REACT_APP_API_URL + `product-report/`,
                params: { product }
            }).then((response) => {
                setReport(response.data);
                setError(null);
            }).catch((error) => {
                setError(error.response ? error.response.data.error : 'Error fetching report');
                setReport(null);
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
        } catch (err) {
            setError('Error fetching report. Please try again.');
            setReport(null);
        }
    };

    return (
        <div>
            <h1>Product Report</h1>
            <div>
                <button onClick={() => fetchReport('ppMealKit')}>PP Meal Kit</button>
                <button onClick={() => fetchReport('childrenSnacks')}>Children Snacks</button>
                <button onClick={() => fetchReport('foodBox')}>Food Box</button>
                <button onClick={() => fetchReport('rteMeal')}>RTE Meal</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {report && (
                <div>
                    <h2>Report for {report.product}</h2>
                    <p>Total Servings: {report.total_servings}</p>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ padding: '20px' }}>First Name</th>
                                <th style={{ padding: '20px' }}>Last Name</th>
                                {!report.product.includes('childrenSnacks') && (
                                    <th style={{ padding: '20px' }}>Adult Servings</th>
                                )}
                                <th style={{ padding: '20px' }}>Child Servings</th>
                                <th style={{ padding: '20px' }}>Total Servings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.households.map((household) => (
                                <tr key={household.household_id}>
                                    <td style={{ padding: '22px' }}>{household.first_name}</td>
                                    <td style={{ padding: '20px' }}>{household.last_name}</td>
                                    {!report.product.includes('childrenSnacks') && (
                                        <td style={{ padding: '20px' }}>{household.adult_servings}</td>
                                    )}
                                    <td style={{ padding: '20px' }}>{household.child_servings}</td>
                                    <td style={{ padding: '20px' }}>{household.total_servings}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductReport;