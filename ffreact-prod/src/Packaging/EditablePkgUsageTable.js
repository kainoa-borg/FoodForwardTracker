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
            <table>
                    <th>used date</th>
                    <th>used qty</th>
                {pkgUsages.map((usage, thisKey) => {
                    return (
                        <Fragment>
                          <tr key={thisKey}>
                              <td><input dataKey={thisKey} name="used_date" type="date" value={usage.used_date} onChange={handleKeyUsageChange}/></td>
                              <td><input dataKey={thisKey} name="used_qty" value={usage.used_qty} onChange={handleKeyUsageChange}/></td>
                              <td><button onClick={() => handleDeleteUsage(thisKey)}>Delete</button></td>
                          </tr>
                        </Fragment>
                        )
                    })
                }
                    <tr>
                      <td><input name="used_date" value={currUsage.used_date} type="date" onChange={handleUsageChange}/></td>
                      <td><input name="used_qty" value={currUsage.used_qty} onChange={handleUsageChange}/></td>
                      <td><button onClick={handleAddUsage}>Add</button></td>
                    </tr>
            </table>
        )
    }
}