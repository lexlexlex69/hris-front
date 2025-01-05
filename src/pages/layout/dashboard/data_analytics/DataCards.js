import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import Odometer from 'react-odometerjs';
import Skeleton from '@mui/material/Skeleton'

function DataCards(props) {
    return (
        <Card raised sx={{ display: 'flex', flexDirection: 'column', minWidth: '15rem',borderRadius:'2rem' }}>
            <Box sx={{ display: 'flex', p: 1,flexDirection:'column',alignItems:'center' }}>
            <Box sx={{ width: '100%' }}>
                    <Typography sx={{ color: 'primary.main', textAlign: 'center' }}><b>{props.title}</b></Typography>
                </Box>
                <Box>
                {props.icons}
                </Box>
              
            </Box>
            <Box sx={{ bgcolor: 'primary.main', p: 1, display: 'flex', justifyContent: 'space-around' }}>
                {props.slices === 1 ? (
                    <>
                        <Typography variant="h4" sx={{ textAlign: 'center', color: 'background.paper',width:'100%' }}><b><Odometer value={props.value} format="" /></b></Typography>
                    </>
                ) : props.slices === 2 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Typography variant="h4" sx={{ textAlign: 'center', color: 'background.paper' }}><b><Odometer value={props.value1} format="(ddd),dd" /></b></Typography> |
                        <Typography variant="h4" sx={{ textAlign: 'center', color: 'background.paper' }}><b><Odometer value={props.value2} format="(ddd),dd" /></b></Typography>
                    </Box>
                ) : null}
            </Box>
        </Card>
    )
}

export default DataCards