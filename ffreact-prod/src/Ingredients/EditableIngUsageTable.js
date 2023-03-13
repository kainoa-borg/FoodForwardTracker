import { Button, Input, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'

export default function EditableIngUsageTable(props) {
    const [currUsage, setCurrUsage] = useState({used_date: null, used_qty: null});
    const [ingUsages, setIngUsages] = useState(props.ingredient_usage);

    // useEffect(()=>{
    //   setIngUsages(props.editFormData.ingredient_usage);
    // }, props.editFormData);
    
    const handleKeyUsageChange = (event) => {
      const key = event.target.getAttribute('dataKey');
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.value;
      let newUsage = {...ingUsages[key]};
      newUsage[fieldName] = fieldValue;
      let newIngUsages = [...ingUsages];
      console.log('eiut line18 ', key);
      newIngUsages[key] = newUsage;
      console.log('eiut line20 ', newIngUsages);
      setIngUsages(newIngUsages);
      props.updateEditForm('ingredient_usage', newIngUsages);
    }

    const handleUsageChange = (event) => {
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.value;
      const newUsage = {...currUsage};
      newUsage[fieldName] = fieldValue;
      setCurrUsage(newUsage);
    }

    const handleAddUsage = (event) => {
      event.preventDefault();
      const newUsages = [...ingUsages, currUsage];
      setIngUsages(newUsages);
      setCurrUsage({used_date: '', used_qty: ''});
      props.updateEditForm('ingredient_usage', newUsages);
    }

    const handleDeleteUsage = (thisKey) => {
        const newUsages = [...ingUsages];
        newUsages.splice(thisKey, 1);
        setIngUsages(newUsages);
        props.updateEditForm('ingredient_usage', newUsages);
    }

    if (ingUsages) {
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
              <TableCell>Used Date</TableCell>
              <TableCell>Used Amount</TableCell>

              </TableHead>
                {ingUsages.map((usage, thisKey) => {
                    return (
                        <TableRow key={thisKey}>
                            <TableCell><Input dataKey={thisKey} name="used_date" type="date" value={usage.used_date} onChange={handleKeyUsageChange}/></TableCell>
                            <TableCell><Input dataKey={thisKey} name="used_qty" type='number' value={usage.used_qty} onChange={handleKeyUsageChange}/></TableCell>
                            <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUsage(thisKey)}>Delete</Button></TableCell>
                        </TableRow>
                        )
                    })
                }
                    <TableRow>
                      <TableCell><Input name="used_date" value={currUsage.used_date} type="date" onChange={handleUsageChange}/></TableCell>
                      <TableCell><Input name="used_qty" value={currUsage.used_qty} type='number' onChange={handleUsageChange}/></TableCell>
                      <TableCell><Button color='lightBlue' variant='contained' onClick={handleAddUsage}>Add</Button></TableCell>
                    </TableRow>
            </Table>
          </TableContainer>
            
        )
    }
}