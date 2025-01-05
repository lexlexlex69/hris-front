import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import { blue, yellow, green } from '@mui/material/colors'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios'
import AsyncCreatableSelect from 'react-select/async-creatable';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';

// external imports
import { checkChangedInputs, filterFalsyValues, convertTo64ed } from '../customFunctions/CustomFunctions'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import PdsSelect from '../customComponents/PdsSelect'


const Input = styled('input')({
    display: 'none',
});

let filterTimeout = null

const Update = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // component state refs
    // auto complete ref
    const autoCompleteRef = useRef(null)
    const elevel = useRef(null)
    const nschool = useRef(null)
    // const degreecourse = useRef(null)
    const [degreecourse, setDegreecourse] = useState('')
    const gradelevel = useRef(null)
    const honor = useRef(null)

    // date states
    const [dateFrom, setDateFrom] = useState(props.educ.datefrom);
    const [dateTo, setDateTo] = useState(props.educ.dateto);
    const [yearGrad, setYearGrad] = useState(props.educ.yeargrad);

    // file state
    const [file, setFile] = useState('')

    // test functions 
    const multipleFileHander = (e) => {
        let file = e.target.files
        let files = []
        if (file.length > 5) {
            toast.warning('Files are limited up to 5 only!')
            return
        }
        Object.values(file).map((x, i) => {
            if (i <= 4) {
                files.push(x)
            }
        })
        setFile(files)
    }

    const removeFile = (index) => {
        let newObj = Object.assign({}, file)
        delete newObj[index]
        setFile(newObj)
    }

    // 

    const handleUpdateEduc = async (e) => { // make updates 
        e.preventDefault()

        let filename = undefined
        let ext = undefined
        let file_flag = 0
        if (file.length > 0) {
            console.log('asdasdas')
            let arrayExtension = ['jpg', 'png', 'jpeg', 'pdf']
            Object.values(file).every((x) => {
                let ext = x.name.slice((Math.max(0, x.name.lastIndexOf(".")) || Infinity) + 1)
                if (!arrayExtension.includes(ext)) {
                    toast.error(<div>File must be of type: pdf,jpg,png,jpeg <br />Other format is not allowed!</div>)
                    file_flag = 1
                    return false
                }
                return true
            })
            if (file_flag === 1) {
                return
            }
            // let file_ext = file[0]['0'].name.slice((Math.max(0, file[0]['0'].name.lastIndexOf(".")) || Infinity) + 1)
            // if (!arrayExtension.includes(file_ext)) {
            //     toast.error(<div>File must be of type: pdf,jpg,png,jpeg <br />Other format is not allowed!</div>)
            //     return
            //  }

            filename = await convertTo64ed(file)
            ext = file[0].name.slice((Math.max(0, file[0].name.lastIndexOf(".")) || Infinity) + 1)
        }
      
        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            elevel: checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel'),
            nschool: checkChangedInputs(props.educ.nschool, nschool.current.value, 'nschool'),
            degreecourse: checkChangedInputs(props.educ.degreecourse, degreecourse, 'degreecourse'),
            gradelevel: checkChangedInputs(props.educ.gradelevel, gradelevel.current.value, 'gradelevel'),
            yeargrad: checkChangedInputs(props.educ.yeargrad, new Date(yearGrad).getFullYear().toString(), 'yeargrad'),
            order: checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel')?.split('*_*')[0] === 'ELEMENTARY' ? 1 : checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel')?.split('*_*')[0] === 'SECONDARY' ? 2 : checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel')?.split('*_*')[0] === 'VOCATIONAL/TRADE COURSE' ? 3 : checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel')?.split('*_*')[0] === 'COLLEGE' ? 4 : checkChangedInputs(props.educ.elevel, elevel.current.value, 'elevel')?.split('*_*')[0] === 'GRADUATE STUDIES' ? 5 : null,
            honor: checkChangedInputs(props.educ.honor, honor.current.value, 'honor'),
            datefrom: checkChangedInputs(props.educ.datefrom, new Date(dateFrom).getFullYear().toString(), 'datefrom'),
            dateto: checkChangedInputs(props.educ.dateto, new Date(dateTo).getFullYear().toString(), 'dateTo'),
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
        filteredValuesObj.rowId = props.educ.id

        let educationRecordToUpdate = props.educationRecord.map(item => item)
        educationRecordToUpdate.push(filteredValuesObj)
        console.log(educationRecordToUpdate)
        let educationToUpdate = props.education.map((item, index) => {
            if (item.id === props.educ.id) {
                return {
                    ...item,
                    isUpdated: true,
                    elevel: elevel.current.value,
                    nschool: nschool.current.value,
                    degreecourse: degreecourse,
                    gradelevel: gradelevel.current.value,
                    yeargrad: new Date(yearGrad).getFullYear().toString(),
                    honor: honor.current.value,
                    order: elevel.current.value === 'ELEMENTARY' ? 1 : elevel.current.value === 'SECONDARY' ? 2 : elevel.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : elevel.current.value === 'COLLEGE' ? 4 : elevel.current.value === 'GRADUATE STUDIES' ? 5 : '',
                    datefrom: new Date(dateFrom).getFullYear().toString(),
                    dateto: new Date(dateTo).getFullYear().toString(),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        let newTableData = props.tableData.map((item, index) => {
            if (item.id === props.educ.id) {
                return {
                    ...item,
                    isUpdated: true,
                    elevel: elevel.current.value,
                    nschool: nschool.current.value,
                    degreecourse: degreecourse,
                    gradelevel: gradelevel.current.value,
                    order: elevel.current.value === 'ELEMENTARY' ? 1 : elevel.current.value === 'SECONDARY' ? 2 : elevel.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : elevel.current.value === 'COLLEGE' ? 4 : elevel.current.value === 'GRADUATE STUDIES' ? 5 : '',
                    yeargrad: new Date(yearGrad).getFullYear().toString(),
                    honor: honor.current.value,
                    datefrom: new Date(dateFrom).getFullYear().toString(),
                    dateto: new Date(dateTo).getFullYear().toString(),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        props.setTableData(newTableData)
        props.setEducationRecord(educationRecordToUpdate)
        props.setEducation(educationToUpdate)
        props.handleClose()
    }

    return (
        <Box sx={{ overflowY: 'scroll', height: '100%', px: 2 }}>
            <Box>
                <form onSubmit={handleUpdateEduc}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <FormControl variant='filled' fullWidth sx={{ flex: 1, width: '20%' }}>
                                <InputLabel id="elevel-select-label">Education Level</InputLabel>
                                <Select
                                    labelId="elevel-select-label"
                                    id="elevel-select"
                                    defaultValue={props.educ.elevel}
                                    label="Education Level"
                                    inputRef={elevel}
                                >
                                    <MenuItem value='ELEMENTARY'>Elementary</MenuItem>
                                    <MenuItem value='SECONDARY'>Secondary</MenuItem>
                                    <MenuItem value='VOCATIONAL/TRADE COURSE'>Vocational/Trade Course</MenuItem>
                                    <MenuItem value='COLLEGE'>College</MenuItem>
                                    <MenuItem value='GRADUATE STUDIES'>Graduate studies</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <TextField required fullWidth label="Name of School" variant='filled' defaultValue={props.educ.nschool} inputRef={nschool} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <Box display="flex" sx={{ width: '100%', flexDirection: 'column' }}>
                                <PdsSelect componentTitle='BASIC EDUCATION/DEGREE/COURSE' optionTitle='course_name' url='/api/pds/education/add/autoCompele' setTitle={setDegreecourse} defaultValue={props?.educ?.degreecourse} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year']}
                                    label="PERIOD ATTENDANCE FROM"
                                    value={dateFrom}
                                    onChange={(newValue) => {
                                        setDateFrom(newValue)
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year']}
                                    label="PERIOD ATTENDANCE TO"
                                    value={dateTo}
                                    onChange={(newValue) => {
                                        setDateTo(newValue)
                                    }}
                                    renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <TextField required fullWidth label="HIGHEST LEVEL/UNITS EARNED (if not graduated)" variant='filled' defaultValue={props.educ.gradelevel} inputRef={gradelevel} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year']}
                                    label="YEAR GRADUATED"
                                    value={yearGrad && yearGrad}
                                    onChange={(newValue) => {
                                        setYearGrad(newValue)
                                    }}
                                    renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                                />
                            </LocalizationProvider>
                            {/* <TextField fullWidth label="Year Graduated" variant='filled' defaultValue={props.educ.yeargrad} inputRef={yeargrad} /> */}
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                            <TextField fullWidth label="SCHOLARSHIP/ACADEMIC HONORS RECEIVED" variant='filled' defaultValue={props.educ.honor} inputRef={honor} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-end' }}>
                            {props.educ.file_path ? (
                                <Tooltip title="view file">
                                    <Button variant="contained" startIcon={<AttachFileIcon sx={{ transform: 'rotate(30DEG)' }} />} onClick={() => props.handleViewFile(props.educ.id, 'education/viewAttachFile')}>
                                        View File
                                    </Button>
                                </Tooltip>
                            ) : null}

                            <label htmlFor="contained-button-file">
                                <Input accept="image/*,.pdf" id="contained-button-file" multiple type="file" onChange={multipleFileHander} />
                                <Button fullWidth variant={file ? 'contained' : 'outlined'} startIcon={props.educ.file_path ? (<EditIcon />) : (<AttachFileIcon />)} color={props.educ.file_path ? 'warning' : file ? 'success' : 'primary'} component="span" sx={{ '&:hover': { bgcolor: props.educ.file_path ? yellow[800] : file ? green[500] : blue[800], color: '#fff' }, flex: 1 }}>
                                    {props.educ.file_path ? file ? 'File Added' : 'Update File' : file ? 'FILE ADDED' : 'ADD FILE'}
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="contained" color="warning" type="submit" startIcon={<EditIcon />} > Update</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>

        </Box>
    )
}
export default Update

