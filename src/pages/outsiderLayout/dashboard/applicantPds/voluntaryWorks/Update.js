import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// import PropTypes from 'prop-types';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForward from '@mui/icons-material/ArrowForward';

import axios from 'axios';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import CustomBackdrop from '../../qs/CustomBackdrop';

import { PdsContext } from '../MyContext';
import { Close } from '@mui/icons-material';


let filterTimeout = null
const Update = ({ voluntary, setVoluntary, handleClose, total, setTotal, item }) => {
    const { contextId } = useContext(PdsContext) || '' // temporary contextId
    const [inputState, setInputState] = useState({
        id: item.id,
        organization: item.organization,
        datefrom: item.datefrom,
        dateto: item.dateto,
        nohrs: item.nohrs,
        positionwork: item.positionwork,
        file_path: ''
    })
    const [present, setPresent] = useState(item.dateto === 'PRESENT' ? true : false)

    const [imgPreview, setImgPreview] = useState('')

    const handleChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleUpload = (e) => {
        setInputState(prev => ({ ...prev, file_path: e.target.files[0] }))
        setImgPreview(URL.createObjectURL(e.target.files[0]))
    }

    // backdrop states
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const handleOpenBackdrop = () => setOpenBackdrop(true)
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (inputState.file_path) {
            const allowedExt = ['jpg', 'png', 'jpeg', 'pdf']
            if (!allowedExt.includes(inputState.file_path.name.slice((Math.max(0, inputState.file_path.name.lastIndexOf(".")) || Infinity) + 1))) {
                toast.warning('Invalid file extension')
                return
            }
        }
        let formData = new FormData()

        if (!inputState.file_path) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Continue without attaching a file",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    handleOpenBackdrop()
                    Swal.showLoading()
                    formData.append('id', item.id)
                    formData.append('organization', inputState.organization)
                    formData.append('datefrom', inputState.datefrom)
                    formData.append('dateto', present ? 'PRESENT' : inputState.dateto)
                    formData.append('nohrs', inputState.nohrs)
                    formData.append('positionwork', inputState.positionwork)
                    formData.append('file_path', '')
                    formData.append('contextId', contextId)  // temporary contextId
                    let res = await axios.post(`/api/recruitment/applicant/pds/voluntary/updateVoluntary`, formData)
                    handleCloseBackdrop()
                    Swal.close()
                    if (res.data.status === 200) {
                        let tempVoluntary = voluntary.map(x => x.id === item.id ? {
                            ...x,
                            organization: inputState.organization,
                            datefrom: inputState.datefrom,
                            dateto: present ? 'PRESENT' : inputState.dateto,
                            nohrs: inputState.nohrs,
                            positionwork: inputState.positionwork,
                            // file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                            isUpdated: true
                        } : x)
                        setVoluntary(tempVoluntary)

                        toast.success('Updated!',{autoClose:1000})
                        handleClose()
                        if (total % 5 == 0)
                            setTotal(prev => prev + 1)
                    }
                    else if (res.data.status === 500) {
                        toast.error(res.data.message)
                    }
                }
            })
        }
        else {
            handleOpenBackdrop()
            formData.append('id', item.id)
            formData.append('organization', inputState.organization)
            formData.append('datefrom', inputState.datefrom)
            formData.append('dateto', present ? 'PRESENT' : inputState.dateto)
            formData.append('nohrs', inputState.nohrs)
            formData.append('positionwork', inputState.positionwork)
            formData.append('file_path', inputState.file_path)
            formData.append('contextId', contextId)  // temporary contextId
            let res = await axios.post(`/api/recruitment/applicant/pds/voluntary/updateVoluntary`, formData)
            Swal.close()
            handleCloseBackdrop()
            if (res.data.status === 200) {
                let tempVoluntary = voluntary.map(x => x.id === item.id ? {
                    ...x,
                    organization: inputState.organization,
                    datefrom: inputState.datefrom,
                    dateto: present ? 'PRESENT' : inputState.dateto,
                    nohrs: inputState.nohrs,
                    positionwork: inputState.positionwork,
                    file_path: inputState.file_path ? URL.createObjectURL(inputState.file_path) : '',
                    isUpdated: true
                } : x)
                setVoluntary(tempVoluntary)
                toast.success('Updated!',{autoClose:1000})
                handleClose()
                if (total % 5 == 0)
                    setTotal(prev => prev + 1)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }

    }

    return (
        <Container >
            <CustomBackdrop open={openBackdrop} handleOpen={handleOpenBackdrop} handleClose={handleCloseBackdrop} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 66px)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, mt: 2 }}>
                    <TextField
                        id=""
                        label="ORGANIZATION"
                        fullWidth
                        size='small'
                        name="organization"
                        onChange={handleChange}
                        value={inputState.organization}
                    />
                    <TextField
                        id=""
                        label="From"
                        fullWidth
                        size='small'
                        type='date'
                        name="datefrom"
                        onChange={handleChange}
                        value={inputState.datefrom}
                        required
                        focused
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            id=""
                            label="To"
                            fullWidth
                            disabled={present}
                            size='small'
                            type='date'
                            focused
                            name="dateto"
                            required
                            onChange={handleChange}
                            value={inputState.dateto}
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={present} />} onChange={() => setPresent(prev => !prev)} label="PRESENT" />
                        </FormGroup>
                    </Box>
                    <TextField
                        id=""
                        label="NUMBER OF HOURS"
                        fullWidth
                        size='small'
                        name="nohrs"
                        onChange={handleChange}
                        value={inputState.nohrs}
                    />
                    <TextField
                        id=""
                        label="POSITION / NATURE OF WORK"
                        fullWidth
                        size='small'
                        name="positionwork"
                        onChange={handleChange}
                        value={inputState.positionwork}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            {inputState.file_path?.name && (
                                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Typography variant="body1" color="initial">{inputState.file_path?.name?.length > 20 ? <>. . .{inputState.file_path?.name?.slice(inputState.file_path?.name?.length - 15, -1)}</> : inputState.file_path?.name}</Typography>
                                    <Close sx={{ bgcolor: 'error.main', color: '#fff', borderRadius: '100%', fontSize: 20, ml: 1, cursor: 'pointer' }} onClick={() => setInputState(prev => ({ ...prev, file_path: '' }))} />
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" component="label" startIcon={<AttachFileIcon />} sx={{ borderRadius: '2rem' }} >
                                Upload file
                                <input hidden accept="image/*" type="file" onChange={handleUpload} />
                            </Button>
                        </Box>
                    </Box>
                    {/* <img src={imgPreview} /> */}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', pb: 2 }}>
                    <Button variant="contained" color="warning" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} type="submit">
                        Update
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default React.memo(Update);
