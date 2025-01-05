import React, { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { blue, green, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
import PdsSelect from '../customComponents/PdsSelect'

const Input = styled('input')({
    display: 'none',
});

function Add(props) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // 

    const [title, setTitle] = useState('')
    const rating = useRef('')
    const placeofexam = useRef('')
    const licenseno = useRef('')
    const [dateofexam, setDateofexam] = useState('')
    const [dateissue, setDateissue] = useState('')
    const [file, setFile] = useState('')

    const [others, setOthers] = useState(false)
    const [otherDate, setOtherDate] = useState('')

    // functions
    const handleAddEligibility = async (e) => {
        e.preventDefault();
        //console.log(title.current.value, rating.current.value, placeofexam.current.value, licenseno.current.value, dateissue, dateofexam, file)
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
            let recordToAdd = props.eligibilityRecord.map(item => item)
            let rowId = recordToAdd.length
            recordToAdd.push({ // push to record object
                title: title,
                rating: rating.current.value,
                placeofexam: placeofexam.current.value,
                licenseno: licenseno.current.value,
                dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                status: 2,
                rowId: rowId + 1,
                file_path: fileBase64,
                ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
            })

            let record = props.eligibility.map((item) => item)
            record.unshift({ // push to state used in the table
                title: title,
                rating: rating.current.value,
                placeofexam: placeofexam.current.value,
                licenseno: licenseno.current.value,
                dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                rowId: rowId + 1,
                isNew: true,
                file_path: fileBase64,
            })
            let tableDataToAdd = props.tableData.map((item) => item)
            tableDataToAdd.unshift({ // push to state used in the table
                title: title,
                rating: rating.current.value,
                placeofexam: placeofexam.current.value,
                licenseno: licenseno.current.value,
                dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                rowId: rowId + 1,
                file_path: fileBase64,
                isNew: true
            })

            if (props.page === 1) {
                let newTableData = tableDataToAdd.slice(0, props.perPage)
                props.setTableData(newTableData)
            }
            else {
                toast.success('new record added!')
            }
            props.setPageTotal(record.length)
            props.setEligibilityRecord(recordToAdd)
            props.setEligibility(record)
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
                    let recordToAdd = props.eligibilityRecord.map(item => item)
                    let rowId = recordToAdd.length
                    recordToAdd.push({ // push to record object
                        title: title,
                        rating: rating.current.value,
                        placeofexam: placeofexam.current.value,
                        licenseno: licenseno.current.value,
                        dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                        dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                        status: 2,
                        rowId: rowId + 1,
                        ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : '',
                        file_path: '',
                    })

                    let record = props.eligibility.map((item) => item)
                    record.unshift({ // push to state used in the table
                        title: title,
                        rating: rating.current.value,
                        placeofexam: placeofexam.current.value,
                        licenseno: licenseno.current.value,
                        dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                        dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                        rowId: rowId + 1,
                        file_path: '',
                        isNew: true
                    })

                    let tableDataToAdd = props.tableData.map((item) => item)
                    tableDataToAdd.unshift({ // push to state used in the table
                        title: title,
                        rating: rating.current.value,
                        placeofexam: placeofexam.current.value,
                        licenseno: licenseno.current.value,
                        dateofexam: moment(dateofexam).format('MM-DD-YYYY'),
                        dateissue: others ? otherDate : moment(dateissue).format('MM-DD-YYYY'),
                        file_path: '',
                        rowId: rowId + 1,
                        isNew: true
                    })

                    if (props.page === 1) {
                        let newTableData = tableDataToAdd.slice(0, props.perPage)
                        props.setTableData(newTableData)
                    }
                    else {
                        toast.success('new record added!')
                    }
                    props.setPageTotal(record.length)
                    props.setEligibilityRecord(recordToAdd)
                    props.setEligibility(record)
                    props.handleClose()
                }
                else {
                    return
                }
            })
        }
    }


    return (
        <Box sx={{ height: '100%', overflowY: 'scroll' }}>
            <form onSubmit={handleAddEligibility}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1, justifyContent: 'space-evenly', height: '70vh', px: 2 }}>
                    <PdsSelect title componentTitle='CAREER SERVICE' optionTitle='elig_title' url='/api/pds/eligibility/add/autoComplete' setTitle={setTitle} />
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', width: '100%' }}>
                        <TextField required variant='outlined' label='RATING (if applicable)' fullWidth inputRef={rating} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label="DATE of EXAMINATION / CONFERMENT"
                                value={dateofexam}
                                onChange={(newValue) => {
                                    setDateofexam(newValue)
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <TextField required variant='outlined' label='PLACE OF EXAMINATION' fullWidth inputRef={placeofexam} />
                    <Typography sx={{ color: green[500], textAlign: 'center' }}>LICENSE (If applicable)</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField variant='outlined' label='Number' fullWidth inputRef={licenseno} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {others ? (
                            <TextField variant='outlined' required label='Others (specify e.g. N/A or PRESENT)' fullWidth value={otherDate} onChange={(e) => setOtherDate(e.target.value)} inputProps={{ maxLength: 7 }} />
                        )
                            : (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        sx={{ width: '100%' }}
                                        // views={['year']}
                                        label="DATE OF VALIDITY"
                                        value={dateissue}
                                        onChange={(newValue) => {
                                            setDateissue(newValue)
                                        }}
                                        renderInput={(params) => <TextField fullWidth {...params} required helperText={null} />}
                                    />
                                </LocalizationProvider>
                            )}

                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={others} />} onChange={() => setOthers(prev => !prev)} label="Others" />
                        </FormGroup>
                    </Box>
                    {file ? (
                        <Typography sx={{ color: red[500] }}>...{file && file.name.slice(Math.max(file.name.length - 15, 1))} <HighlightOffIcon sx={{ cursor: 'pointer', color: '#5c5c5c', '&:hover': { color: red[500] } }} onClick={() => setFile('')} /></Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button variant="outlined" component="span" sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' } }}>
                                <AttachFileIcon />{matches ? 'File' : 'Attach file'}
                            </Button>
                        </label>
                    </Box>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                    {/* <Button variant="contained" color="error" onClick={props.handleClose}>Close</Button> */}
                </Box>
            </form>
        </Box>
    )
}

export default Add