import { Table, TableHead, TableRow, TableCell, Input, Button, TableContainer, Paper } from '@mui/material';
import React, {useState, Fragment} from 'react'

export default function EditablePkgUsageTable(props) {
    const [currUsage, setCurrUsage] = useState({used_date: null, used_qty: null});
    const [pkgUsages, setPkgUsages] = useState(props.packaging_usage);

    // useEffect(()=>{
    //   setPkgUsages(props.editFormData.ingredient_usage);
    // }, props.editFormData);
    
    const handleKeyUsageChange = (event) => {
      const key = event.target.getAttribute('dataKey');
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.value;
      let newUsage = {...pkgUsages[key]};
      newUsage[fieldName] = fieldValue;
      let newPkgUsages = [...pkgUsages];
      console.log('eput line18 ', key);
      newPkgUsages[key] = newUsage;
      console.log('eput line20 ', newPkgUsages);
      setPkgUsages(newPkgUsages);
      props.updateEditForm('packaging_usage', newPkgUsages);
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
      const newUsages = [...pkgUsages, currUsage];
      setPkgUsages(newUsages);
      setCurrUsage({used_date: '', used_qty: ''});
      props.updateEditForm('packaging_usage', newUsages);
    }

    const handleDeleteUsage = (thisKey) => {
        const newUsages = [...pkgUsages];
        newUsages.splice(thisKey, 1);
        setPkgUsages(newUsages);
        props.updateEditForm('packaging_usage', newUsages);
    }

    if (pkgUsages) {
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell>Used Date</TableCell>
                <TableCell>Used Amount</TableCell>
              </TableHead>
                {pkgUsages.map((usage, thisKey) => {
                    return (
                        <Fragment>
                          <TableRow key={thisKey}>
                              <TableCell><Input dataKey={thisKey} name="used_date" type="date" value={usage.used_date} onChange={handleKeyUsageChange}/></TableCell>
                              <TableCell><Input dataKey={thisKey} name="used_qty" type='number' value={usage.used_qty} onChange={handleKeyUsageChange}/></TableCell>
                              <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUsage(thisKey)}>Delete</Button></TableCell>
                          </TableRow>
                        </Fragment>
                        )
                    })
                }
                    <TableRow>
                      <TableCell><Input name="used_date" value={currUsage.used_date} type="date" onChange={handleUsageChange}/></TableCell>
                      <TableCell><Input name="used_qty" value={currUsage.used_qty} type='number' onChange={handleUsageChange}/></TableCell>
                      <TableCell><Button color="lightBlue" variant='contained' onClick={handleAddUsage}>Add</Button></TableCell>
                    </TableRow>
            </Table>
          </TableContainer>
        )
    }
}