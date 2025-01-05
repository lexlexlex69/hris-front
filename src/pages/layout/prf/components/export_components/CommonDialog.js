import { Backdrop, Box, Fade, Modal, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

function CommonDialog({ open, setOpen, customWidth, title, children }) {
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
                            {title ? <Typography id="transition-modal-title" textAlign='left' variant="h6" component="h2"> {title} </Typography> : <></>}
                            <CloseIcon onClick={setOpen} color="error" sx={{ cursor: 'pointer' }}></CloseIcon>
                        </Box>
                        {children}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default CommonDialog