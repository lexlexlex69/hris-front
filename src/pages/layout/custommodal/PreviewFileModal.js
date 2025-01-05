import { Modal,Box,Typography,Tooltip,IconButton } from "@mui/material";
import React,{useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//Icons
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ReplayIcon from '@mui/icons-material/Replay';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { blue, grey } from "@mui/material/colors";

export default function PreviewFileModal({open,close,file,fileType,size}){
    useEffect(()=>{
        console.log(fileType)
    },[file])
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [fileScale,setFileScale] = useState(1)
    const [fileRotate,setFileRotate] = useState(0)
    const [isFullScreen,setIsFullScreen] = useState(true)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'99%':isFullScreen?'99%':size?size:500,
        height:isFullScreen?'99%':'auto',
        bgcolor: 'background.paper',
        // border: '2px solid #fff'
        boxShadow: 24,
        // p: 2,
    };
    const handleZoom = (type)=>{
        if(type==='in'){
            var t = fileScale+.1;
            console.log(t)
            setFileScale(t)
        }else{
            var t = fileScale-.1;
            // console.log(t)
            setFileScale(t)
        }
    }
    const handleRotate = () =>{
        var t = fileRotate+90;
        setFileRotate(t)
    }
    const handleClose = () =>{
        setFileScale(1)
        setFileRotate(0)
        // setIsFullScreen(false)
        close()
    }
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
                    Preview PDF File
                    </Typography>
                    <Tooltip title='Close'><IconButton color='error' size="small" onClick={handleClose} sx={{background:'#fff','&:hover':{background:'#e5e5e5'}}}><CloseIcon fontSize="small"/></IconButton></Tooltip>
                </Box>
                <Box sx={{p:1,height:'100%'}}>
                    {
                        fileType === 'pdf'
                        ?
                        <iframe src={file} width='100%' height='90%'/>
                        :
                        <Box sx={{display:'flex',justifyContent:'center',overflowY:'scroll',maxHeight:'70vh',position:'relative'}}>
                            <Box sx={{position:'fixed',right:'15px',zIndex:1,background:grey[400],borderRadius:'20px','&:hover':{background:grey[500]}}}>
                                <Tooltip title='Zoom In'><IconButton onClick={()=>handleZoom('in')}><ZoomInIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                                <Tooltip title='Zoom Out'><IconButton onClick={()=>handleZoom('out')}><ZoomOutIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                                <Tooltip title='Rotate'><IconButton onClick={handleRotate}><ReplayIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                                {
                                    isFullScreen
                                    ?
                                    <Tooltip title='Exit Full Screen'><IconButton onClick={()=>setIsFullScreen(false)}><FullscreenExitIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                                    :
                                    <Tooltip title='Full Screen'><IconButton onClick={()=>setIsFullScreen(true)}><FullscreenIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                                }
                                
                            </Box>
                            <Box>
                                {
                                    isFullScreen
                                    ?
                                    <img src={file} style={{width:'100%',scale:fileScale.toString(),rotate:fileRotate.toString()+'deg'}}/>
                                    :
                                    <img src={file} style={{width:'300px',scale:fileScale.toString(),rotate:fileRotate.toString()+'deg'}}/>

                                }
                            </Box>
                        </Box>
                    } 
                </Box>
                
            </Box>
        </Modal>
    )
}