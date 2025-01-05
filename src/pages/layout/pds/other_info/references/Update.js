import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import { blue, green, red, yellow } from '@mui/material/colors'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
// material icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';

// external imports
import { checkChangedInputs, filterFalsyValues, convertTo64, handleViewFile } from '../../customFunctions/CustomFunctions'

const Input = styled('input')({
    display: 'none',
});

const Update = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    // component state refs
    const organization = useRef('')
    const nohrs = useRef('')
    const positionwork = useRef('')

    const title = useRef('')
    const nohours = useRef('')
    const conducted = useRef('')
    const typeLD = useRef('')
    const [datefrom, setDatefrom] = useState(moment(new Date(props.data.datefrom)).format('MM/DD/YYYY'))
    const [dateto, setDateto] = useState(moment(new Date(props.data.dateto)).format('MM/DD/YYYY'))
    const [file, setFile] = useState('')
    const RefName = useRef('')
    const RefAddress = useRef('')
    const RefTel = useRef('')

    // file state
    const handleUpdateTrainings = async () => { // make updates 

        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            RefName: checkChangedInputs(props.data.RefName, RefName.current.value, 'RefName'),
            RefAddress: checkChangedInputs(props.data.RefAddress, RefAddress.current.value, 'RefAddress'),
            RefTel: checkChangedInputs(props.data.RefTel, RefTel.current.value, 'RefTel'),
        }
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj) // remove all object properties with undefined value
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        //console.log(filteredValuesObj)
        // ater checking for undefined value, add the status and rowId
        filteredValuesObj.status = 0
        filteredValuesObj.rowId = props.data.id

        let recordToUpdate = props.referencesRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        //console.log(recordToUpdate)
        let referencesToUpdate = props.references.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    RefName: RefName.current.value,
                    RefAddress: RefAddress.current.value,
                    RefTel: RefTel.current.value,
                }
            }
            else {
                return item
            }
        })

        props.setReferencesRecord(recordToUpdate)
        props.setReferences(referencesToUpdate)
        props.handleClose()
    }

    return (
        <Box>
            <Box>
                <Grid container spacing={1} >
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="NAME" variant='filled' defaultValue={props.data.RefName} inputRef={RefName} />
                        <TextField fullWidth label="ADDRESS" variant='filled' defaultValue={props.data.RefAddress} inputRef={RefAddress} />
                        <TextField fullWidth label="TEL NO" variant='filled' defaultValue={props.data.RefTel} inputRef={RefTel} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="warning" onClick={handleUpdateTrainings} startIcon={<EditIcon />} > Update</Button>
                            {/* <Button variant="contained" color="error" onClick={props.handleClose} > Close</Button> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}
export default Update

