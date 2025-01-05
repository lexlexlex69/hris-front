import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import Redirect from '../../../../assets/img/redirect.svg'
import Swal from 'sweetalert2'

import { blue, green, red, yellow, purple } from '@mui/material/colors'

import { getAnalytics } from './Controller'

import DataCards from './DataCards'

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import WcIcon from '@mui/icons-material/Wc';
import SearchIcon from '@mui/icons-material/Search';
import { Work } from '@mui/icons-material'

function DataAnalytics() {
    const navigate = useNavigate()
    const [dataAnalytics, setDataAnalytics] = useState('')
    const handleNavigate = () => {
        Swal.fire({
            title: 'Redirecting page . . . ',
            imageUrl: Redirect,
            imageWidth: 300,
            imageHeight: 100,
            imageAlt: 'Redirect Img',
        })
        Swal.showLoading()

        setTimeout(() => {
            navigate('data-analytics')
            Swal.close()
        }, 500)
    }
    useEffect(() => {
        getAnalytics(setDataAnalytics)
    }, [])
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ p: 2 }}><b>Data Analytics</b></Typography>
                <Box sx={{ p: 2 }}>
                    <Button variant='contained' sx={{ borderRadius: '2rem' }} startIcon={<SearchIcon />} onClick={handleNavigate}>view details</Button>
                </Box>
            </Box>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <DataCards title="OFFICES" value={dataAnalytics.total_offices} icons={<MeetingRoomIcon sx={{ color: 'primary.main', fontSize: '5rem' }} />} slices={1} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <DataCards title="TOTAL EMPLOYEES" value={dataAnalytics.total_employees} icons={<Work sx={{ color: 'primary.main', fontSize: '5rem' }} />} slices={1} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <DataCards title="TOTAL PERMANENT" value={dataAnalytics.permanent} icons={<PersonPinIcon sx={{ color: 'primary.main', fontSize: '5rem' }} />} slices={1} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <DataCards title="MALE / FEMALE" value1={dataAnalytics && dataAnalytics.sex[2].total} value2={dataAnalytics && dataAnalytics.sex[1].total} icons={<WcIcon sx={{ color: 'primary.main', fontSize: '5rem' }} />} slices={2} />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
        </>
    )
}

export default DataAnalytics