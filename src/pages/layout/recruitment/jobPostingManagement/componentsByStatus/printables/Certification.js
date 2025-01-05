import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BL from '../../../../../../assets/img/bl.svg'
import { NumToWord, commaSeparatedBill } from '../Controller'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

const Certification = ({ appointed, certification }) => {

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

    return (
        <Box sx={{ padding: '30px 20px 10px 20px' }}>
            <ThemeProvider theme={theme} >
                <Box sx={{ border: 'groove 10px #BEBEBE', p: '20px',height:'500px' }}>
                    <Box display="flex" sx={{ justifyContent: 'center' }}>
                        <Box>
                            <img src={BL} width="60" alt="butuan logo"></img>
                        </Box>
                        <Box display="flex" sx={{ flexDirection: 'column' }}>
                            <Typography fontSize={'12px'} align='center' color="initial" sx={{ ml: '20px' }} className="text-old-english">Republic of the Philippines</Typography>
                            <Typography fontSize={'16px'} align='center' color="initial" sx={{ ml: '20px', letterSpacing: 2 }} className="text-serif"><b>OFFICE OF THE {certification?.job_vacancy_info?.dept_title}</b></Typography>
                            <Typography fontSize={'12px'} align='center' color="initial" sx={{ ml: '20px' }} className="text-old-english">Butuan City</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'16px'} align="center" color="initial" sx={{ letterSpacing: 3 }} className="text-serif"><b>CERTIFICATION</b></Typography>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'14px'} align="left" color="initial" sx={{ letterSpacing: 2 }} className="text-serif">TO WHOM IT MAY CONCERN</Typography>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'14px'} color="initial" align='justify' sx={{ lineHeight: 2 }}>
                            This is to certify that funds for the position <u><b>{certification?.job_vacancy_info?.position_name}</b></u> <u><b>SG {certification?.job_vacancy_info?.salary_grade}</b></u> with a Monthly Salary <u><b>{NumToWord(certification?.job_vacancy_info?.monthly_salary)} PESOS ({f.format(certification?.job_vacancy_info?.monthly_salary || 0)}) </b></u> is available.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: '40px', mb: '20px' }} display="flex">
                        <Box sx={{ width: '50%', mb: '80px' }}>

                        </Box>
                        <Box sx={{ width: '50%' }}>
                            <Box>
                                <Typography fontSize={'14px'} align='center' color="initial" className='text-serif'><b>{certification?.office_head?.office_division_assign?.toUpperCase()}</b></Typography>
                                <Typography fontSize={'14px'} align='center' color="initial">{certification?.office_head?.office_division_name}</Typography>
                                <Typography fontSize={'14px'} align='center' color="initial">(City Bugdet Officer)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ border: 'groove 10px #BEBEBE', p: '20px',height:'500px' }}>
                    <Box display="flex" sx={{ justifyContent: 'center' }}>
                        <Box>
                            <img src={BL} width="60" alt="butuan logo"></img>
                        </Box>
                        <Box display="flex" sx={{ flexDirection: 'column' }}>
                            <Typography fontSize={'12px'} align='center' color="initial" sx={{ ml: '20px' }} className="text-old-english">Republic of the Philippines</Typography>
                            <Typography fontSize={'16px'} align='center' color="initial" sx={{ ml: '20px', letterSpacing: 2 }} className="text-serif"><b>OFFICE OF THE {certification?.job_vacancy_info?.dept_title}</b></Typography>
                            <Typography fontSize={'12px'} align='center' color="initial" sx={{ ml: '20px' }} className="text-old-english">Butuan City</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'16px'} align="center" color="initial" sx={{ letterSpacing: 3 }} className="text-serif"><b>CERTIFICATION</b></Typography>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'14px'} align="left" color="initial" sx={{ letterSpacing: 2 }} className="text-serif">TO WHOM IT MAY CONCERN</Typography>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                        <Typography fontSize={'14px'} color="initial" sx={{ lineHeight: 3 }}>
                            This is to certify that the appointment of <u><b>&nbsp;&nbsp;&nbsp;{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}&nbsp;&nbsp;&nbsp;</b></u> is in accordance with the limitation provided for under Section 325 of RA 7160.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: '20px', mb: '20px' }} display="flex">
                        <Box sx={{ width: '50%', mb: '80px' }}>

                        </Box>
                        <Box sx={{ width: '50%' }}>
                            <Box>
                                <Typography variant="body1" align='center' color="initial" className='text-serif'><b>{certification?.mayor?.office_division_assign.toUpperCase()}</b></Typography>
                                <Typography variant="body1" align='center' color="initial">{certification?.mayor?.office_division_name}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};

export default Certification;