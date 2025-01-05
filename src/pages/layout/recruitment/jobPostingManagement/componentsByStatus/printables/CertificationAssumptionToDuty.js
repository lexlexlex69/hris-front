import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BL from '../../../../../../assets/img/bl.svg'



const CertificationAssumptionToDuty = ({ appointed, catd }) => {
    console.log('catdData', catd)
    return (
        <Box sx={{ padding: '30px 20px 10px 20px', width: '100%' }}>
            <Box>
                <Box>
                    <Typography variant="body2" color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>CS Form No. 4</Typography>
                    <Typography variant="body2" color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>Revised 2018</Typography>
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
                <Box sx={{ mt: '30px' }}>
                    <Typography variant="body1" color="initial" align='center' sx={{ letterSpacing: 3 }}><b>CERTIFICATION OF ASSUMPTION TO DUTY</b></Typography>
                </Box>
                <Box sx={{ mt: '30px' }}>
                    <Typography variant="body1" color="initial" sx={{ lineHeight: 3 }}>
                        This is to certify that Mr./Ms. <u><b>{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}</b></u> has assumed the duties and responsibilities as <u><b>{catd?.job_vacancy_info?.position_name?.toUpperCase()}</b></u> of <u><b>{catd?.job_vacancy_info?.dept_title?.toUpperCase()}</b></u> effective <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.</u>
                    </Typography>
                </Box>
                <Box sx={{ mt: '10px' }}>
                    <Typography variant="body1" color="initial" sx={{ lineHeight: 3 }}>This certification is issued in connection with the issuance of the appointment of Mr./Ms. GIL as <u><b>{catd?.job_vacancy_info?.position_name?.toUpperCase()}</b></u>
                    </Typography>
                </Box>
                <Box sx={{ mt: '30px' }}>
                    <Typography variant="body1" color="initial" sx={{ lineHeight: 3, textIndent: '50px' }}>Done this <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> day of <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> in <u>Butuan City.</u>
                    </Typography>
                </Box>
                <Box sx={{ mt: '10px' }} display="flex">
                    <Box sx={{ width: '50%' }}>

                    </Box>
                    <Box sx={{ width: '50%', mb: '20px' }}>
                        <Typography variant="body1" align='center' sx={{ mt: '80px' }} color="initial">
                            <b>{catd?.office_head?.office_division_assign?.toUpperCase()}</b>
                        </Typography>
                        <Typography variant="body1" align='center' color="initial">
                            {catd?.office_head?.position?.toUpperCase()}
                        </Typography>
                        <Typography variant="body1" align='center' color="initial">
                            {catd?.office_head?.office_division_name?.toUpperCase()}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: '20px' }} display="flex">
                    <Box sx={{ width: '50%' }}>
                        <Typography variant="body1" color="initial">Date: <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></Typography>
                        <Typography variant="body1" color="initial" sx={{ mt: '30px' }}>Attested by:</Typography>
                        <Box sx={{ mt: '10px' }}>
                            <Typography variant="body1" align='center' color="initial">  <b>{catd?.hr?.office_division_assign?.toUpperCase()}</b></Typography>
                            <Typography variant="body1" align='center' color="initial"> {catd?.hr?.office_division_name?.toUpperCase()}</Typography>
                            <Typography variant="body1" align='center' color="initial">(City Human Resource Management Officer)</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: '50%', mb: '80px' }}>

                    </Box>
                </Box>
                <Box sx={{ mt: '20px' }} display="flex">
                    <Box display="flex" sx={{ width: '50%' }}>
                        <Box>
                            <Typography variant="body1" align='left' color="initial" sx={{ lineHeight: 1 }}>201 file</Typography>
                            <Typography variant="body1" align='left' color="initial" sx={{ lineHeight: 1 }}>Admin</Typography>
                            <Typography variant="body1" align='left' color="initial" sx={{ lineHeight: 1 }}>COA</Typography>
                            <Typography variant="body1" align='left' color="initial" sx={{ lineHeight: 1 }}>CSC</Typography>
                        </Box>
                    </Box>
                    <Box display="flex" sx={{ width: '50%', mb: '20px', justifyContent: 'flex-end' }}>
                        <Box sx={{ mr: '30px', border: '1px solid black', p: '10px 24px' }}>
                            <Typography variant="body1" align='left' color="initial">For submission to CSCFO</Typography>
                            <Typography variant="body1" align='left' color="initial">within 30 days from the</Typography>
                            <Typography variant="body1" align='left' color="initial">date of assumption of the</Typography>
                            <Typography variant="body1" align='left' color="initial">appointee</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(CertificationAssumptionToDuty);