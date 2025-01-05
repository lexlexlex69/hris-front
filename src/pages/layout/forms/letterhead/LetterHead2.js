import { Grid, Typography,Box } from '@mui/material';
import React,{react} from 'react';
import Logo from '../../../.././assets/img/bl.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

export default function LetterHead2(props){
    const themeHeader = createTheme({
        typography: {
            fontFamily: 'gotham',
        }
    });
    return(
        <ThemeProvider theme={themeHeader}>
        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1,position:'relative'}}>
            <img src={Logo} width={90} height={90} style={{zIndex:1}}/>
            <Box sx={{width:'100%'}}>
                <Typography sx={{lineHeight:1.2,fontSize:props.fontSize,color:blue[900]}}>
                Republic of the Philippines <br/>
                <strong>GOVERNMENT OF BUTUAN </strong><br/>
                City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                </Typography>
                <Box sx={{position:'relative',left:'-32px',top:'2px'}}>
                    <Box sx={{height:5,width:'100%',background:blue[900]}}>
                    </Box>
                    <Box sx={{height:10,width:'100%',background:blue[400]}}>
                    </Box>
                </Box>
            </Box>
        </Grid>
        </ThemeProvider>
    )
}