import React, { useState, useRef, useEffect } from 'react'
import { Box, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import { styled } from '@mui/material/styles';
import { blue, green, red, yellow } from '@mui/material/colors'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AsyncCreatableSelect from 'react-select/async-creatable';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';

import moment from 'moment'

// external imports
import { checkChangedInputs, filterFalsyValues, convertTo64, handleViewFile } from '../customFunctions/CustomFunctions'
import PdsSelect from '../customComponents/PdsSelect';

const Input = styled('input')({
    display: 'none',
});

let filterTimeout = null

const Update = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // component state refs
    // const title = useRef('')
    const autoCompleteRef = useRef(null)
    const [title, setTitle] = useState('')
    const rating = useRef('')
    const placeofexam = useRef('')
    const licenseno = useRef('')
    const [dateofexam, setDateofexam] = useState(moment(new Date(props.eli.dateofexam)).format('MM/DD/YYYY'))
    const [dateissue, setDateissue] = useState(props.eli.dateissue ? moment(new Date(props.eli.dateissue)).format('MM/DD/YYYY') : null)
    const [others, setOthers] = useState(false)
    const [otherDate, setOtherDate] = useState(props.eli.dateissue)
    const [file, setFile] = useState('')
    // file state
    const handleUpdateEduc = async (e) => { // make updates 
        e.preventDefault()
        let filename = undefined
        let ext = undefined
        if (file) {
            filename = await convertTo64(file)
            ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        }
        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            title: checkChangedInputs(props.eli.title, title, 'title'),
            rating: checkChangedInputs(props.eli.rating, rating.current.value, 'rating'),
            placeofexam: checkChangedInputs(props.eli.placeofexam, placeofexam.current.value, 'placeofexam'),
            dateofexam: checkChangedInputs(moment(new Date(props.eli.dateofexam)).format('MM/DD/YYYY'), moment(new Date(dateofexam)).format('MM/DD/YYYY'), 'dateofexam'),
            licenseno: checkChangedInputs(props.eli.licenseno, licenseno.current.value, 'licenseno'),
            dateissue: checkChangedInputs(moment(new Date(props.eli.dateissue)).format('MM/DD/YYYY') !== 'Invalid date' ? moment(new Date(props.eli.dateissue)).format('MM/DD/YYYY') : props.eli.dateissue, others ? otherDate : moment(new Date(dateissue)).format('MM/DD/YYYY'), 'dateissue'),
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
        filteredValuesObj.rowId = props.eli.id

        let recordToUpdate = props.eligibilityRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        let eligibilityToUpdate = props.eligibility.map((item, index) => {
            if (item.id === props.eli.id) {
                return {
                    ...item,
                    isUpdated: true,
                    title: title,
                    rating: rating.current.value,
                    placeofexam: placeofexam.current.value,
                    licenseno: licenseno.current.value,
                    dateofexam: moment(new Date(dateofexam)).format('MM/DD/YYYY'),
                    dateissue: others ? otherDate : moment(new Date(dateissue)).format('MM/DD/YYYY'),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        let newTableData = props.tableData.map(item => {
            if (item.id === props.eli.id) {
                return {
                    ...item,
                    isUpdated: true,
                    title: title,
                    rating: rating.current.value,
                    placeofexam: placeofexam.current.value,
                    licenseno: licenseno.current.value,
                    dateofexam: moment(new Date(dateofexam)).format('MM/DD/YYYY'),
                    dateissue: others ? otherDate : moment(new Date(dateissue)).format('MM/DD/YYYY'),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        props.setEligibilityRecord(recordToUpdate)
        props.setEligibility(eligibilityToUpdate)
        props.setTableData(newTableData)
        props.handleClose()
    }

    return (
        <Box>
            <Box sx={{ height: '100%', overflowY: 'scroll', px: 2, pt: 2 }}>
                <form onSubmit={handleUpdateEduc} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: matches ? '70vh' : '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <PdsSelect componentTitle='CAREER SERVICE' optionTitle='elig_title' setTitle={setTitle} url='api/pds/eligibility/add/autoComplete' defaultValue={props.eli.title} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 1 }}>
                        <TextField required fullWidth label="Rating if applicable" variant='filled' defaultValue={props.eli.rating} inputRef={rating} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="DATE OF EXAM"
                                value={dateofexam ? dateofexam : ''}
                                onChange={(newValue) => {
                                    setDateofexam(newValue)
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <TextField required fullWidth label="PLACE OF EXAMINATION" variant='filled' defaultValue={props.eli.placeofexam} inputRef={placeofexam} />
                    </Box>
                    <Box>
                        <Typography sx={{ display: 'flex', textAlign: 'left', color: green[500] }}>LICENSE (If applicable)</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, width: '100%' }}>
                            <TextField fullWidth label="Number" variant='filled' defaultValue={props.eli.licenseno} inputRef={licenseno} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, width: '100%', mt: 2 }}>
                        {!others ? (
                            <>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="DATE OF VALIDITY"
                                        value={dateissue ? dateissue : ''}
                                        onChange={(newValue) => {
                                            setDateissue(newValue)
                                        }}
                                        renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                                    />
                                </LocalizationProvider>
                            </>
                        )
                            : (
                                <>
                                    <TextField variant='outlined' required label='Others (specify e.g. N/A or PRESENT)' fullWidth value={otherDate} onChange={(e) => setOtherDate(e.target.value)} inputProps={{ maxLength: 7 }} />
                                </>
                            )}

                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={others} />} onChange={() => setOthers(prev => !prev)} label="Others" />
                        </FormGroup>
                    </Box>

                    <Box sx={{ display: 'flex', mt: 1, gap: 2, justifyContent: 'flex-end' }}>
                        {props.eli.file_path ? (
                            <Button variant="contained" startIcon={<AttachFileIcon sx={{ transform: 'rotate(30DEG)' }} />} onClick={() => handleViewFile(props.eli.id, 'eligibility/viewAttachFile')}>
                                View File
                            </Button>
                        ) : null}
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button fullWidth variant={file ? 'contained' : 'outlined'} startIcon={props.eli.file_path ? (<EditIcon />) : (<AttachFileIcon />)} color={props.eli.file_path ? 'warning' : file ? 'success' : 'primary'} component="span" sx={{ '&:hover': { bgcolor: props.eli.file_path ? yellow[800] : file ? green[500] : blue[500], color: '#fff' }, flex: 1 }}>
                                {props.eli.file_path ? file ? 'FILE ADDED' : 'UPDATE FILE' : file ? 'File added' : 'Add file'}
                            </Button>
                        </label>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="warning" type="submit" startIcon={<EditIcon />} > Update</Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}
export default Update

