import { Modal,Box,Typography,Tooltip,IconButton } from "@mui/material";
import React from "react";
import { styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//Icons
import CloseIcon from '@mui/icons-material/Close';
import { blue } from "@mui/material/colors";

export default function FullModal({open,close,title,children}){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '99%',
        bgcolor: 'background.paper',
        // border: '2px solid #fff'
        boxShadow: 24,
        // p: 2,
    };
    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',background:blue[800],p:1}}>
                    <Typography id="modal-modal-title" sx={{color:'#fff'}} variant="h6">
                    {title}
                    </Typography>
                    <Tooltip title='Close'><IconButton color='error' size="small" onClick={close} sx={{background:'#fff','&:hover':{background:'#e5e5e5'}}}><CloseIcon fontSize="small"/></IconButton></Tooltip>
                </Box>
                <Box sx={{p:1}}>
                    {children}  
                </Box>
                
            </Box>
        </Modal>
    )
}