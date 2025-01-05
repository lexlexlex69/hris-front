import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Fab } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { blue, green, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// external imports
import { convertTo64ed } from '../customFunctions/CustomFunctions'
import PdsSelect from '../customComponents/PdsSelect'

const Input = styled('input')({
    display: 'none',
});

function Add(props) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // ref
    // component state
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [yearGrad, setYearGrad] = useState('')
    // component state refs
    const level = useRef('')
    const nameOfSchool = useRef('')
    const [degree, setDegree] = useState('')
    // const degree = useRef('')
    const highestLevel = useRef('')
    const yearGraduated = useRef('')
    const academicHonors = useRef('')
    const [file, setFile] = useState({}) // make the state as obj, for multiple files

    // functions

    const multipleFileHander = (e) => {
        let file = e.target.files
        let files = []
        if (file.length > 5) {
            toast.warning('Files are limited up to 5 only!')
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

    const handleAddRecord = async (e) => {
        e.preventDefault();
        let fileBase64 = '';
        let file_flag = 0;
        if (Object.keys(file).length > 0) {
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
            fileBase64 = await convertTo64ed(file)
            let recordToAdd = props.educationRecord.map(item => item)
            let rowId = recordToAdd.length
            recordToAdd.push({ // push to record object
                elevel: level.current.value,
                nschool: nameOfSchool.current.value,
                degreecourse: degree,
                // degreecourse: degree.current.value,
                yeargrad: new Date(yearGrad).getFullYear(),
                gradelevel: highestLevel.current.value,
                datefrom: new Date(dateFrom).getFullYear(),
                dateto: new Date(dateTo).getFullYear(),
                honor: academicHonors.current.value,
                order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                status: 2,
                rowId: rowId + 1,
                file_path: fileBase64,
                ext: ''
            })

            let record = props.education.map((item) => item)
            record.unshift({ // push to state used in the table
                elevel: level.current.value,
                nschool: nameOfSchool.current.value,
                degreecourse: degree,
                // degreecourse: degree.current.value,
                yeargrad: new Date(yearGrad).getFullYear(),
                gradelevel: highestLevel.current.value,
                datefrom: new Date(dateFrom).getFullYear(),
                dateto: new Date(dateTo).getFullYear(),
                order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                honor: academicHonors.current.value,
                rowId: rowId + 1,
                isNew: true,
                file_path: fileBase64,
            })

            let newTableData = props.tableData.map((item) => item)
            newTableData.unshift({ // push to state used in the table
                elevel: level.current.value,
                nschool: nameOfSchool.current.value,
                degreecourse: degree,
                // degreecourse: degree.current.value,
                yeargrad: new Date(yearGrad).getFullYear(),
                gradelevel: highestLevel.current.value,
                datefrom: new Date(dateFrom).getFullYear(),
                dateto: new Date(dateTo).getFullYear(),
                order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                honor: academicHonors.current.value,
                rowId: rowId + 1,
                isNew: true,
                file_path: fileBase64,
            })
            // newTableData.sort(function (a, b) { return a.order - b.order })
            // record.sort(function (a, b) { return a.order - b.order })
            newTableData = newTableData.slice(0, props.perPage)
            props.setTableData(newTableData)
            props.setEducationRecord(recordToAdd)
            props.setEducation(record)
            props.setPageTotal(record.length)
            props.handleClose()
        }
        else {
            Swal.fire({
                title: 'Continue?',
                text: "click 'Continue' to continue without attaching document",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let recordToAdd = props.educationRecord.map(item => item)
                    let rowId = recordToAdd.length
                    recordToAdd.push({ // push to record object
                        elevel: level.current.value,
                        nschool: nameOfSchool.current.value,
                        degreecourse: degree,
                        // degreecourse: degree.current.value,
                        yeargrad: new Date(yearGrad).getFullYear(),
                        gradelevel: highestLevel.current.value,
                        datefrom: new Date(dateFrom).getFullYear(),
                        dateto: new Date(dateTo).getFullYear(),
                        honor: academicHonors.current.value,
                        order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                        status: 2,
                        rowId: rowId + 1,
                        file_path: fileBase64,
                        ext: ''
                    })

                    let record = props.education.map((item) => item)
                    record.unshift({ // push to state used in the table
                        elevel: level.current.value,
                        nschool: nameOfSchool.current.value,
                        degreecourse: degree,
                        // degreecourse: degree.current.value,
                        yeargrad: new Date(yearGrad).getFullYear(),
                        gradelevel: highestLevel.current.value,
                        datefrom: new Date(dateFrom).getFullYear(),
                        dateto: new Date(dateTo).getFullYear(),
                        order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                        honor: academicHonors.current.value,
                        rowId: rowId + 1,
                        isNew: true
                    })
                    let newTableData = props.tableData.map((item) => item)
                    newTableData.unshift({ // push to state used in the table
                        elevel: level.current.value,
                        nschool: nameOfSchool.current.value,
                        degreecourse: degree,
                        // degreecourse: degree.current.value,
                        yeargrad: new Date(yearGrad).getFullYear(),
                        gradelevel: highestLevel.current.value,
                        datefrom: new Date(dateFrom).getFullYear(),
                        dateto: new Date(dateTo).getFullYear(),
                        order: level.current.value === 'ELEMENTARY' ? 1 : level.current.value === 'SECONDARY' ? 2 : level.current.value === 'VOCATIONAL/TRADE COURSE' ? 3 : level.current.value === 'COLLEGE' ? 4 : level.current.value === 'GRADUATE STUDIES' ? 5 : '',
                        honor: academicHonors.current.value,
                        rowId: rowId + 1,
                        isNew: true
                    })
                    // newTableData.sort(function (a, b) { return a.order - b.order })
                    // record.sort(function (a, b) { return a.order - b.order })
                    newTableData = newTableData.slice(0, props.perPage)
                    props.setTableData(newTableData)
                    props.setEducationRecord(recordToAdd)
                    props.setEducation(record)
                    props.setPageTotal(record.length)
                    props.handleClose()
                }
                else {
                    return
                }
            })
        }
    }


    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', pt: matches ? 4 : 4 }}>
            <form onSubmit={handleAddRecord}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'space-evenly', height: '70vh', px: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="elevel-select-label">Level</InputLabel>
                        <Select
                            required
                            labelId="elevel-select-label"
                            id="elevel-select"
                            defaultValue=""
                            label="Level"
                            inputRef={level}
                        >
                            <MenuItem value='ELEMENTARY'>ELEMENTARY</MenuItem>
                            <MenuItem value='SECONDARY'>SECONDARY</MenuItem>
                            <MenuItem value='VOCATIONAL/TRADE COURSE'>VOCATIONAL/TRADE COURSE</MenuItem>
                            <MenuItem value='COLLEGE'>COLLEGE</MenuItem>
                            <MenuItem value='GRADUATE STUDIES'>GRADUATE STUDIES</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField required variant='outlined' label='Name of school' fullWidth inputRef={nameOfSchool} />
                    <PdsSelect componentTitle='BASIC EDUCATION/DEGREE/COURSE' url='/api/pds/education/add/autoCompele' optionTitle="course_name" setTitle={setDegree} />
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year']}
                                label="FROM"
                                value={dateFrom}
                                onChange={(newValue) => {
                                    setDateFrom(newValue)
                                }}
                                renderInput={(params) => <TextField required {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year']}
                                label="TO"
                                value={dateTo}
                                onChange={(newValue) => {
                                    setDateTo(newValue)
                                }}
                                renderInput={(params) => <TextField required {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <TextField required variant='outlined' label='HIGHEST LEVEL/UNITS EARNED (if not graduated)' fullWidth inputRef={highestLevel} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            views={['year']}
                            label="YEAR GRADUATED"
                            value={yearGrad}
                            onChange={(newValue) => {
                                setYearGrad(newValue)
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                    <TextField variant='outlined' label='SCHOLARSHIP/ACADEMIC HONORS RECEIVED' fullWidth inputRef={academicHonors} />
                    <Box sx={{ display: 'flex', alignItems: 'space-between', mb: 2, gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                            {file && Object.keys(file).map((x, i) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: red[500] }}>...{file[x].name.slice(Math.max(file[x].name.length - 15, 1))} <br></br></Typography>
                                    <IconButton color="error" size="small" onClick={() => removeFile(x)}>
                                        <HighlightOffIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" multiple type="file" onChange={multipleFileHander} />
                            <Button variant="outlined" component="span">
                                <AttachFileIcon /> {file.length > 0 ? 'FILE ADDED' : 'Attach file'}
                            </Button>
                        </label>
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default Add