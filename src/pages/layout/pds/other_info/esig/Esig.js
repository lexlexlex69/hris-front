import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui icons
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import EditIcon from '@mui/icons-material/Edit'
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import { getEmployeeEsig,handleUpdate } from './Controller'

const Input = styled('input')({
    display: 'none',
});

function Esig() {
    // pdsParam
    const pdsParam = useParams()

    const [esig, setEsig] = useState('')
    const img = useRef('')
    const [file,setFile] = useState('')
    useEffect(() => {
        const controller = new AbortController()
        if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
            console.log('yes')
            getEmployeeEsig(pdsParam.id, setEsig, controller)
        }
        else {
            console.log('no')
            getEmployeeEsig('', setEsig, controller)
        }
    }, [])
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{position:'relative',pointerEvents:'none'}}>
                <Typography variant="h3" sx={{bgcolor:'error.main',color:'#fff',textAlign:'center',position:'absolute',width:'100%',top:'50%'}}>UNDER DEVELOPMENT</Typography>
                <Typography sx={{ p: 1, color: '#fff', mb: 1, bgcolor: '#62757f' }}>Electronic signatures</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,alignItems:'center' }}>
                        {/* <Button variant='contained'> <FingerprintIcon /> &nbsp;thumbmark</Button> */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {esig.path ? (
                                <img src={`data:${esig.mimeType};base64,${esig.path}`} alt="" ref={img} style={{border:'1px solid black',pointerEvents:'none'}} width="300" />
                            ) : <>
                                <ImageNotSupportedIcon sx={{ fontSize: '10rem', color: '#5c5c5c' }} />
                                <Typography sx={{ textAlign: 'center' }}>no image</Typography>
                            </>}

                        </Box>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button variant="contained" component="span" color={esig.path ? "warning" : "primary"}>
                                {esig.path ? (
                                    <>
                                <EditIcon /> &nbsp;Update signature
                                    </>
                                ) : (
                                    <>
                                <EditIcon /> &nbsp;Add e-signature
                                    </>
                                )}
                            </Button>
                        </label>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant='contained' color="success" sx={{ color: '#fff' }} onClick={() => handleUpdate('',file,esig.file ? esig.file.id : 0,esig.path ? 'update' : 'add',setFile)} startIcon={<SendAndArchiveIcon/>} size="small">Submit update</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default React.memo(Esig)