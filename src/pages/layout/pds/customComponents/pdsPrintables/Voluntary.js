import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { handleViewFile } from '../../customFunctions/CustomFunctions';
import moment from 'moment';

function Voluntary({ voluntary, defaultVals }) {

    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={6}>VI. VOLUNTARY WORK/INVOLVEMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S</td>
            </tr>
            <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ border: '1px solid black', width: '40%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            29.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography className='pds-fontsize-8px' align='center'>NAME & ADDRESS OF ORGANIZATION (Write in full)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} colSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-fontsize-8px' align='center'>INCLUSIVE DATES</Typography>
                            <Typography className='pds-fontsize-8px' align='center'>(mm/dd/yyyy)</Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">NUMBER OF HOURS</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">POSITION / NATURE OF WORK</Typography>
                    </Box>
                </td>
            </tr>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Typography className='pds-fontsize-8px' align="center">FROM</Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Typography className='pds-fontsize-8px' align="center">TO</Typography>
                </td>
            </tr>

            {voluntary && voluntary.map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item?.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => handleViewFile(item.id, 'voluntary/viewAttachFile')}>
                    <td style={{ border: '1px solid black' }} className="pds-print-volun-rows">
                        <Typography sx={{ width: '280px' }} className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align='left'><b>{item.organization?.toUpperCase()}</b></Typography>
                    </td>
                    <td style={{ border: '1px solid black', width: '7%' }} className="pds-print-volun-rows">
                        <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align='center'><b>{moment(item.datefrom).format('MM/DD/YYYY')}</b></Typography>
                    </td>
                    <td style={{ border: '1px solid black', width: '7%' }} className="pds-print-volun-rows">
                        <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align='center'><b>{item.dateto ? moment(item.dateto).format('MM/DD/YYYY') === 'Invalid date' ? item.dateto?.toUpperCase()  : moment(item.dateto).format('MM/DD/YYYY') : 'N/A'}</b></Typography>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-volun-rows">
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align='center'><b>{item.nohrs}</b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-volun-rows">
                        <Typography sx={{ width: '180px' }} className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align='left'><b>{item.positionwork?.toUpperCase()}</b></Typography>
                    </td>
                </tr>
            ))}
            {defaultVals && Array.from(Array(Number(7 - voluntary.length))).map((item, index) => (
                <>
                    {voluntary?.length === 0 && index === 0 ? (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ paddingLeft: '2px', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }} colSpan={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                </Box>
                            </td>
                        </tr>
                    ) : (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ paddingLeft: '2px', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }} colSpan={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                                </Box>
                            </td>
                        </tr>
                    )}

                </>
            ))}
            {defaultVals && (
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={5}>
                    <Typography className='pds-fontsize-8px' sx={{ color: 'red' }} align="center"><b>(Continue to separate sheet if necessary)</b></Typography>
                </td>
            )}
            {!defaultVals && Array.from(Array(Number(38 - voluntary.length))).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ paddingLeft: '2px', height: '28px' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }} colSpan={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                        </Box>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default React.memo(Voluntary)