import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { handleViewFile } from '../../customFunctions/CustomFunctions';
import { useContext } from 'react';
import { AddToPreferencesContext } from './AddToPreferencesContext';
import moment from 'moment';

function Training({ training, defaultVals }) {
    const { toggleModal } = useContext(AddToPreferencesContext)

    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={7}>VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS ATTENDED</td>
            </tr>
            <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black', width: '100%' }}>
                <td style={{ paddingLeft: '2px', width: '40%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            30.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography className='pds-fontsize-8px' align='center'>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS</Typography>
                                <Typography className='pds-fontsize-8px' align='center'>(Write in full)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', width: '10%', backgroundColor: '#eaeaea' }} colSpan={2}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-fontsize-8px' align='center'>INCLUSIVE DATES</Typography>
                            <Typography className='pds-fontsize-8px' align='center'>(mm/dd/yyyy)</Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">NUMBER OF HOURS</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">Type of LD</Typography>
                        <Typography sx={{ fontSize: '8px' }} align="center">(Managerial/Supervisory/Technical/etc)</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', width: '25%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">CONDUCTED/SPONSORED BY</Typography>
                        <Typography className='pds-fontsize-8px' align="center">(Write in full)</Typography>
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

            {training && training.map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('trainings', item)}>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-train-rows">
                        <Typography sx={{ width: '300px',lineHeight:1 }} className={` pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="left"><b> {item.title?.toUpperCase()}</b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black', width: '7%' }} className="pds-print-train-rows">
                        <Typography className='pds-fontsize-long-text4 pds-print-rows-p pds-print-rows-p-center' align="left"><b>{moment(item.datefrom).format('MM/DD/YYYY')}</b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black',width:'7%' }} className="pds-print-train-rows">
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center`} align="center"><b>{item.dateto === 'PRESENT' ? item.dateto : moment(new Date(item.dateto)).format('MM/DD/YYYY')}</b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-train-rows">
                        <Typography className='pds-fontsize-long-text4 pds-print-rows-p pds-print-rows-p-center' align="center"><b>{item.nohours}</b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-train-rows">
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="left"><b>{item.typeLD?.toUpperCase()}</b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} className="pds-print-train-rows">
                        <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="left"><b>{item.conducted?.toUpperCase()}</b></Typography>
                    </td>
                </tr>
            ))}
            {defaultVals && Array.from(Array(Number(19 - training.length))).map((item, index) => (
                <>
                    {training?.length === 0 && index === 0 ? (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="left"><b>N/A</b></Typography>
                            </td>
                        </tr>
                    ) : (
                        <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                            <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                                </Box>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                            </td>
                            <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                                <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                            </td>
                        </tr>
                    )}
                </>

            ))}
            {defaultVals && (
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={6}>
                    <Typography className='pds-fontsize-8px' sx={{ color: 'red' }} align="center"><b>(Continue to separate sheet if necessary)</b></Typography>
                </td>
            )}

            {!defaultVals && Array.from(Array(Number(38 - training.length))).map((item, index) => (
                <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ paddingLeft: '2px', border: '1px solid black', height: '28px' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                        </Box>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                        <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                        <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                    </td>
                    <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                        <Typography className='pds-fontsize-8px' align="left"><b></b></Typography>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default React.memo(Training)