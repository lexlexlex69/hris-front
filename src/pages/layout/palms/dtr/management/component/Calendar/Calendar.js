import { useEffect, useState } from "react"

import { Box, Divider, Grid, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from "@mui/material"
import { blue } from '@mui/material/colors'
import moment from "moment"

import CalendarHeader from "./CalendarHeader"
import "./Calendar.css"

const coverage = [
    { id: 1, desc: 'National' },
    { id: 2, desc: 'Local' },
]

// 1 - legal non-working holiday 2 - legal working 3 - special non-working 4 - special working 5 - whole day work suspension 6 - am work suspension 7 - pm work suspension
const type = [
    { id: 1, desc: 'Legal Non-Working Holiday' },
    { id: 2, desc: 'Legal Working' },
    { id: 3, desc: 'Special Non-Working' },
    { id: 4, desc: 'Special Working' },
    { id: 5, desc: 'Whole Day Work Suspension' },
    { id: 6, desc: 'AM Work Suspension' },
    { id: 7, desc: 'PM Work Suspension' },
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: 13,
        padding: 10,
        // fontFamily:'latoreg'

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 13,
        // fontFamily:'latoreg'

    },
}));

export function Calendar({ calendarData, setCalendarData, holidaysData, setHolidaysData }) {
    const [viewsRef, setViewsRef] = useState('MONTH')
    const [weekStartsOnRef, setWeekStartsOnRef] = useState(0)
    const [currentDate, setCurrentDate] = useState(null)
    const [workSchedDate, setWorkSchedDate] = useState([])

    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [loading, setLoading] = useState(true)

    console.log(holidaysData)

    // useEffect(() => {
    //     if (currentDate) {
    //         let todayDates = calendarData.filter(el => moment().month(currentDate).format('MM') === moment(el.date).format('MM'))
    //         todayDates.length > 0 ? setWorkSchedDate(todayDates) : setWorkSchedDate([])
    //     }
    // }, [currentDate])
    // useEffect(() => {
    //     console.log(workSchedDate)
    // }, [workSchedDate])

    useEffect(() => {
        _init()
    }, [])

    const _init = () => {
        // setCurrentDate(moment().month())
        // let todayDates = calendarData.filter(el => moment(el.date).format('MM') === moment().format('MM'))
        // todayDates.length > 0 ? setWorkSchedDate(todayDates) : setWorkSchedDate([])
    }

    // const handleTimeSlotClick = () => {

    // }

    return (<>
        <Stack spacing={1}>
            {/* <CalendarHeader {...{ viewsRef, setViewsRef, weekStartsOnRef, setWeekStartsOnRef, currentDate, setCurrentDate }} /> */}
            <Divider />
            {/* <Box> */}
                {/* <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell> Date </StyledTableCell>
                                <StyledTableCell> Description </StyledTableCell>
                                <StyledTableCell> Type </StyledTableCell>
                                <StyledTableCell> Cover </StyledTableCell>
                                <StyledTableCell> Time Slot </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workSchedDate.length === 0 ?
                                <TableRow></TableRow>
                                :
                                workSchedDate.map((el, ix) => (
                                    <TableRow key={ix}>
                                        <TableCell sx={{
                                            color: holidaysData.some(holiday =>
                                                moment(el.date).isBetween(
                                                    moment(holiday.date_from),
                                                    moment(holiday.date_to),
                                                    'day',
                                                    '[]'
                                                )
                                            ) ? 'red' : '', fontSize: 12, fontFamily: 'latoreg', padding: '10px'
                                        }}>
                                            {el.date}
                                        </TableCell>
                                        <TableCell>
                                            {holidaysData.length === 0 ? '' :
                                                (holidaysData.find(holiday =>
                                                    moment(el.date).isBetween(
                                                        moment(holiday.date_from),
                                                        moment(holiday.date_to),
                                                        'day',
                                                        '[]'
                                                    )
                                                ) || {})['holiday_desc'] || ''
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {holidaysData.length === 0 ? '' :
                                                (() => {
                                                    const holiday = holidaysData.find(h =>
                                                        moment(el.date).isBetween(
                                                            moment(h.date_from),
                                                            moment(h.date_to),
                                                            'day',
                                                            '[]'
                                                        )
                                                    );
                                                    const holidayType = holiday?.type || '';
                                                    return type.find(t => t.id === holidayType)?.desc || '';
                                                })()
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {holidaysData.length === 0 ? '' :
                                                (() => {
                                                    const holiday = holidaysData.find(h =>
                                                        moment(el.date).isBetween(
                                                            moment(h.date_from),
                                                            moment(h.date_to),
                                                            'day',
                                                            '[]'
                                                        )
                                                    );
                                                    const holidayCover = holiday?.cover || '';
                                                    return coverage.find(t => t.id === holidayCover)?.desc || '';
                                                })()
                                            }
                                        </TableCell>
                                        
                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer> */}

                {/* <CalendarComponent
                    data={workSchedDate}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    currentView={viewsRef}
                    weekStartsOn={weekStartsOnRef}
                    onItemClick={(item) => {
                        setOpen(true);
                        setSelectedItem(item);
                    }}
                    onCellClick={(dateInfo) => {
                        const utcTimeDate = new Date(dateInfo.timeDateUTC);
                        const addedHour = new Date(
                            utcTimeDate.setHours(utcTimeDate.getHours() + 1)
                        ).toISOString();
                        setOpen(true);
                        setSelectedItem({
                            title: null,
                            startTimeDate: dateInfo.timeDateUTC,
                            endTimeDate: addedHour,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }}
                    onDayNumberClick={(val) => {
                        setCurrentDate(val);
                        setViewsRef("DAY");
                    }}
                    onDayStringClick={(val) => {
                        setCurrentDate(val);
                        setViewsRef("DAY");
                    }}
                    timeDateFormat={{
                        day: "eeeeee",
                        monthYear: "LLL y"
                    }}
                /> */}
            {/* </Box> */}
        </Stack >
    </>
    )
}