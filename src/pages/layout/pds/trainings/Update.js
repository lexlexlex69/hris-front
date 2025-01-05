import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { blue, green, red, yellow } from '@mui/material/colors'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AsyncCreatableSelect from 'react-select/async-creatable';
import moment from 'moment'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
// external imports
import { checkChangedInputs, filterFalsyValues, convertTo64, handleViewFile } from '../customFunctions/CustomFunctions'
import PdsSelect from '../customComponents/PdsSelect'

const Input = styled('input')({
    display: 'none',
});

let filterTimeout = null // for deboucing


const Update = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // component state refs
    const [otherTypes, setOtherTypes] = useState(false)
    const [otherTypeLD, setOtherTypeLD] = useState('')

    const organization = useRef('')
    const nohrs = useRef('')
    const positionwork = useRef('')

    const [titleState, setTitleState] = useState(props.data.title)

    const title = useRef('')
    const nohours = useRef('')
    const conducted = useRef('')
    const typeLD = useRef('')
    const [datefrom, setDatefrom] = useState(props.data.datefrom)
    const [dateto, setDateto] = useState(props.data.dateto)
    const [file, setFile] = useState('')

    useEffect(() => {
        if (props.data.typeLD === 'MANAGERIAL' || props.data.typeLD === 'SUPERVISORY' || props.data.typeLD === 'TECHNICAL') {
            setOtherTypes(false)
        }
        else {
            setOtherTypeLD(props.data.typeLD)
            setOtherTypes(true)
        }
    }, [props])

    // file state
    const handleUpdateTrainings = async (e) => { // make updates 
        e.preventDefault()
        let filename = undefined
        let ext = undefined
        if (file) {
            filename = await convertTo64(file)
            ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        }
        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            title: checkChangedInputs(props.data.title, titleState, 'title'),
            nohours: checkChangedInputs(props.data.nohours, nohours.current.value, 'nohours'),
            datefrom: checkChangedInputs(props.data.datefrom ? moment(new Date(props.data.datefrom)).format('YYYY-MM-DD') : null, datefrom ? moment(new Date(datefrom)).format('YYYY-MM-DD') : null, 'datefrom'),
            dateto: checkChangedInputs(props.data.dateto ? moment(new Date(props.data.dateto)).format('MM/DD/YYYY') : null, dateto ? moment(new Date(dateto)).format('MM/DD/YYYY') : null, 'dateto'),
            typeLD: checkChangedInputs(props.data.typeLD, otherTypes ? otherTypeLD : typeLD.current.value, 'typeLD'),
            conducted: checkChangedInputs(props.data.conducted, conducted.current.value, 'conducted'),
            file_path: filename,
            ext: ext
        }
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj) // remove all object properties with undefined value
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        // ater checking for undefined value, add the status and rowId
        filteredValuesObj.status = 0
        filteredValuesObj.rowId = props.data.id

        let recordToUpdate = props.trainingsRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        let trainingsToUpdate = props.trainings.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    title: titleState,
                    nohours: nohours.current.value,
                    datefrom: moment(new Date(datefrom)).format('MM/DD/YYYY'),
                    dateto: moment(new Date(dateto)).format('MM/DD/YYYY'),
                    typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                    conducted: conducted.current.value,
                    file_path: filename
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
                    title: titleState,
                    nohours: nohours.current.value,
                    datefrom: moment(new Date(datefrom)).format('MM/DD/YYYY'),
                    dateto: moment(new Date(dateto)).format('MM/DD/YYYY'),
                    typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                    conducted: conducted.current.value,
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })
        props.setTrainingsRecord(recordToUpdate)
        props.setTrainings(trainingsToUpdate)
        props.setTableData(newTableData)
        props.handleClose()
    }


    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', px: 2, pt: 2 }}>
            <form onSubmit={handleUpdateTrainings}>
                <Grid container spacing={1} >
                    <Box sx={{ display: 'flex', width: '100%', flex: 1, gap: 1 }}>
                        <PdsSelect componentTitle='TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS' optionTitle='title_of_training' url='/api/pds/trainings/add/AutoComplete' setTitle={setTitleState} defaultValue={props?.data?.title} />
                    </Box>
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
                                    renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="TO"
                                    value={dateto ? dateto : ''}
                                    onChange={(newValue) => {
                                        setDateto(newValue)
                                    }}
                                    renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="NUMBER OF HOURS" variant='filled' defaultValue={props.data.nohours} inputRef={nohours} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <Box display='flex' gap={1} width="100%">
                            {otherTypes ? (
                                <>
                                    <TextField fullWidth label="Other type LD" variant='outlined' value={otherTypeLD} onChange={(e) => setOtherTypeLD(e.target.value)} />
                                </>
                            ) : (
                                <>
                                    <FormControl fullWidth>
                                        <InputLabel id="elevel-select-label">Type LD</InputLabel>
                                        <Select
                                            required
                                            labelId="typeLD-select-label"
                                            id="typeLD-select"
                                            defaultValue={props.data.typeLD}
                                            label="Type LD"
                                            inputRef={typeLD}
                                        >
                                            <MenuItem value='MANAGERIAL'>MANAGERIAL</MenuItem>
                                            <MenuItem value='SUPERVISORY'>SUPERVISORY</MenuItem>
                                            <MenuItem value='TECHNICAL'>TECHNICAL</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={otherTypes} />} label="Others" onChange={() => setOtherTypes(prev => !prev)} />
                            </FormGroup>
                        </Box>

                        {/* <TextField fullWidth label="Type of LD Managerial/Supervisory/Technical/etc" variant='filled' defaultValue={props.data.typeLD} inputRef={typeLD} /> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="CONDUCTED/SPONSORED BY (write in full)" variant='filled' defaultValue={props.data.conducted} inputRef={conducted} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-end' }}>
                        {props.data.file_path ? (
                            <Tooltip title="view file">
                                <Button variant="contained" startIcon={<AttachFileIcon sx={{ transform: 'rotate(30DEG)' }} />} onClick={() => handleViewFile(props.data.id, 'trainings/viewAttachFile')}>
                                    View File
                                </Button>
                            </Tooltip>
                        ) : null}
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button fullWidth variant={file ? 'contained' : 'outlined'} startIcon={props.data.file_path ? <EditIcon /> : <AttachFileIcon />} color={props.data.file_path ? 'warning' : file ? 'success' : 'primary'} component="span" sx={{ '&:hover': { bgcolor: props.data.file_path ? yellow[800] : file ? green[500] : blue[800], color: '#fff' }, flex: 1 }}>
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

        </Box >
    )
}
export default Update

