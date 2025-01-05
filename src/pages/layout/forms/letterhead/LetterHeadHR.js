import { Grid, Typography,Box } from '@mui/material';
import React,{react} from 'react';
import Logo from '../../../.././assets/img/bl.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

export default function LetterHeadHR(props){
    const themeHeader = createTheme({
        typography: {
            fontFamily: 'gotham',
        }
    });
    return(
        <ThemeProvider theme={themeHeader}>
        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1,position:'relative'}}>
            <img src={Logo} width={110} height={110} style={{zIndex:1}}/>
            <Box sx={{width:'100%'}}>
                <Typography sx={{lineHeight:1.2,fontSize:14}}>
                Republic of the Philippines <br/>
                CITY GOVERNMENT OF BUTUAN <br/>
                City Human Resource Management Department <br/>
                City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City
                </Typography>
                <Box sx={{position:'relative',left:'-38px',top:'2px'}}>
                    <Box sx={{height:20,width:'100%',background:blue[500]}}>
                    </Box>
                    <Box sx={{height:8,width:'100%',background:blue[800]}}>
                    </Box>
                </Box>
            </Box>
        </Grid>
        </ThemeProvider>
    )
}