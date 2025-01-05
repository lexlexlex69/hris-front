import React from 'react';
import Typography from '@mui/material/Typography';

const FooterSignature = () => {
    return (
        <>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#BEBEBE' }} colSpan={4}>
                    <Typography sx={{ fontSize: '10.66px', backgroundColor: '#fff', color: 'red' }} align="center">
                        (Continue to separate sheet if necessary)
                    </Typography>
                </td>
            </tr>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                    <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }} align="center">
                        Signature
                    </Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                    <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }}></Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                    <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }} align="center">
                        Date
                    </Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                    <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }}></Typography>
                </td>
            </tr>
        </>
    );
};

export default FooterSignature;