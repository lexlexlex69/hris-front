import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import { blue, green, red, yellow } from '@mui/material/colors'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';

// external imports
import { checkChangedInputs, filterFalsyValues, convertTo64, handleViewFile } from '../customFunctions/CustomFunctions'

const Input = styled('input')({
    display: 'none',
});

const Update = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // component state refs
    const organization = useRef('')
    const nohrs = useRef('')
    const positionwork = useRef('')
    const [datefrom, setDatefrom] = useState(moment(new Date(props.data.datefrom)).format('YYYY-MM-DD'))
    const [dateto, setDateto] = useState(moment(props.data.dateto).format('YYYY-MM-DD') === 'Invalid date' ? props.data.dateto : moment(props.data.dateto).format('YYYY-MM-DD'))
    const [file, setFile] = useState('')
    const [present, setPresent] = useState(moment(props.data.dateto).format('YYYY-MM-DD') !== 'Invalid date' ? false : true);

    // file state
    const handleUpdateVoluntary = async (e) => { // make updates 
        e.preventDefault()
        let filename = undefined
        let ext = undefined
        if (file) {
            filename = await convertTo64(file)
            ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        }
        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            organization: checkChangedInputs(props.data.organization, organization.current.value, 'organization'),
            nohrs: checkChangedInputs(props.data.nohrs, nohrs.current.value, 'nohrs'),
            positionwork: checkChangedInputs(props.data.positionwork, positionwork.current.value, 'positionwork'),
            datefrom: checkChangedInputs(moment(new Date(props.data.datefrom)).format('YYYY-MM-DD'), moment(new Date(datefrom)).format('YYYY-MM-DD'), 'datefrom'),
            dateto: checkChangedInputs(moment(props.data.dateto).format('YYYY-MM-DD') === 'Invalid date' ? props.data.dateto : moment(props.data.dateto).format('YYYY-MM-DD'), present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'), 'dateto'),
            file_path: filename,
            ext: ext
        }
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj) // remove all object properties with undefined value
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        // console.log(filteredValuesObj)
        // ater checking for undefined value, add the status and rowId
        filteredValuesObj.status = 0
        filteredValuesObj.rowId = props.data.id

        let recordToUpdate = props.voluntaryRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        //console.log(recordToUpdate)
        let voluntaryToUpdate = props.voluntary.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    organization: organization.current.value,
                    nohrs: nohrs.current.value,
                    datefrom: moment(new Date(datefrom)).format('YYYY-MM-DD'),
                    dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                    positionwork: positionwork.current.value,
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        let newTableData = props.tableData.map(item => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    organization: organization.current.value,
                    nohrs: nohrs.current.value,
                    datefrom: moment(new Date(datefrom)).format('YYYY-MM-DD'),
                    dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                    positionwork: positionwork.current.value,
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })


        props.setVoluntaryRecord(recordToUpdate)
        props.setVoluntary(voluntaryToUpdate)
        props.setTableData(newTableData)
        props.handleClose()
    }

    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', px: 2, pt: 2, position: 'relative' }}>
            <Box>
                <form onSubmit={handleUpdateVoluntary}>
                <Grid container spacing={1} >
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="NAME AND ADDRESS OF ORGANIZATION" variant='filled' required defaultValue={props.data.organization} inputRef={organization} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'flex-start' }}>
                        <Typography sx={{ color: blue[500], textAlign: 'center' }}>INCLUSIVE DATES</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="FROM"
                                    value={datefrom ? datefrom : ''}
                                    onChange={(newValue) => {
                                        setDatefrom(newValue)
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    disabled={present}
                                    label="TO"
                                    value={dateto}
                                    onChange={(newValue) => {
                                        setDateto(newValue)
                                    }}
                                    renderInput={(params) => <TextField required fullWidth  {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={present} />} onChange={() => setPresent(prev => !prev)} label="Present" />
                            </FormGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="NO OF HOURS" variant='outlined' required defaultValue={props.data.nohrs} inputRef={nohrs} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="POSITION / NATURE OF WORK" variant='outlined' required defaultValue={props.data.positionwork} inputRef={positionwork} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-end' }}>
                        {props.data.file_path ? (
                            <Tooltip title="view file">
                                <Button variant="contained" startIcon={<AttachFileIcon sx={{ transform: 'rotate(30DEG)' }} />} onClick={() => handleViewFile(props.data.id, 'voluntary/viewAttachFile')}>
                                    View File
                                </Button>
                            </Tooltip>
                        ) : null}
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button fullWidth variant={file ? 'contained' : 'outlined'} startIcon={props.data.file_path ? (<EditIcon />) : (<AttachFileIcon />)} color={props.data.file_path ? 'warning' : file ? 'success' : 'primary'} component="span" sx={{ '&:hover': { bgcolor: props.data.file_path ? yellow[800] : file ? green[500] : blue[800], color: '#fff' }, flex: 1 }}>
                                {props.data.file_path ? file ? 'FILE ADDED' : 'UPDATE FILE' : file ? 'FILE ADDED' : 'ADD FILE'}
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" type='submit' color="warning" startIcon={<EditIcon />} > Update</Button>
                            {/* <Button variant="contained" color="error" onClick={props.handleClose} > Close</Button> */}
                        </Box>
                    </Grid>
                </Grid>
                </form>
            </Box>

        </Box>
    )
}
export default Update

