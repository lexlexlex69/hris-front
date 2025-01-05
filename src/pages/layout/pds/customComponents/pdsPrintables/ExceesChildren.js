import React from 'react';
import moment from 'moment';

const ExceesChildren = ({ children }) => {
    return (
        <>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} align="center" className='pds-fontsize-8px'><b>NAME OF CHILDREN (write  in fullname and list all)</b></td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} align="center" className='pds-fontsize-8px'><b>DATE OF BIRTH (mm/dd/yyyy)</b></td>
            </tr>
            {children && children.map((item, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid black',height:'28px'}} align="center" className='pds-fontsize-10px'><b>{item.child_name?.toUpperCase()}</b></td>
                    <td style={{ border: '1px solid black' }} className='pds-fontsize-10px' align='center'><b>{moment(item.dob).format('MM/DD/YYYY')}</b></td>
                </tr>
            ))}
            {children && Array.from(Array(40 - children.length )).map((item, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid black',height:'28px' }} align="center" className='pds-fontsize-10px'><b></b></td>
                    <td style={{ border: '1px solid black' }} align="center" className='pds-fontsize-10px'><b></b></td>
                </tr>
            ))}
        </>
    );
};

export default ExceesChildren;