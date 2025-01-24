import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';


const IndividualHouseholdProductReport = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
         try {
            // Call the API to get the hh_id based on the first and last name
            axios({
                method: "GET",
                url: process.env.REACT_APP_API_URL + "household-id/",
                params: { first_name: firstName, last_name: lastName }
            }).then((hhIdResponse) => {
                const hhId = hhIdResponse.data.hh_id;

                // Call the API to get the report based on the hh_id
                axios({
                    method: "GET",
                    url: process.env.REACT_APP_API_URL + "individual-client/" + hhId + "/report",
                }).then((reportResponse) => {
                    setReport(reportResponse.data);
                    setError(null);
                }).catch((error) => {
                    setError('Error fetching report. Please try again.');
                    setReport(null);
                    if (error.response) {
                        console.log(error.response);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
            }).catch((error) => {
                setError('Error fetching household ID. Please try again.');
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
        <Box sx={{ padding: 2 }}>
            <Typography variant='h5' gutterBottom>Individual Household Product Report</Typography>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                    />
                </Box>                
                <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
            </Paper>
            {error && <Typography color="error">{error}</Typography>}
            {report && (
                 <Paper sx={{ padding: 2 }}>
                    <Typography variant='h6'>Report</Typography>
                    <Typography variant='body1'>First Name: {report.household.first_name}</Typography>
                    <Typography variant='body1'>Last Name: {report.household.last_name}</Typography>
                    <Typography variant='body1'>Products:</Typography>
                    <ul>
                        {Object.entries(report.products).map(([productType, subscribed], index) => {
                            if (!subscribed) return null;
                            const servings = productType === 'Children Snacks'
                                ? report.household.children_servings
                                : report.household.adult_servings + report.household.children_servings;
                            return (
                                <li key={index}>
                                    <Typography variant='body2'>
                                        {productType} - {subscribed ? 'Subscribed' : 'Not Subscribed'} - {servings} servings
                                    </Typography>
                                </li>
                            );
                        })}
                    </ul>
                </Paper>
            )}
        </Box>
    );
};

export default IndividualHouseholdProductReport;