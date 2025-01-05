import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '2rem',
    boxShadow: 24,
    p: 4,
    pt: 2,
};

const DeclineInputs = ({ open, close, data, updates, setState }) => {



    const [reason, setReason] = useState('')
    const handleDecline = async (e) => {
        e.preventDefault()
        Swal.fire({
            text: 'Declining entry . . .',
            icon: 'warning'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/pds/common/storeDeclinedEntriesInputs`, { data: data, reason: reason })
        Swal.close()
        setReason('')
        if (res.data.status === 200) {
            toast.success('Declining entry success!', { autoClose: 300 })
            let newObj = Object.assign({}, updates)
            delete newObj[data.table_field]
            setState(newObj)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message, { autoClose: 850 })
        }
        close()
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Box display='flex' justifyContent='flex-end' mb={3}>
                        <Button variant="text" color="primary" onClick={() => close()} >
                            <CloseIcon color="error" />
                        </Button>
                    </Box>
                    <form onSubmit={handleDecline}>
                        <TextField
                            fullWidth
                            id=""
                            label="Reason for declining"
                            multiline
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                        <Box mt={1} display='flex' justifyContent='flex-end'>
                            <Button variant="contained" color="primary" type='submit' sx={{ borderRadius: '1rem' }}>
                                submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default DeclineInputs;