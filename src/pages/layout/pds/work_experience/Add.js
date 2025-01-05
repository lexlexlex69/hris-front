import React, { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { blue, green, red, yellow } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
// moment 
import moment from 'moment'
// external imports
import { convertTo64 } from '../customFunctions/CustomFunctions'



const Input = styled('input')({
    display: 'none',
});

function Add(props) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // component state refs and state
    const [isPresent, setIsPresent] = useState(false)
    const positiontitle = useRef('')
    const agency = useRef('')
    const salary = useRef('')
    const salgrade = useRef('')
    const status = useRef('')
    const govt = useRef('')
    const [datefrom, setDatefrom] = useState('')
    const [dateto, setDateto] = useState('')
    const [file, setFile] = useState('')
    // added work_experience_sheet
    const [workExperienceSheet, setWorkExperienceSheet] = useState({
        from: '',
        to: '',
        position: '',
        nameOfOffice: '',
        immediateSupervisor: '',
        nameOfAgency: '',
        actualDuties: '',
        listOfAccomplishments: '',
        listOfAccomplishmentsArr: []
    })

    const handleChangeWorkExperienceSheet = (e) => {
        setWorkExperienceSheet({ ...workExperienceSheet, [e.target.name]: e.target.value })
    }

    // functions
    const handleAddEligibility = async (e) => {
        e.preventDefault();
        if (workExperienceSheet.listOfAccomplishments.length > 0) {
            let listArr = workExperienceSheet.listOfAccomplishments.split(',')
            workExperienceSheet.listOfAccomplishmentsArr = listArr
        }

        let fileBase64 = ''
        if (file) {
            let file_ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
            let arrayExtension = ['jpg', 'png', 'jpeg', 'pdf']
            if (arrayExtension.includes(file_ext)) { }
            else {
                toast.error(<div>File must be of type: pdf,jpg,png,jpeg <br />Other format is not allowed!</div>)
                return
            }
            fileBase64 = await convertTo64(file) // function to covert file to base64, call from global functions @customFunctions folder
            let recordToAdd = props.workExperienceRecord.map(item => item)
            let rowId = recordToAdd.length
            recordToAdd.push({ // push to record object
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                positiontitle: positiontitle.current.value,
                agency: agency.current.value,
                salary: salary.current.value,
                salgrade: salgrade.current.value,
                status: status.current.value,
                govt: govt.current.value,
                _status: 2,
                rowId: rowId + 1,
                work_experience_sheet: workExperienceSheet,
                file_path: fileBase64,
                ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
            })

            let record = props.workExperience.map((item) => item)
            record.unshift({ // push to state used in the table
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                positiontitle: positiontitle.current.value,
                agency: agency.current.value,
                salary: salary.current.value,
                salgrade: salgrade.current.value,
                status: status.current.value,
                govt: govt.current.value,
                work_experience_sheet: workExperienceSheet,
                rowId: rowId + 1,
                isNew: true,
                file_path: fileBase64,
            })

            let tableDataToAdd = props.tableData.map(item => item)
            tableDataToAdd.unshift({ // push to state used in the table
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                positiontitle: positiontitle.current.value,
                agency: agency.current.value,
                salary: salary.current.value,
                salgrade: salgrade.current.value,
                status: status.current.value,
                govt: govt.current.value,
                work_experience_sheet: workExperienceSheet,
                rowId: rowId + 1,
                isNew: true,
                file_path: fileBase64,
            })
            if (props.page !== 1) {
                toast.success('new record added!')
            }
            else {
                let newTableDataToAdd = tableDataToAdd.slice(0, props.perPage)
                props.setTableData(newTableDataToAdd)
            }
            props.setPageTotal(record.length)
            props.setWorkExperienceRecord(recordToAdd)
            props.setWorkExperience(record)
            //console.log(recordToAdd, record)
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
                    let recordToAdd = props.workExperienceRecord.map(item => item)
                    let rowId = recordToAdd.length
                    recordToAdd.push({ // push to record object
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        positiontitle: positiontitle.current.value,
                        agency: agency.current.value,
                        salary: salary.current.value,
                        salgrade: salgrade.current.value,
                        status: status.current.value,
                        govt: govt.current.value,
                        _status: 2,
                        rowId: rowId + 1,
                        work_experience_sheet: workExperienceSheet,
                        file_path: fileBase64,
                        ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
                    })

                    let record = props.workExperience.map((item) => item)
                    record.unshift({ // push to state used in the table
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        positiontitle: positiontitle.current.value,
                        agency: agency.current.value,
                        salary: salary.current.value,
                        salgrade: salgrade.current.value,
                        status: status.current.value,
                        govt: govt.current.value,
                        work_experience_sheet: workExperienceSheet,
                        rowId: rowId + 1,
                        isNew: true
                    })

                    let tableDataToAdd = props.tableData.map(item => item)
                    tableDataToAdd.unshift({ // push to state used in the table
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        positiontitle: positiontitle.current.value,
                        agency: agency.current.value,
                        salary: salary.current.value,
                        salgrade: salgrade.current.value,
                        status: status.current.value,
                        govt: govt.current.value,
                        work_experience_sheet: workExperienceSheet,
                        rowId: rowId + 1,
                        isNew: true
                    })
                    if (props.page !== 1) {
                        toast.success('new record added!')
                    }
                    else {
                        let newTableDataToAdd = tableDataToAdd.slice(0, props.perPage)
                        props.setTableData(newTableDataToAdd)
                    }
                    props.setPageTotal(record.length)
                    props.setWorkExperienceRecord(recordToAdd)
                    props.setWorkExperience(record)
                    props.handleClose()
                }
                else {
                    return
                }
            })
        }
    }

    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', px: 2 }}>
            <form onSubmit={handleAddEligibility}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
                    <Typography sx={{ color: blue[800], textAlign: 'center', fontSize: '.8rem', zIndex: 50 }}>INCLUSIVE DATES (mm/dd/yyy)</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            sx={{ width: '100%' }}
                            label="FROM"
                            value={datefrom}
                            onChange={(newValue) => {
                                setDatefrom(newValue)
                            }}
                            renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                disabled={isPresent}
                                sx={{ width: '100%' }}
                                label="TO"
                                value={dateto}
                                onChange={(newValue) => {
                                    setDateto(newValue)
                                }}
                                renderInput={(params) => <TextField required={isPresent ? false : true} fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={isPresent} />} onChange={() => setIsPresent(!isPresent)} label="PRESENT" />
                        </FormGroup>
                    </Box>
                    <TextField required variant='filled' label='POSITION TITLE (Write in full/Do not abbreviate)' fullWidth inputRef={positiontitle} />
                    <TextField required variant='filled' label='DEPARTMENT/AGENCY/OFFICE/COMPANY (Write in full/Do not abbreviate)' fullWidth inputRef={agency} />
                    <TextField required variant='filled' label='MONTHLY SALARY' fullWidth inputRef={salary} type="number" inputProps={{step:'.01'}} />
                    <TextField required variant='filled' label='SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT' fullWidth inputRef={salgrade} />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">STATUS OF APPOINTMENT</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue='PERMANENT'
                            inputRef={status}
                            label="STATUS OF APPOINTMENT"
                            variant='filled'
                        // onChange={handleChange}
                        >
                            <MenuItem value='PERMANENT'>PERMANENT</MenuItem>
                            <MenuItem value='TEMPORARY'>TEMPORARY</MenuItem>
                            <MenuItem value='PRESIDENTIAL APPOINTEE'>PRESIDENTIAL APPOINTEE</MenuItem>
                            <MenuItem value='CO-TERMINOUS'>CO-TERMINOUS</MenuItem>
                            <MenuItem value='CONTRACTUAL'>CONTRACTUAL</MenuItem>
                            <MenuItem value='CASUAL'>CASUAL</MenuItem>
                            <MenuItem value='JOB ORDER'>JOB ORDER</MenuItem>
                            <MenuItem value='CONSULTANT'>CONSULTANT</MenuItem>
                            <MenuItem value='CONTRACT OF SERVICE'>CONTRACT OF SERVICE</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Government</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={1}
                            inputRef={govt}
                            label="Government"
                            variant='filled'
                        // onChange={handleChange}
                        >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={0}>No</MenuItem>
                        </Select>
                    </FormControl>

                    {file ? (
                        <Typography sx={{ color: red[500] }}>...{file && file.name.slice(Math.max(file.name.length - 15, 1))} <HighlightOffIcon sx={{ cursor: 'pointer', color: '#5c5c5c', '&:hover': { color: red[500] } }} onClick={() => setFile('')} /></Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button variant="outlined" component="span" sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' } }}>
                                <AttachFileIcon /> {matches ? 'File' : 'Attach file'}
                            </Button>
                        </label>
                    </Box>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body1" color="primary" align="center" gutterBottom>Work Experience Sheet</Typography>
                            <Box display="flex" sx={{ gap: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        sx={{ width: '100%' }}
                                        label="FROM"
                                        value={workExperienceSheet.from}
                                        views={["year", "month"]}
                                        onChange={(newValue) => {
                                            setWorkExperienceSheet({ ...workExperienceSheet, from: newValue })
                                        }}
                                        renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                                    />
                                    <DatePicker
                                        sx={{ width: '100%' }}
                                        label="TO"
                                        views={["year", "month"]}
                                        name="to"
                                        value={workExperienceSheet.to}
                                        onChange={(newValue) => {
                                            setWorkExperienceSheet({ ...workExperienceSheet, to: newValue })
                                        }}
                                        renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <TextField
                                id=""
                                label="Position Title"
                                name="position"
                                value={workExperienceSheet.position}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                            <TextField
                                id=""
                                label="Name of Office/Unit"
                                name="nameOfOffice"
                                value={workExperienceSheet.nameOfOffice}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                            <TextField
                                id=""
                                label="Immediate Supervisor"
                                name="immediateSupervisor"
                                value={workExperienceSheet.immediateSupervisor}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                            <TextField
                                id=""
                                label="Name of Agency/Organization and Location"
                                name="nameOfAgency"
                                value={workExperienceSheet.nameOfAgency}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                            <TextField
                                id=""
                                label="List of Accomplishments and Contributions (if any), use comma (,) to separate each"
                                multiline
                                placeholder='Use comma (,) to separate each accomplishments'
                                rows={4}
                                name="listOfAccomplishments"
                                value={workExperienceSheet.listOfAccomplishments}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                            <TextField
                                id=""
                                label="Summary of Actual Duties"
                                multiline
                                rows={4}
                                name="actualDuties"
                                value={workExperienceSheet.actualDuties}
                                onChange={handleChangeWorkExperienceSheet}
                            />
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                </Box>
            </form>
        </Box>
    )
}

export default Add