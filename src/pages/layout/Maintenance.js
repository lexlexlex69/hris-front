import React from 'react';
import { Box, Card, Grid, CardContent, CardActions, Container, Typography } from '@mui/material';
import Svg from '../../assets/img/bgdev.svg'
import { useTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



const Maintenance = () => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    return (
        <Grid container sx={{ height: '100vh', width: '100vw', background: 'linear-gradient(148deg, rgba(8,45,221,0.8799894957983193) 0%, rgba(63,198,29,0.6755077030812324) 55%, rgba(255,245,103,0.7819502801120448) 100%);' }}>
            <Grid item xs={12} md={12} sm={12} lg={12}>
                <Container maxWidth='lg' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                    <Card elevation={5} sx={{ height: '80%', width: '100%', borderRadius: '5%', bgcolor: 'rgba(255, 255, 255, .5)' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <img src={Svg} style={{ objectFit: 'contain', width: matches ? '80%' : '50%' }} />
                            </Box>
                            <ThemeProvider theme={theme}>
                                <Typography variant={matches ? 'h6' : 'h3'} sx={{ color: 'warning.main', textTransform: 'uppercase' }} gutterBottom fontWeight={700} align='center'>HRIS is undergoing maintenance.</Typography>
                                <Typography variant={matches ? 'h6' : 'h3'} sx={{ color: 'warning.main', textTransform: 'uppercase' }} fontWeight={400} align='center'>we'll be right back.</Typography>
                            </ThemeProvider>
                        </CardContent>
                    </Card>
                </Container>

            </Grid>
        </Grid>
    );
};

export default Maintenance;