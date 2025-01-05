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
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
// moment 
import moment from 'moment'
// external imports
import { convertTo64 } from '../../customFunctions/CustomFunctions'

const Input = styled('input')({
    display: 'none',
});

function Add(props) {
    //console.log(props)
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // component state refs and state
    const RefName = useRef('')
    const RefAddress = useRef('')
    const RefTel = useRef('')

    // functions
    const handleAddReference = async (e) => {
        e.preventDefault();
        let recordToAdd = props.referencesRecord.map(item => item)
        let rowId = recordToAdd.length
        recordToAdd.push({ // push to record object
            RefName: RefName.current.value,
            RefAddress: RefAddress.current.value,
            RefTel: RefTel.current.value,
            status: 2,
            rowId: rowId + 1,
        })

        let record = props.references.map((item) => item)
        record.unshift({ // push to state used in the table
            RefName: RefName.current.value,
            RefAddress: RefAddress.current.value,
            RefTel: RefTel.current.value,
            rowId: rowId + 1,
            isNew: true
        })

        props.setReferencesRecord(recordToAdd)
        props.setReferences(record)
        props.handleClose()
        props.setCounter(prev => prev + 1)

    }

    return (
        <Box>
            <form onSubmit={handleAddReference}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 1 }}>
                    <TextField required variant='filled' label="COMPLETE NAME" fullWidth inputRef={RefName} />
                    <TextField required variant='filled' label="ADDRESS" fullWidth inputRef={RefAddress} />
                    <TextField required variant='filled' type="number" label="TEL NO" fullWidth inputRef={RefTel} />
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