import React, { useState, useEffect, useMemo, useRef } from 'react'
import debounce, { update } from 'lodash'
import {TextField} from '@mui/material'

const SearchToolBar = (props) => {
    const setFilterModel = props.setFilterModel;
    const searchField = props.searchField;

    const lodash = require('lodash');
    const debounceMs = 600;

    const [searchValue, setSearchValue] = useState();

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
        ]})
    }, debounceMs)

    useEffect(() => {
        updateFilterModel(searchValue);
    }, [searchValue])

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    }

    return (
        <TextField 
            // type={'search'} 
            value={searchValue}
            onChange={handleSearchChange}
            label='Search...'    
        ></TextField>
    )
}

export default SearchToolBar;