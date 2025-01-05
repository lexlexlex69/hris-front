import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

let timer = null

const AddEmployeeApplicant = ({ openDialog, handleClose, type, vacancyId, fetchShortList, setLoader2 }) => {

    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const [data, setData] = useState('')

    const autoCompleteChange = async (value) => {
        console.log(value)
        clearTimeout(timer)
        timer = setTimeout(async () => {
            let res = await axios.get(`/api/recruitment/jobPosting/status/pending?type=${type}&&filter=${value}`)
            setOptions(res.data);
            setData(value)
        }, 500)
    }

    const handleSubmit = async (e) => {
        setLoader(true)
        e.preventDefault()
        let res = await axios.post(`/api/recruitment/jobPosting/status/pending/addToList`, { type, id: data.id, vacancyId })
        setLoader(false)
        console.log(res)
        if (res.data.status === 503) {
            Swal.fire({
                text: res.data.message,
                icon: 'warning'
            })
        }
        else if (res.data.status === 500) {
            Swal.fire({
                text: res.data.message,
                icon: 'error'
            })
        }
        else if (res.data.status === 200) {
            toast.success(type + ' added to the list!')
            handleClose()
            let controller = new AbortController()
            if (type === 'employee') {
                setLoader2(prev => ({ ...prev, internal: true }))
            }
            else if (type === 'applicant') {
                setLoader2(prev => ({ ...prev, external: true }))
            }
            fetchShortList(controller)
        }
    }

    return (
        <Dialog open={openDialog}>
            {loader && <LinearProgress />}
            <form onSubmit={handleSubmit}>
                <DialogTitle>ADD [{type.toUpperCase()}] TO LIST</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Search for an employee and add it to the list for job/position vacancy.
                    </DialogContentText>
                    <Autocomplete
                        onChange={(e, v) => setData(v)}
                        id="asynchronous-demo"
                        fullWidth
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.fname + ' ' + option.mname + ' ' + option.lname}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                required
                                {...params}
                                label="Type name"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                onChange={e => autoCompleteChange(e.target.value)}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color="error" onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' color="primary" type="submit">Add to List</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddEmployeeApplicant;