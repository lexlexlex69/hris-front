import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function OtherInfo({ specialSkills, recognition, organization, nNumberOthers, defaultVals }) {

    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>VIII. OTHER INFORMATION</td>
            </tr>
            <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} colSpan={2}>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>
                            31.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography className='pds-fontsize-8px'>SPECIAL SKILLS AND HOBBIES</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} colSpan={2}>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>
                            32.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography className='pds-fontsize-8px'>NON-ACADEMIC DISTINCTIONS / RECOGNITION</Typography>
                                <Typography className='pds-fontsize-8px'>(Write in full)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} colSpan={3}>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>
                            33.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography className='pds-fontsize-8px'>MEMBERSHIP IN ASSOCIATION/ORGANIZATION</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            {Array.from(Array(nNumberOthers)).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }} className="pds-print-educ-rows" colSpan={2}>
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center">
                            <b>
                                {specialSkills[index] && specialSkills[index] ? specialSkills[index].description?.toUpperCase() : 'N/A'}
                            </b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-educ-rows" colSpan={2}>
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center">
                            <b>
                                {recognition[index] && recognition[index] ? recognition[index].description?.toUpperCase() : 'N/A'}
                            </b>
                        </Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-educ-rows" colSpan={3}>
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center">
                            <b>
                                {organization[index] && organization[index] ? organization[index].description?.toUpperCase() : 'N/A'}
                            </b>
                        </Typography>
                    </td>
                </tr>
            ))}
            {defaultVals && Array.from(Array(7 - nNumberOthers)).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }} colSpan={2}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b>
                        </Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b>
                        </Typography>
                    </td>
                </tr>
            ))}
            {!defaultVals && Array.from(Array(39 - nNumberOthers)).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }} colSpan={2}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b>
                        </Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                        <Typography className='pds-fontsize-10px' align="center">
                            <b>
                            </b>
                        </Typography>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default React.memo(OtherInfo)