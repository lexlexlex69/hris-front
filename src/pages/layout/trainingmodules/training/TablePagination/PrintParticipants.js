import React from "react";
import '.././Training.css';

export const PrintParticipants = React.forwardRef((props,ref) => {
    return (
        <div ref = {ref} id='print-participants'>
            <table className="print-participants-table">
                <thead>
                    <tr>
                        <th>
                            Department
                        </th>
                        <th>
                            First Name
                        </th>
                        <th>
                            Last Name
                        </th>
                        <th>
                            Position
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map((item,key)=>
                            <tr key={key}>
                                <td>
                                    {item.short_name}
                                </td>
                                <td>
                                    {item.fname}
                                </td>
                                <td>
                                    {item.lname}
                                </td>
                                <td>
                                    {item.position_name}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
})