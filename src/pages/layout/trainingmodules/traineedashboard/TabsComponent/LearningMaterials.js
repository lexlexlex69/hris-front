import React,{useEffect, useState} from 'react';
import {Grid,Paper,IconButton,TableContainer,Table,TableRow,TableHead,TableBody,Tooltip,Modal,Box,Typography,Fade,Alert, Button} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {getLearningMaterials } from '../TraineeDashboardRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {green,orange,grey,blue} from '@mui/material/colors';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Swal from 'sweetalert2';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
// import { socket,enabledSocket } from '../../../../request/SocketIO';
import { toast } from 'react-toastify';
import TableLoading from '../../../loader/TableLoading';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function LearningMaterials(props){
    // useEffect(()=>{
    //     if(enabledSocket){
    //         socket.on('connection');
    //         socket.on("update-training-materials-channel", function(message){
    //             // console.log(message)
    //             setData(message.data.data)
    //             toast.info('Learning materials updated')
    //         });
    //     }
    //   },[])
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoadingData,setIsLoadingData] = useState(true)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 345:600,
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };
    const [data,setData] = useState([])
    useEffect(()=>{
        var data2 = {
            id:props.data.training_details_id
        }
        getLearningMaterials(data2)
        .then(res=>{
            setData(res.data)
            setIsLoadingData(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const viewFile = (id,row_data) => {
        viewFileAPI(id,row_data.materials_name)
    }
    const handleRefresh = ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data',
            html:'Please wait...'
        })
        Swal.showLoading()
        var data2 = {
            id:props.data.training_details_id
        }
        getLearningMaterials(data2)
        .then(res=>{
            setData(res.data)
            Swal.fire({
                icon:'success',
                showConfirmButton:false,
                timer:1500
            })
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    return(
        <>
            {
                isLoadingData
                ?
                <TableLoading actionButtons={1}/>
                :
                    data.length === 0
                    ?
                    <Box>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mb:1}}>
                            <Tooltip title = 'Reload data'><IconButton color='primary' onClick={handleRefresh} className='custom-iconbutton'><ReplayOutlinedIcon/></IconButton></Tooltip>
                        </Box>
                        <Alert severity="info">Not available!</Alert>
                    </Box>
                    :
                    <Fade in>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Tooltip title = 'Reload data'><IconButton color='info' sx={{'&:hover':{color:'#fff',background:blue[700]}}} onClick={handleRefresh} className='custom-iconbutton'><ReplayOutlinedIcon/></IconButton></Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>
                                                        Name
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        Description
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        Action
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    data.length === 0
                                                    ?
                                                    <TableRow>
                                                        <StyledTableCell colSpan={3} align='center'>
                                                            No data
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    :
                                                    data.map((row,key)=>
                                                    <TableRow key={key}>
                                                        <StyledTableCell>
                                                            {row.materials_name}
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            {row.description}
                                                        </StyledTableCell>
                                                        <StyledTableCell align='center'>
                                                            {
                                                                matches
                                                                ?
                                                                <Tooltip title = 'View File Uploaded'><IconButton className='custom-iconbutton' color='info' onClick={()=>viewFile(row.file_id,row)}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>
                                                                :
                                                                <Tooltip title = 'View File Uploaded'><Button  variant='contained'className='custom-roundbutton' color='info' onClick={()=>viewFile(row.file_id,row)} startIcon={<ContentPasteSearchOutlinedIcon/>}> View File</Button></Tooltip>

                                                            }
                                                            
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Fade>
            }
        </>
        
    )
}