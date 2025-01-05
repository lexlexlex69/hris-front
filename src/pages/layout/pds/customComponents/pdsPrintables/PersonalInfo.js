import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from 'moment'

function PersonalInfo({ personalInfo, address }) {
    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>I. PERSONAL INFORMATION</td>
            </tr>
            <tr style={{ fontSize: '10px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', width: "10%", border: '1px solid black', width: '15%', backgroundColor: '#eaeaea' }} rowSpan={4}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            2.
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                            <Typography className="pds-fontsize-8px">SURNAME</Typography>
                            <Typography className="pds-fontsize-8px">FIRST NAME</Typography>
                            <Typography className="pds-fontsize-8px">MIDDL ENAME</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '10px', border: '1px solid black', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={6}>
                    <Typography className="pds-fontsize-10px"><b>{personalInfo.lname ? personalInfo?.lname?.toUpperCase() : 'N/A'}</b></Typography>
                </td>
            </tr>
            <tr style={{ fontSize: '10px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px' }} colSpan={4}>
                    <Typography className="pds-fontsize-10px"><b>{personalInfo.fname ? personalInfo?.fname?.toUpperCase() : 'N/A'}</b></Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} colSpan={2}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: '6px' }}>NAME EXTENSION (JR.,SR.)</Typography>
                        <Typography className="pds-fontsize-10px" sx={{ mt: -.2, mb: -0.5 }}><b>{personalInfo.extname ? personalInfo.extname.toUpperCase() : 'N/A'}</b></Typography>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={6}>
                    <Typography className="pds-fontsize-10px"><b>{personalInfo.mname ? personalInfo.mname?.toUpperCase() : 'N/A'}</b></Typography>
                </td>
            </tr>
            {/* date of birth */}
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            3.
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className="pds-fontsize-8px">
                                DATE OF BIRTH
                            </Typography>
                            <Typography className="pds-fontsize-8px" sx={{ marginTop: '-3px' }}>
                                (mm/dd/yyyy)
                            </Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Typography className="pds-fontsize-10px" align="left">
                        <b>{personalInfo.dob ? moment(personalInfo?.dob).format('MM/DD/YYYY') : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', borderRight: 'none', width: '20%', verticalAlign: 'top', backgroundColor: '#eaeaea' }} rowSpan={3} colSpan={1}>
                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'flex-end' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className="pds-fontsize-8px">
                                16
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography className="pds-fontsize-8px">
                                CITIZENSHIP
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3, gap: 1 }}>
                        <Typography className="pds-fontsize-8px" sx={{ textAlign: 'right' }}>
                            If holder of dual citizenship,
                        </Typography>
                        <Typography className="pds-fontsize-8px" sx={{ textAlign: 'right' }}>
                            please indicate the details.
                        </Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', width: '10%', backgroundColor: '#eaeaea' }} rowSpan={3}>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', verticalAlign: 'top' }} rowSpan={2} colSpan={3}>
                    <Box sx={{ display: 'flex', gap: 3, ml: 1, alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input type="checkbox" checked={personalInfo?.citizenship === 'FILIPINO' ? 'checked' : ''} style={{ accentColor: '#808080' }} />
                            <Typography className="pds-fontsize-10px">Filipino</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <input type="checkbox" checked={personalInfo?.dual_citizenship !== 'NONE' ? 'checked' : ''} style={{ accentColor: '#808080' }} />
                                <Typography className="pds-fontsize-10px">Dual Citizenship</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <input type="checkbox" checked={personalInfo?.dual_citizenship === 'BY BIRTH' ? 'checked' : ''} style={{ accentColor: '#808080' }} />
                                    <Typography className="pds-fontsize-10px">by birth</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <input type="checkbox" checked={personalInfo?.dual_citizenship === 'BY NATURALIZATION' ? 'checked' : ''} style={{ accentColor: '#808080' }} />
                                    <Typography className="pds-fontsize-10px">by naturalization</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ ml: 3 }}>
                                <Typography className="pds-fontsize-10px">Pls. indicate country</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className="pds-fontsize-8px">4.</Typography>
                        </Box>
                        <Box>
                            <Typography className="pds-fontsize-8px">PLACE OF BIRTH</Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Typography className={personalInfo.baddress?.length > 50 ? `pds-fontsize-long-text2` : `pds-fontsize-10px`} align="left"><b>{personalInfo.baddress?.length > 100 ? <>{personalInfo.baddress.slice(0, 100)} ... </> : personalInfo.baddress?.toUpperCase()}</b></Typography>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className="pds-fontsize-8px">5. </Typography>
                        </Box>
                        <Box>
                            <Typography className="pds-fontsize-8px">SEX </Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <input type="checkbox" checked={personalInfo.sex === 'MALE' ? true : false} style={{ accentColor: '#808080' }} />
                            <Typography className="pds-fontsize-10px"> Male</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <input type="checkbox" checked={personalInfo.sex === 'FEMALE' ? true : false} style={{ accentColor: '#808080' }} />
                            <Typography className="pds-fontsize-10px"> Female</Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                        </Box>
                        <Box>
                            <ArrowDropDownIcon />
                        </Box>
                    </Box>
                </td>
            </tr>
            {/* civil status */}
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className='pds-fontsize-8px'>6. </Typography>
                        </Box>
                        <Box>
                            <Typography className='pds-fontsize-8px'>CIVIL STATUS </Typography>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <input type="checkbox" checked={personalInfo.civilstatus === 'SINGLE' ? true : false} style={{ accentColor: '#808080' }} />
                                <Typography className='pds-fontsize-10px'>Single</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <input type="checkbox" checked={personalInfo.civilstatus === 'MARRIED' ? true : false} style={{ accentColor: '#808080' }} />
                                <Typography className='pds-fontsize-10px'>Married</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <input type="checkbox" checked={personalInfo.civilstatus === 'WIDOWED' ? true : false} style={{ accentColor: '#808080' }} />
                                <Typography className='pds-fontsize-10px'>Widowed</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <input type="checkbox" checked={personalInfo.civilstatus === 'SEPARATED' ? true : false} style={{ accentColor: '#808080' }} />
                                <Typography className='pds-fontsize-10px'>Separated</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                <input type="checkbox" checked={personalInfo.civilstatus === 'OTHERS' ? true : false} style={{ accentColor: '#808080' }} />
                                <Typography className='pds-fontsize-10px'>Other/s:</Typography>
                            </Box>

                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', width: '20%', verticalAlign: 'top', height: '100%', position: 'relative', backgroundColor: '#eaeaea' }} rowSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mr: 1 }}>
                                <Typography className='pds-fontsize-8px'>17. </Typography>
                            </Box>
                            <Box>
                                <Typography className='pds-fontsize-8px'>RESIDENTIAL ADDRESS </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 5, width: '100%' }}>
                        <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Zipcode</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ borderBottom: '1px solid black', width: '100%', height: '50%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.radUnit?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radUnit ? address.radUnit.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>House/Block/Lot No.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.radStreet?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radStreet ? address.radStreet.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Street</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: '50%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.radVillage?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radVillage ? address.radVillage.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Subdivision/Village</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.radBrgy?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radBrgy ? address.radBrgy.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Barangay</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }} >
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>7. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>HEIGHT</Typography>
                    </Box>
                </td>
                <td className='pds-fontsize-10px' style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }}><b>{personalInfo.height ? personalInfo.height : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Typography className={address.radCity?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radCity ? address.radCity.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>City/Municipality</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.radProvince?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.radProvince ? address.radProvince.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Province</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>8. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>WEIGHT</Typography>
                    </Box>
                </td>
                <td className='pds-fontsize-10px' style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }}><b>{personalInfo.weight ? personalInfo.weight : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Typography align='center' className='pds-fontsize-10px'><b>{address.radZip ? address.radZip : 'N/A'}</b></Typography>
                </td>
            </tr>
            {/* blood type */}
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>9. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>BLOOD TYPE</Typography>
                    </Box>
                </td>
                <td className='pds-fontsize-10px' style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }}><b>{personalInfo.bloodtype ? personalInfo.bloodtype : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', width: '20%', position: 'relative', verticalAlign: 'top', backgroundColor: '#eaeaea' }} rowSpan={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mr: 1 }}>
                                <Typography className='pds-fontsize-8px'>17. </Typography>
                            </Box>
                            <Box>
                                <Typography className='pds-fontsize-8px'>PERMANENT ADDRESS </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 5, width: '100%' }}>
                        <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Zipcode</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padUnit?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padUnit ? address.padUnit.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>House/Block/Lot No.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padStreet?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padStreet ? address.padStreet.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Street</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>10. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>GSIS ID NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }} className='pds-fontsize-10px' ><b>{personalInfo.gsisno ? personalInfo.gsisno?.toUpperCase() : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padVillage?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padVillage ? address.padVillage.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Subdivision/Village</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padBrgy?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padBrgy ? address.padBrgy.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Barangay</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>11. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>PAG-IBIG ID NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }} className='pds-fontsize-10px' ><b>{personalInfo.pag_ibig ? personalInfo.pag_ibig : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padCity?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padCity ? address.padCity.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>City/Municipality</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <Typography className={address.padProvince?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'center' }}><b>{address.padProvince ? address.padProvince.toUpperCase() : 'N/A'}</b></Typography>
                            <Typography className='pds-fontsize-8px' sx={{ textAlign: 'center' }}>Province</Typography>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>12. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>PHILHEALTH NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', textAlign: 'left' }} className='pds-fontsize-10px' ><b>{personalInfo.philhealth ? personalInfo.philhealth : 'N/A'}</b></td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Box sx={{ width: '100%' }}>
                        <Typography className='pds-fontsize-10px' sx={{ textAlign: 'center' }}><b>{address.padZip ? address.padZip : 'N/A'}</b></Typography>
                    </Box>
                </td>
            </tr>
            {/* sss */}
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>14. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>SSS NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>{personalInfo.sssno ? personalInfo.sssno : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>19. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>TELEPHONE NO..</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {personalInfo.telno ? personalInfo.telno?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>14. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>TIN NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>{personalInfo.tin ? personalInfo.tin : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>20. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>MOBILE NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Typography className="pds-fontsize-10px" sx={{ textAlign: 'left' }}>
                        <b>{personalInfo.cpno ? personalInfo.cpno : 'N/A'}</b>
                    </Typography>
                </td>
            </tr>
            <tr style={{ height: '20px', fontSize: '10px', border: '1px solid black' }} >
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>15. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>AGENCY EMPLOYEE NO.</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }}>
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {personalInfo.agency_employee_no ? 'N/A' : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', backgroundColor: '#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>21. </Typography>
                        <Typography className='pds-fontsize-8px' sx={{ mr: 1 }}>E-MAIL ADDRESS (if any)</Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {personalInfo.emailadd ? personalInfo.emailadd : 'N/A'}
                        </b>
                    </Typography>
                </td>
            </tr>
        </>
    )
}

export default React.memo(PersonalInfo)