import React from 'react';
import Typography from '@mui/material/Typography'


const Items1_3 = ({data}) => {
    console.log('pdf',data)
    return (
        <>
            <tr>
                <td rowSpan={2} colSpan={3} align="center">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="p" color="initial" className='plantilla-pdf-table'>
                            <b>Republic of the Philippines</b>
                        </Typography>
                        <Typography variant="p" color="initial" className='plantilla-pdf-table'>
                            <b>POSITION DESCRIPTION FORM</b>
                        </Typography>
                        <Typography variant="p" color="initial" className='plantilla-pdf-table'>
                            <b>DBM-CSC Form No. 1</b>
                        </Typography>
                        <Typography variant="p" color="initial" className='plantilla-pdf-table'>
                            (Revised Version No. 1, s. 2017)
                        </Typography>
                    </div>
                </td>
                <td colSpan={3} style={{ verticalAlign: 'top', backgroundColor: '#BEBEBE' }}>
                    <Typography className='font-12px' color="initial">
                        1. POSITION TITLE (as approved by authorized agency) with parenthetical title
                    </Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={3} align="center"> <Typography className='font-12px' color="initial">{data?.position_name}</Typography></td>
            </tr>
            <tr>
                <td colSpan={3} style={{ backgroundColor: '#BEBEBE' }}><Typography className='font-12px'> 2. ITEM NUMBER</Typography></td>
                <td colSpan={3} style={{ backgroundColor: '#BEBEBE' }}><Typography className='font-12px'>3. SALARY GRADE</Typography></td>
            </tr>
            <tr>
                <td colSpan={3} align="center"> <Typography className='font-12px'>{data?.item_number}</Typography></td>
                <td colSpan={3} align="center"> <Typography className='font-12px'>{data?.sg} - {data?.step}</Typography></td>
            </tr>
        </>
    );
};

export default React.memo(Items1_3);