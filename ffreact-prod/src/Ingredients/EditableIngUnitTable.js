import { Button, Input, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'

export default function EditableIngUnitTable(props) {
    const [currUnit, setCurrUnit] = useState({used_date: null, used_qty: null});
    const [ingUnits, setIngUnits] = useState(props.ing_units);

    // useEffect(()=>{
    //   setIngUnits(props.editFormData.ingredient_usage);
    // }, props.editFormData);
    
    const handleKeyUnitChange = (event) => {
      const key = event.target.getAttribute('dataKey');
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      let newUnit = {...ingUnits[key]};
      newUnit[fieldName] = fieldValue;
      let newIngUnits = [...ingUnits];
      newIngUnits[key] = newUnit;
      setIngUnits(newIngUnits);
      props.updateEditForm('ing_units', newIngUnits);
    }

    const handleUnitChange = (event) => {
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.value;
      const newUnit = {...currUnit};
      newUnit[fieldName] = fieldValue;
      setCurrUnit(newUnit);
    }

    const handleAddUnit = (event) => {
      event.preventDefault();
      const newUnits = [...ingUnits, currUnit];
      setIngUnits(newUnits);
      setCurrUnit({recipe_amt: '', recipe_unit: '', shop_amt: '', shop_unit: ''});
      props.updateEditForm('ing_units', newUnits);
    }

    const handleDeleteUnit = (thisKey) => {
        const newUnits = [...ingUnits];
        newUnits.splice(thisKey, 1);
        setIngUnits(newUnits);
        props.updateEditForm('ing_units', newUnits);
    }

    if (ingUnits) {
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
              <TableCell>Recipe Amt</TableCell>
              <TableCell>Recipe Unit</TableCell>
              <TableCell>Shop Amt</TableCell>
              <TableCell>Shop Unit</TableCell>

              </TableHead>
                {ingUnits.map((unit, thisKey) => {
                    return (
                        <TableRow key={thisKey}>
                            <TableCell><Input inputProps={{dataKey:thisKey}} name="recipe_amt" type="number" value={String(unit.recipe_amt)} onChange={handleKeyUnitChange}/></TableCell>
                            <TableCell><Input inputProps={{dataKey:thisKey}} name="recipe_unit" type='text' value={unit.recipe_unit} onChange={handleKeyUnitChange}/></TableCell>
                            <TableCell><Input inputProps={{dataKey:thisKey}} name="shop_amt" type="number" value={String(unit.shop_amt)} onChange={handleKeyUnitChange}/></TableCell>
                            <TableCell><Input inputProps={{dataKey:thisKey}} name="shop_unit" type='text' value={unit.shop_unit} onChange={handleKeyUnitChange}/></TableCell>
                            <TableCell><Button color='lightBlue' variant='contained' onClick={() => handleDeleteUnit(thisKey)}>Delete</Button></TableCell>
                        </TableRow>
                        )
                    })
                }
                    <TableRow>
                      <TableCell><Input name="recipe_amt" type="number" placeholder="0.00" value={String(currUnit.recipe_amt)} onChange={handleUnitChange}/></TableCell>
                      <TableCell><Input name="recipe_unit" type='text' placeholder="oz, tbsp, cup" value={currUnit.recipe_unit} onChange={handleUnitChange}/></TableCell>
                      <TableCell><Input name="shop_amt" type="number" placeholder="0.00" value={String(currUnit.shop_amt)} onChange={handleUnitChange}/></TableCell>
                      <TableCell><Input name="shop_unit" type='text' placeholder="count, can, lb" value={currUnit.shop_unit} onChange={handleUnitChange}/></TableCell>
                      <TableCell><Button color='lightBlue' variant='contained' onClick={handleAddUnit}>Add</Button></TableCell>
                    </TableRow>
            </Table>
          </TableContainer>
            
        )
    }
}