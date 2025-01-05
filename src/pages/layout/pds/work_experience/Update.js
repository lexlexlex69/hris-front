import React, { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import { blue, green, red, yellow } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// moment
import moment from 'moment';
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
    // component state refs and state
    const [isPresent, setIsPresent] = useState(false)
    const positiontitle = useRef('')
    const agency = useRef('')
    const salary = useRef('')
    const salgrade = useRef('')
    const status = useRef('')
    const govt = useRef('')
    const [datefrom, setDatefrom] = useState(props.data.datefrom)
    const [dateto, setDateto] = useState(props.data.dateto)
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
        listOfAccomplishmentsArr: '',
    })

    const [defaultWorkExperienceSheet, setDefaultWorkExperienceSheet] = useState(JSON.parse(props.data.work_experience_sheet))

    const handleChangeWorkExperienceSheet = (e) => {
        setWorkExperienceSheet({ ...workExperienceSheet, [e.target.name]: e.target.value })
    }

    // make updates 
    const handleUpdate = async (e) => {
        e.preventDefault()

        if (workExperienceSheet?.listOfAccomplishments?.length > 0) {
            let listArr = workExperienceSheet.listOfAccomplishments.split(',')
            workExperienceSheet.listOfAccomplishmentsArr = listArr
        }
        else {
            workExperienceSheet.listOfAccomplishmentsArr = []
        }

        let filename = undefined
        let ext = undefined
        if (file) {
            filename = await convertTo64(file)
            ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        }
        // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
        let filterFalsyValuesObj = {
            positiontitle: checkChangedInputs(props.data.positiontitle, positiontitle.current.value, 'positiontitle'),
            agency: checkChangedInputs(props.data.agency, agency.current.value, 'agency'),
            salary: checkChangedInputs(props.data.salary, salary.current.value, 'salary'),
            salgrade: checkChangedInputs(props.data.salgrade, salgrade.current.value, 'salgrade'),
            status: checkChangedInputs(props.data.status, status.current.value, 'status'),
            govt: checkChangedInputs(props.data.govt, govt.current.value, 'govt'),
            datefrom: checkChangedInputs(props.data.datefrom, moment(datefrom).format('YYYY-MM-DD'), 'datefrom'),
            dateto: checkChangedInputs(props.data.dateto === 'PRESENT' ? 'PRESENT' : moment(props.data.dateto).format('YYYY-MM-DD'), isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'), 'dateto'),
            file_path: filename,
            work_experience_sheet: JSON.stringify(workExperienceSheet) === JSON.stringify(defaultWorkExperienceSheet) ? null : workExperienceSheet,
            ext: ext
        }
        console.log(filterFalsyValuesObj)
        // remove all object properties with undefined value
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj)
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        //console.log(filteredValuesObj)

        // ater checking for undefined value, add the status and rowId
        filteredValuesObj._status = 0
        filteredValuesObj.rowId = props.data.id

        let recordToUpdate = props.workExperienceRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        //console.log(recordToUpdate)
        let workExperienceToUpdate = props.workExperience.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    positiontitle: positiontitle.current.value,
                    agency: agency.current.value,
                    salary: salary.current.value,
                    salgrade: salgrade.current.value,
                    status: status.current.value,
                    govt: govt.current.value,
                    work_experience_sheet: workExperienceSheet,
                    datefrom: moment(datefrom).format('YYYY-MM-DD'),
                    dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })

        let newTableData = props.tableData.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    positiontitle: positiontitle.current.value,
                    agency: agency.current.value,
                    salary: salary.current.value,
                    salgrade: salgrade.current.value,
                    status: status.current.value,
                    govt: govt.current.value,
                    work_experience_sheet: workExperienceSheet,
                    datefrom: moment(datefrom).format('YYYY-MM-DD'),
                    dateto: isPresent ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                    file_path: filename,
                }
            }
            else {
                return item
            }
        })
        props.setWorkExperienceRecord(recordToUpdate)
        props.setWorkExperience(workExperienceToUpdate)
        props.setTableData(newTableData)
        props.handleClose()
    }

    useEffect(() => {
        if (props.data.dateto === 'PRESENT') {
            setIsPresent(true)
        }
        let newWorkExperience = JSON.parse(props.data.work_experience_sheet)
        setWorkExperienceSheet({
            from: newWorkExperience?.from,
            to: newWorkExperience?.to,
            position: newWorkExperience?.position,
            nameOfOffice: newWorkExperience?.nameOfOffice,
            immediateSupervisor: newWorkExperience?.immediateSupervisor,
            nameOfAgency: newWorkExperience?.nameOfAgency,
            actualDuties: newWorkExperience?.actualDuties,
            listOfAccomplishments: newWorkExperience?.listOfAccomplishments,
        })
    }, [props])
    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', px: 2 }}>
            <Box >
                <form onSubmit={handleUpdate}>
                    <Grid container spacing={1} >
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'flex-start' }}>
                            <Typography sx={{ color: blue[800], textAlign: 'center', fontSize: '.8rem', zIndex: 50 }}>INCLUSIVE DATES (mm/dd/yyy)</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="FROM"
                                            sx={{ flex: 1 }}
                                            value={datefrom}
                                            onChange={(newValue) => {
                                                setDatefrom(newValue)
                                            }}
                                            renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                                        />
                                    </LocalizationProvider>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', flex: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            disabled={isPresent}
                                            sx={{ flex: 1 }}
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
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField required variant='filled' label='POSITION TITLE (Write in full/Do not abbreviate)' defaultValue={props.data.positiontitle} fullWidth inputRef={positiontitle} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField required variant='filled' label='DEPARTMENT/AGENCY/OFFICE/COMPANY (Write in full/Do not abbreviate)' defaultValue={props.data.agency} fullWidth inputRef={agency} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField required variant='filled' label='MONTHLY SALARY' fullWidth defaultValue={props.data.salary} inputProps={{step:'.01'}} inputRef={salary} type="number" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField required variant='filled' label='SALARY/JOB/PAY GRADE(if applicable) & STEP (Formal*00-0)/INCREMENT' defaultValue={props.data.salgrade} fullWidth inputRef={salgrade} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">STATUS OF APPOINTMENT</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={props.data.status}
                                    inputRef={status}
                                    label="STATUS OF APPOINTMENT"
                                    variant='filled'
                                    required
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
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Government ?</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={props.data.govt}
                                    inputRef={govt}
                                    label="Government ?"
                                    variant='filled'
                                    required
                                >
                                    <MenuItem value={1}>Yes</MenuItem>
                                    <MenuItem value={0}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* <Typography sx={{ color: red[500] }}>{file && file.name}</Typography> */}
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                {props.data.file_path ? (
                                    <Tooltip title="view file">
                                        <Button variant="contained" startIcon={<AttachFileIcon sx={{ transform: 'rotate(30DEG)' }} />} onClick={() => handleViewFile(props.data.id, 'workexperience/viewAttachFile')}>
                                            View File
                                        </Button>
                                    </Tooltip>
                                ) : null}
                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                                    <Button variant={file ? 'contained' : 'outlined'} component="span" startIcon={props.data.file_path ? (<EditIcon />) : (<AttachFileIcon />)} color={props.data.file_path ? 'warning' : file ? 'success' : 'primary'} sx={{ '&:hover': { bgcolor: props.data.file_path ? yellow[800] : file ? green[500] : blue[800], color: '#fff' } }}>
                                        {props.data.file_path ? file ? 'FILE ADDED' : 'UPDATE FILE' : file ? 'FILE ADDED' : 'ADD FILE'}
                                    </Button>
                                </label>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Card sx={{ maxWidth: { xs: '100%', md: '50%' }, m: 'auto' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Typography variant="body1" color="primary" align='center' gutterBottom>Work Experience Sheet</Typography>
                                    <Box display="flex" sx={{ gap: 2 }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                sx={{ width: '100%' }}
                                                label="FROM"
                                                value={workExperienceSheet?.from}
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
                                                value={workExperienceSheet?.to}
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
                                        value={workExperienceSheet?.position}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                    <TextField
                                        id=""
                                        label="Name of Office/Unit"
                                        name="nameOfOffice"
                                        value={workExperienceSheet?.nameOfOffice}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                    <TextField
                                        id=""
                                        label="Immediate Supervisor"
                                        name="immediateSupervisor"
                                        value={workExperienceSheet?.immediateSupervisor}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                    <TextField
                                        id=""
                                        label="Name of Agency/Organization and Location"
                                        name="nameOfAgency"
                                        value={workExperienceSheet?.nameOfAgency}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                    <TextField
                                        id=""
                                        label="List of Accomplishments and Contributions (if any), use comma (,) to separate each"
                                        multiline
                                        placeholder='Use comma (,) to separate each accomplishments'
                                        rows={4}
                                        name="listOfAccomplishments"
                                        value={workExperienceSheet?.listOfAccomplishments}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                    <TextField
                                        id=""
                                        label="Summary of Actual Duties"
                                        multiline
                                        rows={4}
                                        name="actualDuties"
                                        value={workExperienceSheet?.actualDuties}
                                        onChange={handleChangeWorkExperienceSheet}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="contained" color="warning" type="submit" startIcon={<EditIcon />} > Update</Button>
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

