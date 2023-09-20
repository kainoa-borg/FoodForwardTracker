import React, { useState } from 'react'
import EditableIngUsageTable from '../Ingredients/EditableIngUsageTable.js'
import { Input, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';

// Editable Ingredients Row
// Takes: key of current row, the state of the Ingredients Page's editFormData, updateIngredients callback, handleEditFormChange callback, and handleCancelClick callback
// Returns an editable ingredients table row component
const StationIngredientList = (props) => {
    const editable = props.editable;
    const updateFunction = props.updateFunction;
    const parentFieldName = props.parentFieldName;
    const fields = props.fields;
    // Datagrid params id and field
    const id = props.id;
    const field = props.field;

    // Create a clearItem object with the names and default values from fields
    const clearItem = () => {
        let temp = {}
        fields.map((field) => temp[field.name] = field.defaultValue);
        console.log('clearItem clearItem', temp);
        return temp;
    };
    const [currItem, setCurrItem] = useState(clearItem);
    const [items, setItems] = useState(props.items);

    // If this is an editable datagrid column, use datagrid api to update cell
    if (id && field) {
        const api = useGridApiContext();
        React.useEffect(() => {
            console.log('cell Change', items);
            api.current.setEditCellValue({id, field, value: items, debounceMs: 200})
        }, [items])
    }

    const handleKeyUnitChange = (event) => {
        console.log(event);
        const key = event.target.dataKey;
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        let newUnit = {...items[key]};
        newUnit[fieldName] = fieldValue;
        let newItems = [...items];
        newItems[key] = newUnit;
        setItems(newItems);
        console.log(newItems);
        updateFunction(parentFieldName, newItems);
    }

    const handleUnitChange = (event) => {
        const fieldName = event.target['name'];
        const fieldValue = event.target.value;
        const newItem = {...currItem};
        console.log('newItem handleUnitChange', newItem);
        newItem[fieldName] = fieldValue;
        setCurrItem(newItem);
    }

    const handleAddUnit = (event) => {
        event.preventDefault();
        const newItems = [...items, currItem];
        setItems(newItems);
        setCurrItem(clearItem);
        updateFunction(parentFieldName, newItems);
        console.log('newItem handleUnitChange', newItems);
    }

    const handleDeleteUnit = (thisKey) => {
        const newItems = [...items];
        newItems.splice(thisKey, 1);
        setItems(newItems);
        updateFunction(parentFieldName, newItems);
    }

    const getFieldInputType = (item, itemField) => {
        let itemType;
        
        if (itemField) itemType = typeof(item[itemField]);
        else itemType = typeof(item);

        switch (itemType) {
            case 'string':
                return 'text'
            case 'number':
                return 'number'
            case 'boolean':
                return 'checkbox'
        }
    }

    const getInputComponent = (field) => {
        if (field.inputComponent) {
            return field.inputComponent;
        }
        else {
            let fieldType = getFieldInputType(field.defaultValue);
            return (props) => <Input type={fieldType} {...props}></Input>
        }
    }

    // HTML structure of this component
    if (items) {
        return (
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                {/* Display headers for each field definition */}
                {fields.map((field, thisKey) => {
                    return (
                        <TableCell>{field.header}</TableCell>
                    )
                })}
                </TableHead>
                {/* Display existing items */}
                {items.map((item, thisKey) => {
                    return (
                        <TableRow key={thisKey}>
                            {editable
                            ?
                            //  If editable, display editable fields for each field definition
                            fields.map((field) => {
                                let InputComponent = getInputComponent(field);
                                return (
                                    <TableCell><InputComponent inputProps={{dataKey: thisKey}} dataKey={thisKey} name={field.name} value={item[field.name]} onChange={handleKeyUnitChange}/></TableCell>
                                )
                            })
                            :
                            Object.keys(item).map((itemField) => {
                                return (
                                    <TableCell><p>{item[itemField]}</p></TableCell>
                                )
                            })
                            }
                            {editable
                            ?
                            <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUnit(thisKey)}>Delete</Button></TableCell>
                            :
                            <></>}
                        </TableRow>
                        )
                    })
                }
                <TableRow>
                    {/* If editable is set, this is an editable table */}
                    {editable 
                        ?
                        fields.map((field, thisKey) => {
                            let InputComponent = getInputComponent(field);
                            return (
                                <TableCell><InputComponent inputProps={{dataKey:thisKey}} name={field.name} value={currItem[field.name]} onChange={handleUnitChange}/></TableCell>
                            )
                    }) : <></>}
                    {/* If editable is set, this is an editable table, display the add button */}
                    {editable ?
                    <TableCell><Button color='lightBlue' variant='contained' onClick={handleAddUnit}>Add</Button></TableCell>
                    : <></>
                    }
                </TableRow>
            </Table>
            </TableContainer>
        )
    }
}

export default StationIngredientList;