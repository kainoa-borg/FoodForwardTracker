import React from 'react'

// Ingredient Row component
// Takes: key of current row, the state of the Ingredient Page's ingredient list, deletePackaging callback, handleEditClick callback
// Returns a Ingredient table row component 
const PackagingRow = (props) => {
    const {thisKey, packaging, deletePackaging, handleEditClick} = props;
    const key = thisKey;
    const pkg = packaging;

    const PkgUsageTable = (props) => {
        const pkg_usages = props.packaging_usage
        if (pkg_usages) {
            // console.log(JSON.stringify(this_ing.usages))
            if (pkg_usages.length > 0) {
                return (
                    <table>
                            <th>used date</th>
                            <th>used qty</th>
                        {pkg_usages.map((usage, key) => {
                            return (
                                <tr>
                                    <td>{usage.used_date}</td>
                                    <td>{usage.used_qty}</td>
                                </tr>
                                )
                            })
                        }
                    </table>
                )
            }
        }
        else {
            return
        }
    }
    
    // HTML structure of this component
    return (
        <tr key={key}>
            <td>{pkg.package_type}</td>
            <td>{String(Boolean(pkg.returnable))}</td>
            <td>{pkg.unit_qty}</td>
            <td>{pkg.unit}</td>
            <td>{pkg.qty_holds}</td>
            <td>{String(pkg.in_date)}</td>
            <td>{String(pkg.in_qty)}</td>
            <td>
                <PkgUsageTable packaging_usage={pkg.packaging_usage}/>
            </td>
            <td>{pkg.qty_on_hand}</td>
            <td>{String(pkg.unit_cost)}</td>
            <td>{String(pkg.flat_fee)}</td>
            <td>{pkg.isupplier ? pkg.isupplier.s_name : 'N/A'}</td>
            <td>{pkg.pref_isupplier ? pkg.pref_isupplier.s_name : 'N/A'}</td>
            {/* When edit is clicked, handleEditClick is called with this row's key */}
            <td><button onClick={()=> handleEditClick(key)}>Edit</button></td>
            {/* When delete is clicked, deletePackaging is called with this row's key */}
            <td><button onClick={() => deletePackaging(key)}>Delete</button></td>
        </tr>
    )
}

export default PackagingRow;