import React, { Fragment, useContext, useEffect, useState } from 'react'

import { Box, Button, Stack } from '@mui/material'
import InputIcon from 'react-multi-date-picker/components/input_icon'
import { DatePicker } from '@mui/x-date-pickers'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { DateObject } from 'react-multi-date-picker'
import dayjs from 'dayjs'

import { LeaveWithoutPayRegistration, LWOPStateContext } from './LeaveWithoutPayRegistration'

function RegistrationLog() {
    return (
        <LeaveWithoutPayRegistration>
            <LWOPView />
        </LeaveWithoutPayRegistration>
    )
}

export default RegistrationLog

function LWOPView() {
    const { lwopState, setLWOPState } = useContext(LWOPStateContext);
    const [currentMonth, setCurrentMonth] = React.useState(new DateObject())

    const handleCurrentMonth = (date) => {
        console.log(date)
        setCurrentMonth(date)
    }

    const handleGetLWOP = (ev) => {
        ev.preventDefault();
    }

    useEffect(() => {
        console.log(lwopState)
    })

    return (
        <>
            <Fragment>

            </Fragment>
            test
            <Box sx={{ margin: '20px', paddingBottom: '20px' }}>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} lg={12}>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year']}
                                label="Year period"
                                minDate={dayjs('2020-01-01')}
                                maxDate={dayjs(moment(new Date()).format('YYYY-MM-DD'))}
                                name="yearperiod"
                                fullWidth
                            />
                        </LocalizationProvider> */}
                        <Stack direction={'row'} spacing={1}>
                            <Box>
                                <DatePicker
                                    onlyMonthPicker
                                    value={currentMonth}
                                    onChange={handleCurrentMonth}
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    render={<InputIcon />}
                                    sort
                                    minDate={dayjs('2020-01-01')}
                                />
                            </Box>
                            <Box>
                                <Button variant='contained' color='success' size='small' onClick={handleGetLWOP}>
                                    Submit
                                </Button>
                            </Box>
                        </Stack>
                    </Grid2>
                    <Grid2 item xs={12} lg={12}>
                        {/* <View /> */}
                    </Grid2>
                </Grid2>
            </Box>
        </>
    )
}