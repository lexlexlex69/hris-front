import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BL from '../../../../../../../assets/img/bl.png'


const FormsHeader1 = () => {
    return (
        <div>
            <Box display="flex" sx={{ width: '100%',mt:'10px' }} >
                <Box width='20%' display='flex' alignItems='center' >
                    <img src={BL} width="80" alt="butuan logo" style={{margin:'auto'}}></img>
                </Box>
                <Box display="flex" sx={{ flexDirection: 'column', width: '60%',justifyContent:'center' }}>
                    <Typography variant="body2" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0,lineHeight:1.2 }}>Republic of the Philippines</Typography>
                    <Typography variant="body1" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0, letterSpacing: 3,lineHeight:1.2 }}><b>CITY GOVERMENT OF BUTUAN</b></Typography>
                    <Typography variant="body2" align='center' color="initial" sx={{ m: 0, ml: '20px', p: 0,lineHeight:1.2 }}>J.P. Rosales Avenue, Doongan, Butuan City</Typography>
                </Box>
                <Box width='20%'  display='flex' justifyContent='center'>
                    <img src={BL} width="80" alt="butuan logo"></img>
                </Box>
            </Box>
            <Box height='5px' mt={.5} bgcolor='#154172'></Box>
            <Box height='8px' sx={{background:'linear-gradient(90deg, rgba(10,82,127,1) 0%, rgba(34,110,195,1) 35%, rgba(23,156,216,1) 100%)'}}></Box>
        </div>
    );
};

export default FormsHeader1;