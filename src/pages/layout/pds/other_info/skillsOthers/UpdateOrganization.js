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

const UpdateOrganization = (props) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const description = useRef('')

    // file state
    const handleUpdateTrainings = async () => { // make updates 

        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            description: checkChangedInputs(props.data.description, description.current.value, 'RefName'),
        }
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj) // remove all object properties with undefined value
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        //console.log(filteredValuesObj)
        // ater checking for undefined value, add the status and rowId
        filteredValuesObj.status = 0
        // filteredValuesObj.type_id = 3
        filteredValuesObj.rowId = props.data.id

        let recordToUpdate = props.organizationRecord.map(item => item)
        recordToUpdate.push(filteredValuesObj)
        //console.log(recordToUpdate)
        let organizationToUpdate = props.organization.map((item, index) => {
            if (item.id === props.data.id) {
                return {
                    ...item,
                    isUpdated: true,
                    description: description.current.value,
                }
            }
            else {
                return item
            }
        })
        props.setOrganizationRecord(recordToUpdate)
        props.setOrganization(organizationToUpdate)
        props.handleClose()
    }

    return (
        <Box>
            <Box>
                <Grid container spacing={1} >
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start' }}>
                        <TextField fullWidth label="MEMBER IN ASSOCIATION/ORGANIZATION" variant='filled' defaultValue={props.data.description} inputRef={description} />
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
export default UpdateOrganization

