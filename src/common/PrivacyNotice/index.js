import React, { useState, useEffect } from 'react'
import { Box, Button, Divider } from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { viewFilesUsingPathOnly } from '../../pages/layout/pds/customFunctions/CustomFunctions';
import axios from 'axios';

const PrivacyNotice = ({ open, privacyCheck, setPrivacyCheck, handleClose, handleNext }) => {

    const [privacyNotice, setPrivacyNotice] = useState('')
    const retrivePrivacyFile = async () => { // get the privacy notice 
        let res = await axios.post(`/api/master-files/privacy/retrievePrivacyFile`, {})
        setPrivacyNotice(res.data)
    }

    useEffect(() => {
        retrivePrivacyFile()
    }, [])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: '40%' },
                    bgcolor: 'background.paper',
                    borderRadius: '2rem',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Box>
                        <Typography align='center' fontWeight={700}>PRIVACY NOTICE</Typography>
                        <Typography id="transition-modal-title" variant="body1" align='justify' mb={1}>
                            <Checkbox value={privacyCheck} disabled={!privacyNotice ? true : false} onChange={() => setPrivacyCheck(prev => !prev)} />
                            I agree to send my information to City Human Resource Management Office and use it according to their <Typography variant='body1' sx={{ cursor: 'pointer', '&:hover': { color: 'blue' }, pointerEvents: !privacyNotice ? 'none' : '' }} onClick={() => viewFilesUsingPathOnly(privacyNotice?.file_path, '/api/master-files/privacy/viewPrivacyFile')}><u> Privacy Notice.</u></Typography>
                        </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent='flex-end' gap={3} mt={2}>
                        <Button variant="contained" color="primary" disabled={!privacyCheck} onClick={handleNext}>
                            Continue
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleClose()}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PrivacyNotice;