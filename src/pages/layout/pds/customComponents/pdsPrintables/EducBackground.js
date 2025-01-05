import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { handleViewFile } from '../../customFunctions/CustomFunctions';
import { useContext } from 'react';
import { AddToPreferencesContext } from './AddToPreferencesContext';

function EducBackground({ education, defaultVals }) {
    const { toggleModal } = useContext(AddToPreferencesContext)
    const [iterate, setIterate] = useState(0)
    const elem = education ? education?.filter(item => item?.elevel?.toUpperCase() === 'ELEMENTARY') : []
    const secon = education ? education?.filter(item => item?.elevel?.toUpperCase() === 'SECONDARY') : []
    const coll = education ? education?.filter(item => item?.elevel?.toUpperCase() === 'COLLEGE') : []
    const voca = education ? education?.filter(item => item?.elevel?.toUpperCase() === 'VOCATIONAL/TRADE COURSE') : []
    const gradStad = education ? education?.filter(item => item?.elevel?.toUpperCase() === 'GRADUATE STUDIES') : []

    return (
        <React.Fragment>
            <React.Fragment>
                <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>III. EDUCATIONAL BACKGROUND</td>
                </tr>
                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                    <td style={{ border: '1px solid black', width: '10%', backgroundColor: '#eaeaea' }} rowSpan={2}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px'>26.</Typography>
                            <Typography className='pds-fontsize-8px'>LEVEL</Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '20%' }} rowSpan={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">NAME OF SCHOOL</Typography>
                            <Typography className='pds-fontsize-8px' align="center">(Write in full)</Typography>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align="center">BASIC EDUCATION/DEGREE/CORUSE</Typography>
                            <Typography className='pds-fontsize-8px' align="center">(Write in full)</Typography>
                        </Box>
                    </td>
                    <td colSpan={2} style={{ backgroundColor: '#eaeaea' }}>
                        <Typography className='pds-fontsize-8px' align='center'>PERIOD OF ATTENDANCE</Typography>
                    </td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box>
                                <Typography className='pds-fontsize-8px' align='center'>HIGHEST LEVEL/UNITS EARNED</Typography>
                                <Typography className='pds-fontsize-8px' align='center'>(if not graduated)</Typography>
                            </Box>
                        </Box>
                    </td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} rowSpan={2} >
                        <Typography sx={{ mr: 1 }} className='pds-fontsize-8px' align='center'>YEAR GRADUATED</Typography>
                    </td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea', width: '15%' }} rowSpan={2}>
                        <Typography sx={{ mr: 1 }} className='pds-fontsize-long-text' align='center'>SCHOLARSHIP/ACADEMIC HONORS RECEIVED</Typography>
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} className='pds-fontsize-8px' align='center'>FROM</td>
                    <td style={{ border: '1px solid black', backgroundColor: '#eaeaea' }} className='pds-fontsize-8px' align='center'>TO</td>
                </tr>
                {defaultVals ? (
                    <>
                        {elem && elem.length > 0 ? (
                            <>
                                {elem.map((item, index) => (
                                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.degreecourse?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>{item.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.honor?.length > 20 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} align="center"><b>{item.honor?.length > 120 ? <>{item.honor.slice(0, 120)}... </> : item.honor?.toUpperCase()}</b></Typography>
                                            {/* <Typography className='pds-fontsize-10px' align='center'><b>{item.honors ? item.honors.toUpperCase() : 'N/A'}</b></Typography> */}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                    <td style={{ border: '1px solid black', height: '29px' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>ELEMENTARY</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </Box>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </>
                        )}

                        {secon && secon.length > 0 ? (
                            <>
                                {secon.map((item, index) => (
                                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.degreecourse?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>{item.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.honor?.length > 20 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} align="center"><b>{item.honor?.length > 120 ? <>{item.honor.slice(0, 120)}... </> : item.honor?.toUpperCase()}</b></Typography>

                                            {/* <Typography className='pds-fontsize-10px' align='center'><b>{item.honors ? item.honors.toUpperCase() : 'N/A'}</b></Typography> */}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                    <td style={{ border: '1px solid black', height: '29px' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>SECONDARY</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </Box>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </>
                        )}

                        {voca && voca.length > 0 ? (
                            <>
                                {voca.map((item, index) => (
                                    <tr key={index} style={{ maxHeight: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className={'pds-fontsize-long-text2'} align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-no-pl-m ' : 'pds-fontsize-long-text'} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.degreecourse?.length > 30 ? 'pds-fontsize-long-text2 pds-print-no-pl-m ' : 'pds-fontsize-long-text'} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>{item.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.honor?.length > 20 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} align="center"><b>{item.honor?.length > 120 ? <>{item.honor.slice(0, 120)}... </> : item.honor?.toUpperCase()}</b></Typography>

                                            {/* <Typography className='pds-fontsize-10px' align='center'><b>{item.honors ? item.honors.toUpperCase() : 'N/A'}</b></Typography> */}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                    <td style={{ border: '1px solid black', height: '29px' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>VOCATIONAL/TRADE COURSE</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </Box>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </>
                        )}

                        {coll && coll.length > 0 ? (
                            <>
                                {coll.map((item, index) => (
                                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-no-pl-m ' : 'pds-fontsize-long-text pds-print-no-pl-m'} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.degreecourse?.length > 30 ? 'pds-fontsize-long-text2 pds-print-no-pl-m ' : 'pds-fontsize-long-text pds-print-no-pl-m'} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>{item.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.honor?.length > 20 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} align="center"><b>{item.honor?.length > 120 ? <>{item.honor.slice(0, 120)}... </> : item.honor?.toUpperCase()}</b></Typography>

                                            {/* <Typography className='pds-fontsize-10px' align='center'><b>{item.honors ? item.honors.toUpperCase() : 'N/A'}</b></Typography> */}
                                        </td>
                                    </tr>
                                ))}
                                {Array.from(Array(3 - coll.length)).map((item, index) => (
                                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} >
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>COLLEGE</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </td>
                                    </tr>)
                                )}
                            </>
                        ) : (
                            <>
                                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                    <td style={{ border: '1px solid black', height: '29px' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>COLLEGE</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-8px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </Box>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </>
                        )}

                        {gradStad && gradStad.length > 0 ? (
                            <>
                                {gradStad.map((item, index) => (
                                    <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                        <td style={{ border: '1px solid black', height: '29px' }}>
                                            <Typography className='pds-fontsize-long-text2' align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.nschool?.length > 30 ? 'pds-fontsize-long-text2 pds-print-pl ' : 'pds-fontsize-long-text'} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography className='pds-fontsize-10px' align='center'><b>{item?.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                            </Box>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className={item.honor?.length > 20 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} align="center"><b>{item.honor?.length > 120 ? <>{item.honor?.slice(0, 120)}... </> : item.honor?.toUpperCase()}</b></Typography>

                                            {/* <Typography className='pds-fontsize-10px' align='center'><b>{item.honors ? item.honors.toUpperCase() : 'N/A'}</b></Typography> */}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                    <td style={{ border: '1px solid black', height: '29px' }}>
                                        <Typography className='pds-fontsize-long-text2' align='center'><b>GRADUATE STUDIES</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-long-text' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align="center"><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                        </Box>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                    <td style={{ border: '1px solid black' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b>N/A</b></Typography>
                                    </td>
                                </tr>
                            </>
                        )}

                    </>
                ) : (
                    <>
                        {education && education.map((item, index) => (
                            <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }} className={item.file_path ? "pds-evaluate-profile" : "pds-evaluate-profile-nofile"} onClick={() => toggleModal('education', item)}>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center`} align='center'><b>{item.elevel?.toUpperCase()}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align='center'><b>{item.nschool?.toUpperCase()}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align='center'><b>{item.degreecourse?.toUpperCase()}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.datefrom ? item.datefrom : 'N/A'}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align="center"><b>{item.dateto ? item.dateto : 'N/A'}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align='center'><b>{item.gradelevel ? item.gradelevel?.toUpperCase() : 'N/A'}</b></Typography>
                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className='pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl pds-print-rows-p-center' align='center'><b>{item.yeargrad ? item.yeargrad : 'N/A'}</b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }} className="pds-print-educ-rows">
                                    <Typography className={`pds-print-rows-p pds-fontsize-long-text4 pds-print-no-pl-m pds-print-pl`} align="center"><b>{item.honor?.toUpperCase()}</b></Typography>
                                </td>
                            </tr>
                        ))}
                        {education && Array.from(Array(Number(38 - education.length))).map((item, index) => (
                            <tr key={index} style={{ height: '20px', fontSize: '12px', border: '1px solid black' }}>
                                <td style={{ border: '1px solid black', height: '28px' }}>
                                    <Typography className='pds-fontsize-10px' align='center'><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-8px' align='center'><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-long-text' align='center'><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-10px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-10px' align="center"><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography className='pds-fontsize-10px' align='center'><b></b></Typography>
                                    </Box>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-10px' align='center'><b></b></Typography>
                                </td>
                                <td style={{ border: '1px solid black' }}>
                                    <Typography className='pds-fontsize-10px' align='center'><b></b></Typography>
                                </td>
                            </tr>
                        ))}
                    </>
                )}


            </React.Fragment>

        </React.Fragment>
    )
}

export default React.memo(EducBackground)