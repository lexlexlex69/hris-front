import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoFooter from '../../../.././assets/img/bbb.png'
import { Grid,Box, Typography} from '@mui/material';
import { blue } from '@mui/material/colors';

export default function FormFooter2(props){
    const theme = createTheme({
        typography: {
            // fontFamily: 'cambria',
            fontSize:13,
        }
    });
    return(
        <ThemeProvider theme={theme}>
            
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center' ,borderBottom:'solid 5px '+blue[700],pb:1}}>
                <Box>
                    {
                        props.phone
                        ?
                        <Typography sx={{fontSize:props.font}}>Phone  : <span>{props.phone}</span></Typography>
                        :
                        ''
                    }
                    {
                        props.email
                        ?
                        <Typography sx={{fontSize:props.font}}>Email  : <span style={{color:blue[800]}}>{props.email}</span></Typography>
                        :
                        ''
                    }
                    {
                        props.website
                        ?
                        <Typography sx={{fontSize:props.font}}>Website: <span style={{color:blue[800]}}>{props.website}</span></Typography>
                        :
                        ''
                    }
                </Box>
                <Box>
                    <img src={LogoFooter} height={50}/>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Typography sx={{fontSize:props.font,lineHeight:1}}>
                            {props.version}
                            </Typography>
                    </Grid>
                </Box>
                
            </Grid>
            
        </ThemeProvider>

    )
}