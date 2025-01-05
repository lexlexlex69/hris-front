import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BL from '../../../../../../assets/img/bl.svg'







const AothOfOffice = ({appointed,oathOfOffice}) => {
    return (
        <Box sx={{ padding: '30px 100px 10px 100px' }}>
            <Box>
                <Box>
                    <Typography variant="body2" color="initial" sx={{ m: 0, ml: '20px', p: 0 }}>CS Form No. 32</Typography>
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
                <Box  sx={{ mt: '30px' }}>
                    <Typography variant="body1" align="center" color="initial" sx={{ letterSpacing: 3 }}><b>OATH OF OFFICE</b></Typography>
                </Box>
                <Box  sx={{ mt: '30px' }}>
                    <Typography variant="body1" align="justify" color="initial">I, <u><b>{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}</b></u> of <u><b>{oathOfOffice?.address?.padStreet.toUpperCase() + ', ' + oathOfOffice?.address?.padBrgy.toUpperCase() + ', ' + oathOfOffice?.address?.padCity.toUpperCase() + ', ' + oathOfOffice?.address?.padProvince.toUpperCase()}</b></u> having been appointed to the position of <u><b>{oathOfOffice?.job_vacancy_info?.position_name} </b></u> hereby solemly swear, that I will faithfully discharge
                        to the best of my ability, the duties of my present position and of all others that I may hereafter hold under the Republic of the Philippines; that I will bear true faith and allegiance to the same; that I will obey
                        the laws,legal orders, and decrees promulgated by the duly constitute authorities of the Republic of the Philippines; and taht I impose this obligation upon myself voluntarily, without mental reservation or purpose of evasion.
                    </Typography>
                    <Typography variant="body1" color="initial">SO HELP ME GOD</Typography>
                </Box>
                <Box display="flex" sx={{ mt: '30px' }}>
                    <Box width="50%"></Box>
                    <Box width="50%">
                        <Typography variant="body1" align="center" color="initial"><u><b>{appointed && appointed?.fname?.toUpperCase()} {appointed && appointed?.mname[0]?.toUpperCase()}. {appointed && appointed?.lname?.toUpperCase()}</b></u></Typography>
                        <Typography variant="body1" align="center" color="initial">(Signature over Printed Name of the Appointee)</Typography>
                    </Box>
                </Box>
                <Box display="flex" sx={{ mt: '30px' }}>
                    <Box width="100%">
                        <Typography variant="body1" color="initial">Government ID &nbsp;: {oathOfOffice?.govid?.gov_id}</Typography>
                        <Typography variant="body1" color="initial">ID Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {oathOfOffice?.govid?.id_no}</Typography>
                        <Typography variant="body1" color="initial">Date Issued &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {oathOfOffice?.govid?.date_place_issuance}</Typography>
                    </Box>
                </Box>
                <Box sx={{ height: '2px', width: '100%', borderTopStyle: 'double', pt: 2, mt: '30px' }} />
                <Box sx={{ mt: '30px' }}>
                    <Typography variant="body1" color="initial">Subscribe and sworn to before me this <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>

                        day of <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>, 2022 in Butuan City, Philippines.</Typography>
                </Box>
                <Box display="flex" sx={{ mt: '30px' }}>
                    <Box width="50%"></Box>
                    <Box width="50%">
                        <Typography variant="body1" align="center" color="initial"><u><b>{oathOfOffice?.mayor?.office_division_assign?.toUpperCase()}</b></u></Typography>
                        <Typography variant="body1" align="center" color="initial">{oathOfOffice?.mayor?.office_division_name}</Typography>
                        <Typography variant="body1" align="center" color="initial">(Signature over Printed Name</Typography>
                        <Typography variant="body1" align="center" color="initial">of Person Administering the Oath)</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AothOfOffice;