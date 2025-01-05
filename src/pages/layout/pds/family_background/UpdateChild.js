import React, { useRef } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { blue, green, red } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// toastify
import { toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit';
import { checkChangedInputs, filterFalsyValues } from '../customFunctions/CustomFunctions';

const UpdateChild = React.memo((props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    // component state
    const childname = useRef(null)
    const dob = useRef(null)

    const handleUpdateChild = (e) => {
        e.preventDefault();

        let filterFalsyValuesObj = { // object to check for input changes, if input is change, object property will return the obj > value, is obj > undefined
            child_name: checkChangedInputs(props.data.child_name.toUpperCase(), childname.current.value.toUpperCase(), 'childname'),
            dob: checkChangedInputs(props.data.dob, dob.current.value, 'dob'),
        }
        console.log(filterFalsyValuesObj)
        let filteredValuesObj = filterFalsyValues(filterFalsyValuesObj) // remove all object properties with undefined value
        if (Object.keys(filteredValuesObj).length === 0) {
            toast.warning('No changes made!')
            return
        }
        // let child
        // props.familyState.children.filter((item, index) => {
        //     if (item.id === props.data.id) {
        //         child = { ...item, index: index + 1 }
        //         return
        //     }
        // })
        // console.log(child)
        let childToUpdate = props.children.map(item => item)
        childToUpdate.push({
            child_name: childname.current.value.toUpperCase(),
            dob: dob.current.value,
            status: 0,
            // rowId: child.id,
            rowId: props.data.id,
            child_old_value: props.data.child_name.toUpperCase(),
            dob_old_value: props.data.dob
        })
        //console.log(childToUpdate)

        let updatedChildren = props.familyState.children.map((item) => {
            if (item.id === props.data.id) {
                return { ...item, isUpdated: true, child_name: childname.current.value.toUpperCase(), dob: dob.current.value }
            }
            else {
                return item
            }
        })
        props.setChildren(childToUpdate)
        props.setFamilyState({ ...props.familyState, children: updatedChildren })
        props.handleClose()
    }

    return (
        <Box>
            <form onSubmit={handleUpdateChild}>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: matches ? 'column' : 'row', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <TextField variant='filled' required label='Child Name' defaultValue={props.data.child_name} inputProps={{ sx: { textTransform: 'uppercase' } }} fullWidth inputRef={childname} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <TextField variant='filled' required label='Date of birth' type="date" defaultValue={props.data.dob} focused fullWidth inputRef={dob} />
                    </Box>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="warning" type="submit" startIcon={<EditIcon />}>Update</Button>
                    {/* <Button variant="contained" color="error" onClick={props.handleClose} >Close</Button> */}
                </Box>
            </form>
        </Box>
    )
})
export default UpdateChild

