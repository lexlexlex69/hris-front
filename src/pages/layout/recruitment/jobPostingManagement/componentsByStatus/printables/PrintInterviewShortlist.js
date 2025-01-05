import React from 'react';
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import blogo from '../../../../../../assets/img/bl.png'
import bb from '../../../../../../assets/img/bbb.png'
import moment from 'moment';




const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

const PrintInterviewShortList = ({ data, positionInfo, examDates }) => {
    return (
        <Box sx={{ mt: '40px' }}>

            <Box display="" sx={{ width: '90%', m: 'auto', mt: '20px' }}>
                <Box id="first-page" className='force-break' sx={{ positon: 'relative' }}>
                    <Box id="cgb-header" display="flex" width="100%" m="auto">
                        <Box width='10%' display='flex' justifyContent='center'>
                            <img src={blogo} width="70" height="70" />
                        </Box>
                        <Box width='90%' sx={{ borderBottom: '2px solid green' }}>
                            <Typography variant="body1" color="initial">Republic of the Philippines</Typography>
                            <Typography variant="body1" color="initial">OFFICE OF THE CITY MAYOR</Typography>
                            <Typography variant="body1" color="initial">City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City</Typography>
                        </Box>
                    </Box>
                    <Box mt={2}>
                        <Box width='100%'>
                            <Typography variant="body1" color="initial" textAlign='right'>{moment(new Date(), 'DD MMM YYYY').format('DD MMM YYYY')}</Typography>
                        </Box>
                        <Typography variant="body1" color="initial"><b>Dir. MESHACH D. DINHAYAN</b></Typography>
                        <Typography variant="body1" color="initial">Director II</Typography>
                        <Typography variant="body1" color="initial">Civil Service Commission (CSC)</Typography>
                        <Typography variant="body1" color="initial">Brgy. Abilan, Buenavista</Typography>
                        <Typography variant="body1" color="initial">Agusan del Norte</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1" color="initial" align='center'><u>SELECTION LINE-UP</u></Typography>
                        <Typography variant="body1" color="initial" mt={1}>DEAR <b>Dir. Dinhayan</b>,</Typography>
                        <Typography variant="body1" color="initial" sx={{ textIndent: '30px', mt: 2 }}>This is to respectfully submit to the CSC Agusan del Norte Provincial Field Office, the qualified applicants who have met the Minimum Qualification Standard and passed the written examination (WE) conducted on {examDates} for the position of:</Typography>
                    </Box>
                    <Box mt={4}>
                        <Typography variant="body1" color="initial"><b>1. <u>{positionInfo?.position_title}</u></b></Typography>
                        <Typography variant="body1" color="initial">Office: {positionInfo?.dept_title}</Typography>
                        <Typography variant="body1" color="initial">Item No: {positionInfo?.plantilla_no}</Typography>
                        <Typography variant="body1" color="initial">Monthly Salary: SG {positionInfo?.plantilla_sg} ({f.format(positionInfo?.salary)})</Typography>
                        <Typography variant="body1" color="initial">Education: {positionInfo?.education}</Typography>
                        <Typography variant="body1" color="initial">Training: {positionInfo?.training}</Typography>
                        <Typography variant="body1" color="initial">Experience: {positionInfo?.experience}</Typography>
                        <Typography variant="body1" color="initial">Eligibility: {positionInfo?.eligibility}</Typography>
                    </Box>
                    <Box >
                        <img src={bb} width="150" style={{ position: 'absolute', bottom: 30 }} />
                    </Box>
                </Box>
                <TableContainer>
                    <Table aria-label="simple table" size='small' className="table-header-group-print" >
                        <TableHead >
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div>
                                        <Box id="cgb-header" display="flex" width="100%" m="auto">
                                            <Box width='10%' display='flex' justifyContent='center'>
                                                <img src={blogo} width="70" height="70" />
                                            </Box>
                                            <Box width='90%' sx={{ borderBottom: '2px solid green' }}>
                                                <Typography variant="body1" color="initial">Republic of the Philippines</Typography>
                                                <Typography variant="body1" color="initial">OFFICE OF THE CITY MAYOR</Typography>
                                                <Typography variant="body1" color="initial">City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" color="initial" align="left" mt={2}>
                                            Qualified Applicants
                                        </Typography>
                                    </div>
                                </TableCell>

                            </TableRow>
                            <TableRow sx={{ whiteSpace: 'nowrap' }}>
                                <TableCell align="center" rowSpan={2} sx={{ bgcolor: 'primary.dark', color: '#fff' }}>Name</TableCell>
                                <TableCell align="center" colSpan={5} sx={{ bgcolor: 'primary.dark', color: '#fff' }}>Actual Qualification</TableCell>
                            </TableRow>
                            <TableRow sx={{ whiteSpace: 'nowrap' }}>
                                <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>Education</TableCell>
                                <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>Trainings</TableCell>
                                <TableCell align="left" sx={{ bgcolor: 'primary.light' }} >Work experience</TableCell>
                                <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>Eligibility</TableCell>
                                <TableCell align="left" sx={{ bgcolor: 'primary.light' }}>Performance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" sx={{verticalAlign:'top'}}> <Typography sx={{ fontSize: '.6rem' }} color="initial">{item?.fname} {item?.mname} {item?.lname}</Typography></TableCell>
                                    <TableCell sx={{verticalAlign:'top'}}>
                                        <Table>
                                            <TableBody>
                                                {item?.preferences?.map((item2, index2) => (
                                                    <Box key={index2}>
                                                        {item2.pref_type === 'Education' && item2.title && (
                                                            <TableRow >
                                                                <TableCell sx={{ border: 'none' }}><Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Box>

                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{verticalAlign:'top'}}>
                                        <Table>
                                            <TableBody>
                                                {item?.preferences?.map((item2, index2) => (
                                                    <Box key={index2}>
                                                        {item2.pref_type === 'Trainings' && item2.title && (
                                                            <TableRow >
                                                                <TableCell sx={{ border: 'none' }}><Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Box>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{verticalAlign:'top'}}>
                                        <Table>
                                            <TableBody>
                                                {item?.preferences?.sort((a,b) => a?.datefrom ? new Date(a?.datefrom) < new Date(b?.datefrom) ? 1 : -1 : a)?.map((item2, index2) => (
                                                    <Box key={index2}>
                                                        {item2.pref_type === 'Experience' && item2.title && (
                                                            <TableRow >
                                                                <TableCell sx={{ border: 'none' }}><Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Box>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{verticalAlign:'top'}}>
                                        <Table>
                                            <TableBody>
                                                {item?.preferences?.map((item2, index2) => (
                                                    <Box key={index2}>
                                                        {item2.pref_type === 'Eligibility' && item2.title && (
                                                            <TableRow>
                                                                <TableCell sx={{ border: 'none' }}><Typography sx={{ fontSize: '.6rem' }} color="initial">{item2?.title}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Box>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Typography sx={{ fontSize: '.6rem' }} color="initial">{item?.performance}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default PrintInterviewShortList;