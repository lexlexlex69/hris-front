import React from 'react'
import { Grid, Box, Card, CardContent, Typography, TextField } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
// odometer for dashboard cards figures animation
import Odometer from 'react-odometerjs';
import odometerCss from '../../../../../odometer.css'
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useSpring, animated } from 'react-spring'

const Cards = (props) => {
    const fader = useSpring({
        from: {opacity: 0,y:0},
        to: {opacity: 1,y:0},
        delay: 300* (props.delay+1)
    })
    return (
        <Grid item xs={6} sm={6} md={2} lg={2}>
            <animated.div
                style={{ ...fader }}
            >
                <Card sx={{ height: '100%', bgcolor: props.color }}>
                    <Box sx={{ height: '40%', px: 1, gap: 1 }} className="flex-row-space-between">
                        <Box>
                            <AnalyticsIcon sx={{ color: '#fff', fontSize: '2.5rem' }} />
                        </Box>
                        <Box className='flex-row-flex-start' sx={{ flex: 1 }}>
                            <Box>
                                <Typography>
                                    Sample Card
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <CardContent sx={{ bgcolor: '#fff', height: '100%' }}>
                        <Box className='flex-center-center' sx={{ pb: 3 }}>
                            <Typography variant='h4' sx={{ fontFamily: 'font-family: "Lato", sans-serif' }}>
                                <b><Odometer value={props.value} format="(.ddd),dd" /></b>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </animated.div>
        </Grid>
    )
}

export default Cards