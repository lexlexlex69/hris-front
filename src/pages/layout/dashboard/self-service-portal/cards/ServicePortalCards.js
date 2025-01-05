import React from 'react'
import { Grid, Box, Card, CardContent, Typography, TextField, Button, Skeleton } from '@mui/material'
import { blue, green, red,yellow,purple } from '@mui/material/colors'
// odometer for dashboard cards figures animation
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Odometer from 'react-odometerjs';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import odometerCss from '../../../../../odometer.css'
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useSpring, animated } from 'react-spring'
import Fade from '@mui/material/Fade'
import {
    useNavigate
} from "react-router-dom";
function ServicePortalCards(props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // navigate
    const navigate = useNavigate()
    return (
        <Button fullWidth onClick = {()=> navigate(props.uri)}>
            <Card raised sx={{ width: '100%', height: '10rem', width: '100%', flexBasis: '100%', flexWrap: 'flex', bgcolor: props.bgcolor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { boxShadow: `5px 5px 10px ${props.darkcolor}` } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        {props.icon ? props.icon : (
                            <BrokenImageIcon sx={{fontSize:80,color:'#5c5c5c'}} />
                        )}
                    </Box>
                    <Box sx={{ flex: 1,width:'100%' }}>
                        <Typography variant='h6' sx={{ fontFamily: 'font-family: "Lato", sans-serif', textAlign: 'center', color: '#fff', fontSize: matches ? '1rem' : '1rem'}}>
                            {props.title ? (<Fade in><div>{props.title}</div></Fade>) : (
                            <Fade in>
                                <div>
                                <Skeleton variant="text" height="1rem" width="100%" />
                                <Skeleton variant="text" height="1rem" width="100%" />
                                <Skeleton variant="text" height="1rem" width="100%" />
                                </div>
                            </Fade>)}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Button>
    )
}

export default ServicePortalCards