import React, { useState } from 'react'
import EditableIngUsageTable from '../Ingredients/EditableIngUsageTable.js'
import { Input, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

// Editable Ingredients Row
// Takes: key of current row, the state of the Ingredients Page's editFormData, updateIngredients callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable ingredients table row component
const StationIngredientList = (props) => {
    const updateFunction = props.updateFunction;
    const parentFieldName = props.parentFieldName;
    const headers = props.headers;
    const clearItem = props.clearItem;
    const [currItem, setCurrItem] = useState(clearItem);
    const [items, setItems] = useState(props.items);

    const handleKeyUnitChange = (event) => {
        const key = event.target.getAttribute('dataKey');
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        let newUnit = {...items[key]};
        newUnit[fieldName] = fieldValue;
        let newItems = [...items];
        newItems[key] = newUnit;
        setItems(newItems);
        updateFunction(parentFieldName, newItems);
    }

    const handleUnitChange = (event) => {
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newItem = {...currItem};
        newItem[fieldName] = fieldValue;
        setCurrItem(newItem);
    }

    const handleAddUnit = (event) => {
        event.preventDefault();
        const newItems = [...items, currItem];
        setItems(newItems);
        setCurrItem(clearItem);
        updateFunction(parentFieldName, newItems);
    }

    const handleDeleteUnit = (thisKey) => {
        const newItems = [...items];
        newItems.splice(thisKey, 1);
        setItems(newItems);
        updateFunction(parentFieldName, newItems);
    }

    const getFieldInputType = (item, itemField) => {
        switch (typeof(item[itemField])) {
            case 'string':
                return 'text'
            case 'number':
                return 'number'
            case 'boolean':
                return 'checkbox'
        }
    }

    // HTML structure of this component
    if (items) {
        return (
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                {headers.map((header, thisKey) => {
                    return (
                        <TableCell>{header}</TableCell>
                    )
                })}
                </TableHead>
                {items.map((item, thisKey) => {
                    return (
                        <TableRow key={thisKey}>
                            {typeof(clearItem) == 'object' ? Object.keys(clearItem).map((itemField, thisKey) => {
                                const fieldType = getFieldInputType(item, itemField);
                                return (
                                    <TableCell><Input inputProps={{dataKey:thisKey}} name={itemField} type={fieldType} value={item[itemField]} onChange={handleKeyUnitChange}/></TableCell>
                                )
                            }) : <></>}
                            <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUnit(thisKey)}>Delete</Button></TableCell>
                        </TableRow>
                        )
                    })
                }
                <TableRow>
                    {typeof(clearItem) == 'object' ? Object.keys(clearItem).map((itemField, thisKey) => {
                        const fieldType = getFieldInputType(clearItem, itemField);
                        return (
                            <TableCell><Input inputProps={{dataKey:thisKey}} name={itemField} type={fieldType} value={currItem[itemField]} onChange={handleUnitChange}/></TableCell>
                        )
                    }) : <></>}
                    <TableCell><Button color='lightBlue' variant='contained' onClick={handleAddUnit}>Add</Button></TableCell>
                </TableRow>
            </Table>
            </TableContainer>
        )
    }
}

export default StationIngredientList;