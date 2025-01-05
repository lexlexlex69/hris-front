import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const index = ({ open, handleClose, title, children,customWidth,bgcolor }) => {

    return (
        <div>
            <Dialog
                fullScreen
                sx={{width:customWidth}}
                open={open}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative',bgcolor:bgcolor ||  'primary.main' }}>
                    <Toolbar sx={{display:'flex',justifyContent:'space-between'}}>
                        <Typography>{title}</Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box>
                    {children}
                </Box>
            </Dialog>
        </div>
    );
};

export default index;