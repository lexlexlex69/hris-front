import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BL from '../../../../../../assets/img/bl.svg'
import { NumToWord, commaSeparatedBill } from '../Controller'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';




const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })


const Form33A = ({ appointed, form33Adata, form33AdditionalData }) => {
    const theme = createTheme({
        typography: {
            fontFamily: [
                '"Times New Roman"',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });
    console.log(form33AdditionalData)
    return (
        <>
            <ThemeProvider theme={theme} >
                <Box sx={{ padding: '30px 20px 10px 20px' }}>
                    <Box display="flex" sx={{ justifyContent: 'flex-end', mb: '5px' }} >
                        <Typography fontSize={'12px'} color="initial" sx={{ border: '1px solid black', p: .5,fontWeight:600,letterSpacing:1 }}><i> For Regulated Agencies</i></Typography>
                    </Box>
                    <Box sx={{ border: 'double 6px #3a59a1', px: '15px' }}>
                        <Box>
                            <Typography fontSize={'12px'} color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>CS Form No. 33-A</Typography>
                            <Typography fontSize={'12px'} color="initial" sx={{ m: 0, ml: '20px', p: 0,mt:-1 }}>Revised 2018</Typography>
                        </Box>
                        <Box display="flex" sx={{ justifyContent: 'center' }}>
                            <Box>
                                <img src={BL} width="60" alt="butuan logo"></img>
                            </Box>
                            <Box display="flex" sx={{ flexDirection: 'column' }}>
                                <Typography variant="body2" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>Republic of the Philippines</Typography>
                                <Typography variant="body1" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0, letterSpacing: 3 }}><b>CITY GOVERMENT OF BUTUAN</b></Typography>
                                <Typography variant="body2" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>J.P. Rosales Avenue, Doongan, Butuan City</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mt: '20px' }}>
                            <Typography fontSize={'14px'} color="initial">Mr./Mrs./Ms. : <u><b>{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}</b></u> </Typography>
                            <Typography fontSize={'14px'}  color="initial" sx={{ mt: '20px', lineHeight: 2,textIndent:'50px' }}> You are hereby appointed as <u><b>{form33Adata?.job_vacancy_info?.position_name} (SG/JG/PG) </b></u> <u><b>{form33Adata?.job_vacancy_info?.salary_grade}</b></u>
                                under <u><b>{form33Adata?.job_vacancy_info?.emp_status === 'RE' ? 'PERMANENT' : form33Adata?.job_vacancy_info?.emp_status === 'TE' ? 'TEMPORARY' : form33Adata?.job_vacancy_info?.emp_status === 'PA' ? 'PRESIDENTIAL APPOINTEE' : form33Adata?.job_vacancy_info?.emp_status === 'CT' ? 'CO-TERMINOS' : ''}</b></u> status at the <u><b>{form33Adata?.job_vacancy_info?.dept_title}</b></u> with a compensastion rate of <u><b>{NumToWord(form33Adata?.job_vacancy_info?.monthly_salary)} PESOS ({f.format(form33Adata?.job_vacancy_info?.monthly_salary || 0)}) </b></u> pesos per month.
                            </Typography>
                        </Box>
                        <Box sx={{ mt: '20px' }}>
                            <Typography fontSize={'14px'} color="initial" sx={{ lineHeight: 3,textIndent:'50px' }}>The nature of this appointment is <u><b>{form33AdditionalData?.nature}</b></u> vice who <u> {form33AdditionalData?.vice}</u> with
                                Plantilla Item No. <u><b>{form33Adata?.job_vacancy_info?.plantilla_no}</b></u> Page <u><b>{form33AdditionalData?.page}.</b></u>
                            </Typography>
                        </Box>
                        <Box sx={{ mt: '20px' }}>
                            <Typography fontSize={'14px'} color="initial" sx={{ lineHeight: 3,textIndent:'50px' }}>This appointment shall take effect on the date of signing by the appointing officer/authority.
                            </Typography>
                        </Box>
                        <Box sx={{ mt: '80px' }} display="flex">
                            <Box sx={{ width: '50%' }}>

                            </Box>
                            <Box sx={{ width: '50%', mb: '80px' }}>
                                <Typography fontSize={'14px'} color="initial">
                                    Very truly yours,
                                </Typography>
                                <Typography fontSize={'14px'} align='center' sx={{ mt: '80px' }} color="initial">
                                    <b>{form33Adata?.appointing_info && form33Adata?.appointing_info?.mayor?.office_division_assign.toUpperCase()}</b>
                                </Typography>
                                <Typography fontSize={'14px'} align='center' color="initial">
                                    {form33Adata?.appointing_info && form33Adata?.appointing_info?.mayor?.position}
                                </Typography>
                                <Typography fontSize={'14px'} align='center' color="initial">
                                    Appointing Officer/Authority
                                </Typography>
                                <Typography fontSize={'14px'} align='center' color="initial" sx={{ mt: '50px', textDecoration: 'overline' }}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;Date of Signing&nbsp;&nbsp;&nbsp;&nbsp;
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                    <Box sx={{ border: 'double 6px #3a59a1', px: '15px' }}>
                        <Typography fontSize={'14px'} > <b>CSC ACTION: </b></Typography>
                        <Box sx={{ width: '30%' }}>
                            <Typography fontSize={'14px'} align='center' color="initial" sx={{ mt: '60px', textDecoration: 'overline', pl: '50px' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp; Authorized Official &nbsp;&nbsp;&nbsp;&nbsp;
                            </Typography>
                            <Typography fontSize={'14px'} align='center' color="initial" sx={{ mt: '20px', textDecoration: 'overline', pl: '50px' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp; Date &nbsp;&nbsp;&nbsp;&nbsp;
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* back page */}
                <Box sx={{border:'double 6px #3a59a1',m:'15px' }} className="force-break">
                    <Box sx={{ bgcolor: '#3a59a1', padding: '15px' }}>
                        <Box sx={{ bgcolor: '#fff', p: '10px 15px' }}>
                            <Typography fontSize={'14px'} color="initial" align="center" sx={{ mt: '10px',mb:'10px' }}><b>Certification</b></Typography>
                            <Typography fontSize={'14px'} color="initial" align="justify" sx={{ lineHeight: 1.5,textIndent:'50px' }}>This is to certify that all requirements and supporting papers pursuant to <b>CSC C No. 24, s. 2017, as amemded</b>, have been complied with, reviewed and found to be in order. </Typography>
                            <Typography fontSize={'14px'} color="initial" align="justify" sx={{ lineHeight: 1.5,textIndent:'50px' }}>The position was published at <u><b>CSC Job Portal</b></u> from <u><b>{moment(form33Adata?.job_vacancy_info?.posting_date).format('MMM DD, YYYY')} to {moment(form33Adata?.job_vacancy_info?.closing_date).format('MMM DD, YYYY')}</b></u>, and posted in <u><b>City Hall Bulletin</b></u> from <u><b>{moment(form33Adata?.job_vacancy_info?.posting_date).format('MMM DD, YYYY')} </b> </u> to <u><b> {moment(form33Adata?.job_vacancy_info?.closing_date).format('MMM DD, YYYY')}</b></u>, and posted
                                in consonance with RA No. 7041. The assessment by the Human Resource Merit Promotion and Selection board (HRMPSB) started on <u><b>{moment(form33Adata?.profile?.interview_date).format('MMM DD, YYYY')}.</b></u></Typography>
                            <Box display="flex">
                                <Box sx={{ width: '50%' }}>

                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <Typography fontSize={'14px'} align='center' sx={{ mt: '40px' }} color="initial">
                                        <b>{form33Adata?.appointing_info?.hr?.office_division_assign?.toUpperCase()}</b>
                                    </Typography>
                                    <Typography fontSize={'14px'} align='center' color="initial">
                                        {form33Adata?.appointing_info?.hr?.position}
                                    </Typography>
                                    <Typography fontSize={'14px'} color="initial" align='center'>(City Human Resouce Management Officer)</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ bgcolor: '#fff', p: '5px 10px', mt: '30px' }}>
                            <Typography fontSize={'14px'} color="initial" align="center" sx={{ mt: '10px',mb:'10px' }}><b>Certification</b></Typography>
                            <Typography fontSize={'14px'} color="initial" align="justify" sx={{ lineHeight: 1.5,textIndent:'50px' }}>This is to certify that the appointee has been screened and found qualified by the majority of the HRMPSB/Placement Commitee during the deliberation held on <u><b>{moment(form33Adata?.profile?.interview_date).format('MMM DD, YYYY')}.</b></u> </Typography>
                            <Box display="flex">
                                <Box sx={{ width: '50%' }}>

                                </Box>
                                <Box sx={{ width: '50%', mt: '50px' }}>
                                    <Typography fontSize={'14px'} align='center' sx={{ mt: '10px',mb:'10px' }} color="initial">
                                        <b>{form33Adata?.appointing_info?.mayor?.office_division_assign.toUpperCase()}</b>
                                    </Typography>
                                    <Typography fontSize={'14px'} align='center' color="initial">
                                        {form33Adata?.appointing_info?.mayor?.position}
                                    </Typography>
                                    <Typography fontSize={'14px'} color="initial" align='center'>Chairperson, HRMPSB/Placement Committee</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ bgcolor: '#fff', p: '5px 10px', mt: '30px' }}>
                            <Typography fontSize={'14px'} color="initial" align="center" sx={{ mt: '10px',mb:'10px' }}><b>CSC Notation</b></Typography>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px' }}></Box>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px' }}></Box>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px' }}></Box>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px' }}></Box>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px' }}></Box>
                            <Box sx={{ height: '2px', width: '100%', bgcolor: 'black', mt: '15px', mb: '15px' }}></Box>
                        </Box>
                        <Box sx={{ bgcolor: '#fff', p: '20px', mt: '30px' }}>
                            <Typography fontSize={'14px'} color="initial" align="justify" sx={{ lineHeight: 2 }}>ANY ERASURE OR ALTERNATION ON THE CSC ACTION SHALL NULLIFY OR INVALIDATE THIS APPOINTMENT EXPCEPT IF THE ALTERNATION WAS AUTHORIZED BY COMMISSION.</Typography>
                        </Box>
                        <Box display='flex' sx={{ bgcolor: '#fff', mt: '30px' }}>
                            <Box display="flex" width="50%" sx={{ borderRight: '1px solid black', p: '10px', alignItems: 'center' }}>
                                <Box>
                                    <Typography fontSize={'14px'} color="initial">Original Copy - for the Appointee</Typography>
                                    <Typography fontSize={'14px'} color="initial">Original Copy - for the Civil Service Commission</Typography>
                                    <Typography fontSize={'14px'} color="initial">Original Copy - for the Agency</Typography>
                                </Box>
                            </Box>
                            <Box width="50%" sx={{ p: '10px',pt:'5px' }}>
                                <Typography fontSize={'14px'} align="center" color="initial"><b>Acknowledgement</b></Typography>
                                <Typography fontSize={'12px'} color="initial">Received original/Photocopy of appointment on <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></Typography>
                                <Typography fontSize={'14px'} align="center" color="initial" sx={{ mt: '10px' }}><u><b>{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}</b></u></Typography>
                                <Typography fontSize={'14px'} align="center" color="initial">Appointee</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
};

export default React.memo(Form33A);