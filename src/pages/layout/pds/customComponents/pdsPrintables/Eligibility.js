import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { handleViewFile } from '../../customFunctions/CustomFunctions';
import { useContext } from 'react';
import { AddToPreferencesContext } from './AddToPreferencesContext';
import moment from 'moment'

function Eligibility({ eligibility, defaultVals }) {
    const { toggleModal } = useContext(AddToPreferencesContext)

    return (
        <React.Fragment>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>IV. CIVIL SERVICE ELIGIBILITY</td>
            </tr>
            <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ border: '1px solid black', width: '40%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ mr: 1 }} className='pds-fontsize-8px'>26.</Typography>
                        <Typography className='pds-fontsize-8px'>CAREER SERVICE/ RA 1080 (BOARD/BAR) UNDER SPECIAL LAW/CES/CSEE BARANGAY ELIGIBILITY/DRIVER'S LICENSE</Typography>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '5%' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }} >
                        <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">RATING</Typography>
                        <Typography className='pds-fontsize-8px' align="center">(If Applicable)</Typography>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '10%' }} rowSpan={2}>
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">DATE OF EXAMINATION/CONFERMENT</Typography>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '20%' }} className='pds-fontsize-long-text' rowSpan={2}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">PLACE OF EXAMINATION/CONFERMENT</Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '10%' }} colSpan={2}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">LICENSE (if applicable)</Typography>
                </td>
            </tr>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '10%', height: '28px' }}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">NUMBER</Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '10%', height: '28px' }}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">DATE OF VALIDITY</Typography>
                </td>
            </tr>

            {eligibility && eligibility.map((item, index) => (
                <tr key={index} style={{ height: '20px', border: '1px solid black' }} className={item?.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('eligibility', item)} >
                    <td style={{ border: '1px solid black', width: '10%' }} className="pds-print-eli-rows" >
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`}>
                            <b>
                                {item.title ? item.title?.toUpperCase() : 'N/A'}
                            </b>
                        </Typography>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-eli-rows" >
                        <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="left"><b>{item.rating ? item.rating : 'N/A'}</b></Typography>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-eli-rows">
                        <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.dateofexam ? moment(item.dateofexam).format('MM/DD/YYYY') : 'N/A'}</b></Typography>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-eli-rows" >
                        <Box width='205px'>
                            <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="left"><b>{item.placeofexam?.toUpperCase()}</b></Typography>
                        </Box>

                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-eli-rows" >
                        <Box>
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.licenseno ? item.licenseno : 'N/A'}</b></Typography>

                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }} className="pds-print-eli-rows" >
                        <Box>
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.dateissue ? moment(item.dateissue).format('MM/DD/YYYY') !== 'Invalid date' ? moment(item.dateissue).format('MM/DD/YYYY') : item.dateissue?.toUpperCase() : 'N/A'}</b></Typography>
                        </Box>
                    </td>
                </tr>
            ))}

            {defaultVals && eligibility.length <= 7 && Array.from(Array(Number(7 - eligibility.length))).map((item, index) => (
                <>
                    {eligibility.length === 0 && index === 0 ? (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ border: '1px solid black', width: '10%', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px'><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </Box>
                            </td>
                        </tr>
                    ) : (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ border: '1px solid black', width: '10%', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px'><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="left"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <Box>
                                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </Box>
                            </td>
                        </tr>
                    )}

                </>

            ))}
            {!defaultVals && Array.from(Array(Number(39 - eligibility.length))).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item?.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"}>
                    <td style={{ border: '1px solid black', width: '10%', height: '28px' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography className='pds-fontsize-8px'><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="left"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                        <Box>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </Box>
                    </td>
                    {/* <td style={{ border: '1px solid black' }}>
                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '50%' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ width: '50%' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td> */}
                </tr>
            ))}
            {defaultVals && (
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={6}>
                    <Typography className='pds-fontsize-8px' sx={{ color: 'red' }} align="center"><b>(Continue to separate sheet if necessary)</b></Typography>
                </td>
            )}

        </React.Fragment>
    )
}

export default React.memo(Eligibility)