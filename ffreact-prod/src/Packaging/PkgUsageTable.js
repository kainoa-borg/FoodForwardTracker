import React from 'react'

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

export default PkgUsageTable;