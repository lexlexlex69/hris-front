import React, { useEffect, useState, useRef } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
import SaveAltIcon from '@mui/icons-material/SaveAlt';


function ChildrenModal(props) {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // component state
    const childname = useRef('')
    const dob = useRef('')
    const handleAddChild = (event) => {
        event.preventDefault();
        let child = props.familyState.children.map((item) => item)
        let rowId = props.children.length
        //    return
        child.unshift({
            child_name: childname.current.value.toUpperCase(),
            dob: dob.current.value,
            isNew: true,
            rowId: rowId + 1 + '_x'
        })
        let childToAdd = props.children.map(item => item)
        childToAdd.push({
            child_name: childname.current.value.toUpperCase(),
            dob: dob.current.value,
            status: 2,
            rowId: rowId + 1
        })
        //console.log(child)
        props.setChildren(childToAdd)
        props.setFamilyState({ ...props.familyState, children: child })
        props.handleClose()
    }

    return (
        <Box>
            <form onSubmit={handleAddChild}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row' }}>
                    <TextField variant='filled' required InputProps={{ inputProps: { minLength: 3,sx: { textTransform: 'uppercase' } } }} label='Child Name' fullWidth inputRef={childname} />
                    <TextField variant='filled' required focused type={'date'} label='Date of Birth' fullWidth inputRef={dob} />
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" type="submit" color="primary" startIcon={<SaveAltIcon />}>Save info</Button>
                    {/* <Button variant="contained" color="error" onClick={props.handleClose}>Close</Button> */}
                </Box>
            </form>
        </Box>
    )
}

export default ChildrenModal