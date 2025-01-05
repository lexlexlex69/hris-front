import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { handleViewFile } from '../../customFunctions/CustomFunctions';
import { useContext } from 'react';
import { AddToPreferencesContext } from './AddToPreferencesContext';
import moment from 'moment';

function WorkExp({ workExp, defaultVals }) {
    const { toggleModal } = useContext(AddToPreferencesContext)
    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>V. WORK EXPERIENCE</td>
            </tr>
            <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ border: '1px solid black', width: '10%', backgroundColor: '#eaeaea' }} colSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={{ mr: 1 }}>
                                28.
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className='pds-fontsize-8px' align='center'>INCLUSIVE DATES</Typography>
                                    <Typography className='pds-fontsize-8px' align='center'>(mm/dd/yyyy)</Typography>
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                </td>
                <td style={{ border: '1px solid black', width: '30%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-long-text' align="center">POSITION TITLE</Typography>
                        <Typography className='pds-fontsize-long-text' align="center">(Write in full/Do not abbreviate)</Typography>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', width: '30%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='pds-fontsize-8px' align="center">DEPARTMENT /AGENCY / OFFICE / COMPANY</Typography>
                        <Typography className='pds-fontsize-8px' align="center">(Write in full/Do not abbreviate)</Typography>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Typography className='pds-fontsize-8px' align="center">MONTHLY SALARY</Typography>
                </td>

                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className='pds-fontsize-8px' align="center">SALARY/JOB/PAY GRADE</Typography>
                            <Typography className='pds-fontsize-long-text2' align="center">(if applicable) & STEP (Format *00-0)/INCREMENT</Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align='center'>STATUS OF APPOINTMENT</Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                    <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align='center'>GOV'T SERVICE (Y/N)</Typography>
                </td>
            </tr>
            <tr>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '7%', height: '28px' }}>
                    <Typography className='pds-fontsize-8px' align="center">FROM</Typography>
                </td>
                <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '10%', height: '28px' }}>
                    <Typography className='pds-fontsize-8px' align="center">TO</Typography>
                </td>
            </tr>
            <>
                {workExp && workExp.map((item, index) => (
                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item?.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('work_experience', item)}>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{moment(item.datefrom).format('MM/DD/YYYY')}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center`} align="center"><b>{item.dateto === 'PRESENT' ? item.dateto : moment(new Date(item.dateto)).format('MM/DD/YYYY')}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center"><b>{item.positiontitle?.toUpperCase()}</b></Typography>

                            </Box>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center"><b>{item.agency?.toUpperCase()}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows" width="8%">
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{isNaN(item.salary) ? item?.salary : new Intl.NumberFormat('PHP', { style: 'currency', currency: 'PHP' }).format(item?.salary)}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.salgrade}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className={`pds-print-rows-p ${item.status?.length > 10 ? 'pds-fontsize-6px' : 'pds-fontsize-long-text4'}  pds-print-no-pl-m pds-print-pl pds-print-rows-p-center`} align="center"><b>{item.status?.toUpperCase()}</b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }} className="pds-print-work-rows">
                            <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.govt === 1 ? 'Y' : 'N'}</b></Typography>
                        </td>
                    </tr>
                ))}
            </>
            <>
                {defaultVals && Array.from(Array(Number(28 - workExp.length))).map((item, index) => (
                    <>
                        {workExp.length === 0 && index === 0 ? (
                            <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                <td style={{ border: '1px solid black', height: '28px' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>

                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>

                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box>
                                            <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>

                                        </Box>
                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b>N/A</b></Typography>
                                </td>
                            </tr>
                        ) : (
                            <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                <td style={{ border: '1px solid black', height: '28px' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box>
                                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                                        </Box>
                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                                </td>
                            </tr>
                        )}
                    </>

                ))}

                {!defaultVals && Array.from(Array(Number(37 - workExp.length))).map((item, index) => (
                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                        <td style={{ border: '1px solid black', height: '28px' }}>
                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                            </Box>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                            </Box>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box>
                                    <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>

                                </Box>
                            </Box>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </td>
                        <td style={{ border: '1px solid black' }}>
                            <Typography className='pds-fontsize-8px' align="center"><b></b></Typography>
                        </td>
                    </tr>
                ))}
            </>
        </>

    )
}

export default React.memo(WorkExp)