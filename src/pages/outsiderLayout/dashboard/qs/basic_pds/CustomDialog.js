import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const CustomDialog = ({ children, open, handleClose, fullScreen, specifyWidth,forUpdate }) => {
    // media query
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    return (
        <Dialog
            fullScreen
              sx={{ width: fullScreen ? '100vw' : matches ? '100vw' : specifyWidth ? specifyWidth : '40vw',marginLeft: matches ? 0 :'60vw' }}
            open={open}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', zIndex: 1500, width: {xs:'100vw',md:'40vw'},bgcolor: forUpdate ? 'warning.light' : ''}}>
                <Toolbar>
                    <Box display="" mx="" my="" sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <Button autoFocus color="inherit" onClick={handleClose} startIcon={<CloseIcon />}>
                            close
                        </Button>
                    </Box>

                </Toolbar>
            </AppBar>
            <Box sx={{ height: 'calc(100%-66px)', overflowY: 'scroll', width: {xs:'100vw',md:'40vw'} }}>
                {children}
            </Box>
        </Dialog>
    );
};

export default CustomDialog;