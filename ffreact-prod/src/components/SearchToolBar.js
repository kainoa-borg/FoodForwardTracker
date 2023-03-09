import React, { useState, useEffect, useMemo, useRef, Fragment} from 'react'
import debounce, { update } from 'lodash'
import {TextField, Input} from '@mui/material'
import { Box } from '@mui/material';

const SearchToolBar = ({setFilterModel, searchField, searchLabel, filterField, filterOperator}) => {

    const searchLabelText = searchLabel ? ' ' + searchLabel : ''
    const lodash = require('lodash');
    const debounceMs = 600;

    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState('');

    // const handleSearchSubmit = (event) => {
    //     event.preventDefault();
    //     // Search the searchField for the value of this text field
    //     setFilterModel({ items: [
    //         {id: 0, columnField: searchField, operatorValue: 'contains', value: searchValue}
    //     ]})
    // }

    const updateFilterModel = lodash.debounce((value) => {
        setFilterModel({ items: [
            {id: 0, columnField: searchField, operatorValue: 'contains', value: value}
            // Commented out: Second filterModel item (multi-column filtering is not allowed)
            // {id: 1, columnField: filterField, operatorValue: filterOperator, value: filterValue},
        ]})
    }, debounceMs)

    useEffect(() => {
        updateFilterModel(searchValue, filterValue);
    }, [searchValue])

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    }
    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    }

    return (
        <Box>
            <TextField
            size='small'
            sx={{width: '15rem'}}
            value={searchValue}
            onChange={handleSearchChange}
            label={'Search' + searchLabelText + '...'}    
            ></TextField>
            {/* {filterField ? <Input value={filterValue} onChange={handleFilterChange} label='Filter...'></Input> : <></>} */}
            
        </Box>
    )
}

export default SearchToolBar;