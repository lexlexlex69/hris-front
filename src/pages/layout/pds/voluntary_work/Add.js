import React, { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { blue, green, red, yellow } from '@mui/material/colors'
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

    const organization = useRef('')
    const nohrs = useRef('')
    const positionwork = useRef('')

    const [present, setPresent] = useState(false)

    // functions
    const handleAddVoluntary = async (e) => {
        e.preventDefault();
        //console.log(organization.current.value, datefrom, dateto, nohrs.current.value, positionwork.current.value)
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
            let recordToAdd = props.voluntaryRecord.map(item => item)
            let rowId = recordToAdd.length
            recordToAdd.push({ // push to record object
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                organization: organization.current.value,
                nohrs: nohrs.current.value,
                positionwork: positionwork.current.value,
                status: 2,
                rowId: rowId + 1,
                file_path: fileBase64,
                ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
            })

            let record = props.voluntary.map((item) => item)
            record.unshift({ // push to state used in the table
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                organization: organization.current.value,
                nohrs: nohrs.current.value,
                rowId: rowId + 1,
                positionwork: positionwork.current.value,
                file_path: fileBase64,
                isNew: true
            })

            let tableDataToAdd = props.tableData.map(item => item)
            tableDataToAdd.unshift({ // push to state used in the table
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                organization: organization.current.value,
                nohrs: nohrs.current.value,
                positionwork: positionwork.current.value,
                rowId: rowId + 1,
                file_path: fileBase64,
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
            props.setVoluntaryRecord(recordToAdd)
            props.setVoluntary(record)
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
                    let recordToAdd = props.voluntaryRecord.map(item => item)
                    let rowId = recordToAdd.length
                    recordToAdd.push({ // push to record object
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        organization: organization.current.value,
                        nohrs: nohrs.current.value,
                        positionwork: positionwork.current.value,
                        status: 2,
                        rowId: rowId + 1,
                        file_path: fileBase64,
                        ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
                    })

                    let record = props.voluntary.map((item) => item)
                    record.unshift({ // push to state used in the table
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        organization: organization.current.value,
                        nohrs: nohrs.current.value,
                        positionwork: positionwork.current.value,
                        rowId: rowId + 1,
                        isNew: true
                    })

                    let tableDataToAdd = props.tableData.map(item => item)
                    tableDataToAdd.unshift({ // push to state used in the table
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: present ? 'PRESENT' : moment(dateto).format('YYYY-MM-DD'),
                        organization: organization.current.value,
                        nohrs: nohrs.current.value,
                        positionwork: positionwork.current.value,
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
                    props.setVoluntaryRecord(recordToAdd)
                    props.setVoluntary(record)
                    //console.log(recordToAdd, record)
                    props.handleClose()
                }
                else {
                    return
                }
            })
        }
    }

    return (
        <Box sx={{ height: '100%', overflowY: 'scroll', px: 2, pt: 2 }}>
            <form onSubmit={handleAddVoluntary}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 2, justifyContent: 'space-evenly', height: '70vh' }}>
                    <TextField required variant='filled' label='NAME AND ADDRESS OF ORGANIZATION' fullWidth inputRef={organization} />
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
                                disabled={present}
                                sx={{ width: '100%' }}
                                label="TO"
                                value={dateto}
                                onChange={(newValue) => {
                                    setDateto(newValue)
                                }}
                                renderInput={(params) => <TextField required={present ? false : true} fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={present} />} onChange={() => setPresent(prev => !prev)} label="Present" />
                        </FormGroup>
                    </Box>
                    <TextField required variant='filled' label='NUMBER OF HOURS' fullWidth inputRef={nohrs} />
                    <TextField required variant='filled' label='POSITION/NATURE OF WORK' fullWidth inputRef={positionwork} />
                    {file ? (
                        <Typography sx={{ color: red[500] }}>...{file && file.name.slice(Math.max(file.name.length - 15, 1))} <HighlightOffIcon sx={{ cursor: 'pointer', color: '#5c5c5c', '&:hover': { color: red[500] } }} onClick={() => setFile('')} /></Typography>
                    ) : null}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*,.pdf" id="contained-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button variant="outlined" component="span" sx={{ '&:hover': { bgcolor: blue[500], color: '#fff' } }}>
                                <AttachFileIcon /> {matches ? 'File' : 'Attach file'}
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