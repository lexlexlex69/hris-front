import React, { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import Fade from '@mui/material/Fade'
import Skeleton from '@mui/material/Skeleton'
import DeleteIcon from '@mui/icons-material/Delete';
import { PdsContext, AddReference } from '../../MyContext';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomBackdrop from '../../../qs/CustomBackdrop';



const Add = ({ setLoader, setReferences, references, handleClose }) => {
    const { contextId } = useContext(PdsContext) || '' // temporary contextId

    const [customBackdrop, setCustomBackdrop] = useState(false)
    const [inputState, setInputState] = useState({
        refName: '',
        refAddress: '',
        refTel: '',
        contextId: contextId
    })

    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e) => {
       
        e.preventDefault()
        setLoader(true)
        setCustomBackdrop(true)
        let res = await axios.post(`/api/recruitment/applicant/pds/references/addReference`, inputState)
        console.log(res)
        if (res.data.status === 200) {
            setReferences(prev => [...prev, {
                id: res.data.id,
                RefName: inputState.refName,
                RefAddress: inputState.refAddress,
                RefTel: inputState.refTel,
            }])
            setCustomBackdrop(false)
            handleClose()
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setLoader(false)
    }
    return (
        <form onSubmit={handleSubmit}>
            <CustomBackdrop open={customBackdrop} title="Processing, please wait . . ." />
            <Box display='flex' flexDirection='column' justifyContent='space-between' sx={{ px: 2, height: 'calc(100vh - 66px)' }}>
                <Box display='flex' gap={2} flexDirection='column' mt={2}>
                    <TextField
                        id=""
                        label="REFERENCE NAME"
                        size='small'
                        name='refName'
                        value={inputState.refName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        id=""
                        label="REFERENCE ADDRESS"
                        multiline
                        size='small'
                        rows={3}
                        value={inputState.refAddress}
                        name='refAddress'
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        id=""
                        size='small'
                        label="REFERENCE TELEPHONE NUMBER"
                        name='refTel'
                        value={inputState.refTel}
                        required
                        onChange={handleChange}
                    />
                </Box>
                <Box display='flex' justifyContent='flex-end' sx={{ mb: 2 }}>
                    <Button variant="contained" type='submit' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }} color="primary">
                        Submit
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default Add;