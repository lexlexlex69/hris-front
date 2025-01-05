import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoFooter from '../../../.././assets/img/bbb.png'
import { Grid,Box, Typography} from '@mui/material';
import { blue } from '@mui/material/colors';

export default function FormFooter(props){
    const theme = createTheme({
        typography: {
            // fontFamily: 'cambria',
            fontSize:13,
        }
    });
    return(
        <ThemeProvider theme={theme}>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',mt:2}}>
                <Typography sx={{fontSize:props.font,lineHeight:1}}>
                    {props.version}
                    </Typography>
            
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center' ,borderBottom:'solid 5px '+blue[700],pb:1}}>
                <Box>
                    <Typography sx={{fontSize:props.font}}>Phone  : <span>{props.phone}</span></Typography>
                    <Typography sx={{fontSize:props.font}}>Email  : <span style={{color:blue[800]}}>{props.email}</span></Typography>
                    <Typography sx={{fontSize:props.font}}>Website: <span style={{color:blue[800]}}>{props.website}</span></Typography>
                </Box>
                <Box>
                    <img src={LogoFooter} height={50}/>
                </Box>
            </Grid>
        </ThemeProvider>

    )
}