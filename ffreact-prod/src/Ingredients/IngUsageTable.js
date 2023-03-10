import React from 'react'

const IngUsageTable = (props) => {
    const ing_usages = props.ingredient_usages
    if (ing_usages) {
        // console.log(JSON.stringify(this_ing.usages))
        if (ing_usages.length > 0) {
            return(
                <table>
                        <th>used date</th>
                        <th>used qty</th>
                    {ing_usages.map((usage, key) => {
                        return (
                            <tr>
                                <td>{usage.used_date}</td>
                                <td>{usage.used_qty}</td>
                            </tr>
                            )
                        })
                    }
                </table>
                    );
        }
    }
    else {
        return
    }
}

export default IngUsageTable;