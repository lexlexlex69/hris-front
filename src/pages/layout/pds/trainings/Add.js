import React, { useEffect, useState, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem'
import { blue, green, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import AsyncCreatableSelect from 'react-select/async-creatable';
import ReactSelect from 'react-select';
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// moment 
import moment from 'moment'
import axios from 'axios'
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

    const [titleState, setTitleState] = useState('')
    // component state refs and state
    const title = useRef('')
    const nohours = useRef('')
    const conducted = useRef('')
    const typeLD = useRef('')
    const [otherTypes, setOtherTypes] = useState(false)
    const [otherTypeLD, setOtherTypeLD] = useState('')
    const [datefrom, setDatefrom] = useState('')
    const [dateto, setDateto] = useState('')
    const [file, setFile] = useState('')

    // functions
    const handleAddTrainings = async (e) => {
        e.preventDefault();
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
            let recordToAdd = props.trainingsRecord.map(item => item)
            let rowId = recordToAdd.length
            recordToAdd.push({ // push to record object
                title: titleState,
                nohours: nohours.current.value,
                conducted: conducted.current.value,
                typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                datefrom: moment(datefrom).format('YYYY-MM-DD'),
                dateto: moment(dateto).format('MM-DD-YYYY'),
                status: 2,
                rowId: rowId + 1,
                file_path: fileBase64,
                ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
            })

            let record = props.trainings.map((item) => item)
            record.unshift({ // push to state used in the table
                title: titleState,
                nohours: nohours.current.value,
                conducted: conducted.current.value,
                typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                datefrom: moment(datefrom).format('MM-DD-YYYY'),
                dateto: moment(dateto).format('MM-DD-YYYY'),
                rowId: rowId + 1,
                file_path: fileBase64,
                isNew: true
            })
            let tableDataToAdd = props.tableData.map((item) => item)
            tableDataToAdd.unshift({ // push to state used in the table
                title: titleState,
                nohours: nohours.current.value,
                conducted: conducted.current.value,
                typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                datefrom: moment(datefrom).format('MM-DD-YYYY'),
                dateto: moment(dateto).format('MM-DD-YYYY'),
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
            props.setTrainingsRecord(recordToAdd)
            props.setTrainings(record)
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
                    let recordToAdd = props.trainingsRecord.map(item => item)
                    let rowId = recordToAdd.length
                    recordToAdd.push({ // push to record object
                        title: titleState,
                        nohours: nohours.current.value,
                        conducted: conducted.current.value,
                        typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                        datefrom: moment(datefrom).format('YYYY-MM-DD'),
                        dateto: moment(dateto).format('MM-DD-YYYY'),
                        status: 2,
                        rowId: rowId + 1,
                        file_path: fileBase64,
                        ext: file ? file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1) : ''
                    })

                    let record = props.trainings.map((item) => item)
                    record.unshift({ // push to state used in the table
                        title: titleState,
                        nohours: nohours.current.value,
                        conducted: conducted.current.value,
                        typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                        datefrom: moment(datefrom).format('MM-DD-YYYY'),
                        dateto: moment(dateto).format('MM-DD-YYYY'),
                        rowId: rowId + 1,
                        isNew: true
                    })

                    let tableDataToAdd = props.tableData.map((item) => item)
                    tableDataToAdd.unshift({ // push to state used in the table
                        title: titleState,
                        nohours: nohours.current.value,
                        conducted: conducted.current.value,
                        typeLD: otherTypes ? otherTypeLD : typeLD.current.value,
                        datefrom: moment(datefrom).format('MM-DD-YYYY'),
                        dateto: moment(dateto).format('MM-DD-YYYY'),
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
                    props.setTrainingsRecord(recordToAdd)
                    props.setTrainings(record)
                    props.handleClose()
                }
                else {
                    return
                }
            })
        }
    }


    return (
        <Box sx={{ px: 2, height: '100%', overflowY: 'scroll', pt: 2 }}>
            <form onSubmit={handleAddTrainings} style={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
                    <PdsSelect componentTitle='TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS' optionTitle='title_of_training' url='/api/pds/trainings/add/AutoComplete' setTitle={setTitleState} />
                    <Typography sx={{ color: blue[500], textAlign: 'center' }}>INCLUSIVE DATES</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', width: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                // views={['year']}
                                label="FROM"
                                value={datefrom}
                                onChange={(newValue) => {
                                    setDatefrom(newValue)
                                }}
                                renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                // views={['year']}
                                label="TO"
                                value={dateto}
                                onChange={(newValue) => {
                                    setDateto(newValue)
                                }}
                                renderInput={(params) => <TextField required fullWidth {...params} helperText={null} />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <TextField required variant='outlined' label='NUMBER OF HOURS' fullWidth type="number" InputProps={{ inputProps: { min: 1 } }} inputRef={nohours} />
                    <Box display='flex' gap={1}>
                        {otherTypes ? (
                            <TextField required variant='outlined' label='Other type LD' fullWidth value={otherTypeLD} onChange={(e) => setOtherTypeLD(e.target.value)} />
                        ) : (
                            <FormControl fullWidth>
                                <InputLabel id="elevel-select-label">Type LD</InputLabel>
                                <Select
                                    required
                                    labelId="typeLD-select-label"
                                    id="typeLD-select"
                                    defaultValue=""
                                    label="Type LD"
                                    inputRef={typeLD}
                                >
                                    <MenuItem value='MANAGERIAL'>MANAGERIAL</MenuItem>
                                    <MenuItem value='SUPERVISORY'>SUPERVISORY</MenuItem>
                                    <MenuItem value='TECHNICAL'>TECHNICAL</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={otherTypes} />} label="Others" onChange={() => setOtherTypes(prev => !prev)} />
                        </FormGroup>
                    </Box>

                    <TextField required variant='outlined' label='CONDUCTED/SPONSORED BY (write in full)' fullWidth inputRef={conducted} />
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
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                    </Box>
                </Box>

            </form>
        </Box>
    )
}

export default Add