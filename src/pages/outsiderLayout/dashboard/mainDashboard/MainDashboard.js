import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Alert from '@mui/material/Alert'

import UserInfo from './UserInfo';
import Notifications from './notification/Notifications';
import TableHistory from './TableHistory';
import TablePositions from './TablePositions';
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'

import { TablePositionHistoryContext } from './TablePositionHistoryContext';
import { useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Skeleton } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { blue } from '@mui/material/colors';
import UnderDevWrapper from '../../../layout/dashboard/UnderDevWrapper';

const MainDashboard = () => {

    const [tablePositionHistoryContext, setTablePositionHistoryContext] = useState(false)
    const setTableContext = () => setTablePositionHistoryContext(prev => !prev)

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))

    const [userType, setUserType] = useState()

    const getCurrentUser = async () => {
        let res = await axios.get(`/api/user/getCurrentUser`)
        setUserType(res.data.user_type)
    }

    const [openJobHistory, setOpenJobHistory] = useState(false)
    useEffect(() => {
        getCurrentUser()
    }, [])
    return (
        <>
            <CssBaseline />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row', lg: 'row' }, mb: 1 }}>
                    {userType === 0 && <UserInfo />}
                    <Notifications />
                </Grid>
                {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Tooltip title="click to proccess action">
                        <Alert severity="error" color="error" sx={{ cursor: 'pointer' }} >This is a warning alert — check it out!</Alert>
                    </Tooltip>
                </Grid> */}
                <Box width='100%' pl={2}>
                    <UnderDevWrapper title="These features are not yet available for use.">
                        <TablePositionHistoryContext.Provider value={{ tablePositionHistoryContext, setTableContext }} >
                            <Box display='flex' justifyContent="flex-end" width='100%'>
                                <Button variant='contained' color={openJobHistory ? "error" : "warning"} endIcon={openJobHistory ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} sx={{ borderRadius: '.5rem', mt: 1, mb: 2 }} onClick={() => setOpenJobHistory(prev => !prev)}>{openJobHistory ? 'Close' : 'Open'} job application history</Button>
                            </Box>
                            {openJobHistory && (
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TableHistory />
                                    <Box display='flex' gap={1} my={2}>
                                        <Skeleton sx={{ bgcolor: '#9DB2BF' }} animation={false} width='100%'></Skeleton>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TablePositions />
                            </Grid>
                        </TablePositionHistoryContext.Provider>
                    </UnderDevWrapper>
                </Box>
            </Grid>
        </>

    );
};

export default MainDashboard;