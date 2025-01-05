import React,{useEffect, useState} from 'react';
import {Grid,Paper,IconButton,TableContainer,Table,TableRow,TableHead,TableBody,Tooltip,Modal,Box,Typography} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { deleteLearningMaterials, getLearningMaterials } from '../TrainingRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {green,orange,grey,blue} from '@mui/material/colors';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Swal from 'sweetalert2';
import DataTableLoader from '../../../loader/DataTableLoader';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddLearningMaterials from '../Modal/AddLearningMaterials';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 300:600,
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
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const [addModal,setAddModal] = useState(false);
    const updateData = (data)=>{
        setData(data.data)
        setAddModal(false)
    }
    const viewFile = (id,name) => {
        viewFileAPI(id,name)
    }
    const handleDelete = (data)=>{
        Swal.fire({
            icon:'info',
            title: 'Confirm delete',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:`Cancel` 
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    training_materials_id:data.training_materials_id,
                    training_details_id:data.training_details_id
                }
                deleteLearningMaterials(data2)
                .then(res=>{
                    console.log(res.data)
                    if(res.data.status === 200){
                        updateData(res.data)
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
                })
            }
          })
        
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Tooltip title = 'Add Learning Materials'><IconButton color='primary' onClick = {()=>setAddModal(true)} className='custom-iconbutton'><AddOutlinedIcon/></IconButton></Tooltip>
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
                                            {row.materials_name}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                            <Tooltip title = 'View File Uploaded'><IconButton color='primary' className='custom-iconbutton' onClick={()=>viewFile(row.file_id,row.materials_name)}><ContentPasteSearchOutlinedIcon/></IconButton></Tooltip>

                                            <Tooltip title= 'Delete'><IconButton color='error'className='custom-iconbutton' onClick = {()=>handleDelete(row)}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Modal
                open={addModal}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setAddModal(false)}/>

                    <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                        Adding Learning Materials
                    </Typography>
                    <Box sx={{mt:2,pt:0,pl:matches?2:4,pr:matches?2:4,pb:2,maxHeight:'70vh',overflowY:'scroll'}}>
                        <AddLearningMaterials data = {props.data} updateData = {updateData} close={()=> setAddModal(false)}/>
                    </Box>
                </Box>
            </Modal>
        </Grid>
    )
}