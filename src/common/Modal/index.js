import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'


const CommonModal = ({ open, setOpen, title, children, customWidth }) => {
    // console.log(open)
    return (
        <>
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
                        width: { xs: '95%', md: customWidth ? customWidth : '80%' },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '1rem',
                        p: 4,
                        pt: 1,
                    }}>
                        <Box display="flex" justifyContent='space-between' mb={1}>
                            <Typography id="transition-modal-title" textAlign='left' variant="h6" component="h2">
                                {title}
                            </Typography>
                            <CloseIcon onClick={() => setOpen(false)} color="error" sx={{ cursor: 'pointer' }}></CloseIcon>
                        </Box>
                        {children}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default CommonModal;