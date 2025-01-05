import { Box, Button, Checkbox, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, useMediaQuery } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import ModuleHeaderText from "../../../../moduleheadertext/ModuleHeaderText";
import { HolidayMasterContext } from "../Context";
import { deleteHoliday, getAllHolidays } from "../../Request/HolidayRequest";
import MediumModal from "../../../../custommodal/MediumModal";
import { checkPermission } from "../../../../permissionrequest/permissionRequest";
import { auditLogs } from "../../../../auditlogs/Request";
import { APIError, APISuccess } from "../../../../customstring/CustomString";
import { AddHoliday } from "./AddHoliday";
import { EditHoliday } from "./EditHoliday";
// import { View } from "./View";

export function Main() {
    const { holidayMasterData, setHolidayMasterData, loading, setLoading, error, setError, status, setStatus, message, setMessage, open, setOpen, tempData, setTempData, } = useContext(HolidayMasterContext);
    const [yearRef, setYearRef] = useState(null)
    const [filterData, setFilterData] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [sortDirection, setSortDirection] = useState('desc')
    const navigate = useNavigate();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        checkPermission(816)
            .then(res => {
                console.log(res)
                if (res.data) {
                    _init();
                    //     var logs = {
                    //         action: 'ACCESS HOLIDAY MASTER FILE',
                    //         action_dtl: 'HOLIDAY MASTER FILE VIEWED',
                    //         module: 'HOLIDAYS MASTER FILE'
                    //     }
                    //     auditLogs(logs);
                }
            })
            .catch(err => {
                navigate(`/${process.env.REACT_APP_HOST}`);
            })
    }, [])
    useEffect(() => {
        if (loading) {
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we fetch the data',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false
            })
        } else {
            Swal.close()
        }
    }, [loading])
    // useEffect(() => {
    //     console.log(selectedItems)
    // }, [selectedItems])
    const _init = async () => {
        // setLoading(true)
        // const id = toast.loading('Fetching Data...')
        try {
            const res = await getAllHolidays()
            if (res.status === 200) {
                setHolidayMasterData((prev) => ({ ...prev, allHolidays: res.data }));
                // toast.update(id, { render: res.message, type: 'success', isLoading: false, autoClose: 5000 })
                setLoading(false)
            } else {
                // toast.update(id, { render: res.message, type: 'error', isLoading: false, autoClose: 5000 })
                setLoading(false)
            }
        } catch (err) {
            console.log(err)
            // toast.update(id, { render: 'Error fetching data', type: 'error', isLoading: false, autoClose: 5000 })
        }
    }
    const handleFilterSearch = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setFilterData([])
        const id = toast.loading('Fetching Data...', { autoClose: 5000, isLoading: true })
        setTimeout(() => {
            const years = yearRef.split(',').map(year => parseInt(year.trim()))

            // Filter and sort in one go
            const filteredData = holidayMasterData.allHolidays
                .filter(item => years.includes(parseInt(item.year)))
                .sort((a, b) => new Date(b.date_from) - new Date(a.date_from)) // Descending order

            if (filteredData.length > 0) {
                setFilterData(filteredData)
                toast.update(id, { render: 'Successfully fetched data', type: 'success', isLoading: false, autoClose: 1000 })
            } else {
                toast.update(id, { render: 'No data found', type: 'error', isLoading: false, autoClose: 1000 })
            }
        }, 2000)
    }
    const handleSort = () => {
        const sorted = [...filterData].sort((a, b) => {
            const comparison = new Date(b.date_from) - new Date(a.date_from)
            return sortDirection === 'desc' ? comparison : -comparison
        })
        setFilterData(sorted)
        setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    }
    const handleSelectedCheckBox = (e, item) => {
        e.preventDefault()
        e.stopPropagation()

        // Check if item already exists in selectedItems array
        const isSelected = selectedItems.some(selected => selected === item.holidays_id)

        if (isSelected) {
            // Remove item if already selected
            setSelectedItems(selectedItems.filter(selected => selected !== item.holidays_id))
        } else {
            // Add complete item if not selected
            setSelectedItems([...selectedItems, item.holidays_id])
        }
    }
    const handleDelete = () => {
        console.log(selectedItems)
        if (selectedItems.length === 0) {
            return toast.error('Please select at least one item to delete');
        }

        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete the selected items.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async () => {
                // Delete selected items
                const t_data = {
                    holidays_id: selectedItems
                }
                const res = await deleteHoliday(t_data)
                var logs = {
                    action: 'DELETE HOLIDAY MASTER FILE',
                    action_dtl: 'HOLIDAY MASTER FILE DELETED - ' + JSON.stringify(t_data),
                    module: 'HOLIDAYS MASTER FILE'
                }
                auditLogs(logs)
                if (res.status === 200) {
                    if (res.data.status === 200) {
                        APISuccess('Successfully deleted items', res.data.message)
                        setSelectedItems([])
                        setHolidayMasterData((prev) => ({ ...prev, allHolidays: res.data.data }));
                    } else {
                        APIError('Error deleting items', res.data.message)
                    }
                } else {
                    APIError('Error deleting items', res.data.message ?? res.message)
                }
            })
        } catch (error) {
            console.log(error)
            APIError('Error deleting items', error.message)
        }
    }
    const handleEdit = () => {
        // const selectedHoliday = filterData.find(item => selectedItems.includes(item.holidays_id));
        const temp = selectedItems.map(item => holidayMasterData.allHolidays.find(holiday => holiday.holidays_id === item));
        setTempData(temp);
        setOpen('edit-holidays');
        setStatus('edit-loading');
    }
    const handleReload = () => {
        setLoading(true);
        _init();
    }
    return (<>
        {!loading &&
            <Grid container spacing={2} sx={{ p: 4 }}>
                {/* <Grid item xs={12}>
                    <ModuleHeaderText title="Holiday Master" />
                </Grid> */}
                {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<CalendarMonthIcon />} size="small" onClick={() => setOpen('view-holidays-file')}> View Holidays </Button>
                </Grid> */}
                <Grid item xs={12}>
                    <form onSubmit={(e) => handleFilterSearch(e)}>
                        <Stack direction={'row'} justifyContent={matches ? 'flex-start' : 'flex-end'} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Button variant="outlined" onClick={handleSort} startIcon={sortDirection === 'desc' ? <ArrowDownward /> : <ArrowUpward />}> Sort </Button>
                            <Button variant="contained" color="error" onClick={handleDelete}> Delete </Button>
                            <Button variant="contained" color="info" onClick={handleEdit} disabled={selectedItems.length === 0}> Edit </Button>
                            <Button variant="contained" color="primary" onClick={() => setOpen('add-holidays')}>Add</Button>
                            <Button variant="outlined" color="info" onClick={handleReload}>Reload</Button>
                            <Box sx={{ flex: matches ? '0 0 100%' : '1 1 auto' }} />
                            <TextField
                                required
                                label="Year"
                                variant="outlined"
                                size="small"
                                sx={{ width: matches ? '100%' : '150px' }}
                                value={yearRef}
                                onChange={(e) => setYearRef(e.target.value)}
                                placeholder="ex. 2024,2023"
                            />
                            <Button variant="outlined" type="submit" fullWidth={matches}>
                                <SearchIcon />
                            </Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    {
                        filterData.length > 0 ?
                            <Paper>
                                <List sx={{ width: '100%', maxHeight: '80vh', overflowY: 'scroll' }}>
                                    {
                                        filterData.map((item, index) => {
                                            const labelId = `checkbox-list-label-${item.holidays_id}`;
                                            return (
                                                <ListItem
                                                    key={index}
                                                    // secondaryAction={
                                                    //     <IconButton edge="end" aria-label="comments">
                                                    //         <CommentIcon />
                                                    //     </IconButton>
                                                    // }
                                                    disablePadding
                                                >
                                                    <ListItemButton role={undefined} onClick={(e) => handleSelectedCheckBox(e, item)} dense>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={selectedItems.some(selected => selected === item.holidays_id)}
                                                                id={item.holidays_id}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                                onClick={(e) => handleSelectedCheckBox(e, item)}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={labelId} primary={index + 1 + '. ' + item.holiday_desc + ' - ' + item.year + ' (' + item.date_from + ' - ' + item.date_to + ')'} />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </Paper>
                            :
                            'No data found'
                    }
                </Grid>
            </Grid>
        }

        {/* <MediumModal close={() => setOpen(null)} open={open === "view-holidays-file"} title={'Holiday Master File'}>
            <View />
        </MediumModal> */}
        {/* ADD medium modal for adding of holidays */}
        <MediumModal close={() => setOpen(null)} open={open === "add-holidays" || open === "edit-holidays"} title={open === 'add-holidays' ? 'Add Holiday' : 'Edit Holiday'}>
            {open === 'add-holidays' ? <AddHoliday /> : <EditHoliday />}
            {/* <AddHoliday /> */}
        </MediumModal>
    </>
    )
}
