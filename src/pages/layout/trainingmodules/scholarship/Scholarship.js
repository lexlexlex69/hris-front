import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import React, { useEffect,useState } from "react";
import { checkPermission } from '../../permissionrequest/permissionRequest';
import {useNavigate}from "react-router-dom";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardLoading from "../../loader/DashboardLoading";
import ModuleHeaderText from "../../moduleheadertext/ModuleHeaderText";
import { toast } from "react-toastify";

//Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import AttachmentIcon from '@mui/icons-material/Attachment';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import MediumModal from "../../custommodal/MediumModal";
import {AddScholarshipModal } from "./Modals/AddScholarshipModal";
import { deleteScholarship, getAllScholarship } from "./ScholarshipRequest";
import { viewFileAPI } from "../../../../viewfile/ViewFileRequest";
import { UpdateScholarshipModal } from "./Modals/UpdateScholarshipModal";
import moment from "moment";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors'
import Swal from "sweetalert2";
import { APILoading } from "../../apiresponse/APIResponse";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        padding:10,
        fontSize: 13,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        },
    }));
export const Scholarship = () =>{
    const navigate = useNavigate()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    useEffect(()=>{
        checkPermission(74)
        .then((response)=>{
            if(response.data){
                _init()
                setIsLoading(false)
                
            }else{
                navigate(`/${process.env.REACT_APP_HOST}`)
            }
        }).catch((error)=>{
            toast.error(error.message)
            console.log(error)
        })
       
    },[])
    const _init = async ()=>{
        const res = await getAllScholarship();
        setData(res.data.data)
    }
    const [openAddModal,setOpenAddModal] = useState(false);
    const [openUpdateModal,setOpenUpdateModal] = useState(false);
    const [selectedData,setSelectedData] = useState([])
    const handleUpdate = (row) =>{
        setSelectedData(row)
        setOpenUpdateModal(true)
    }
    const handleDelete = async(scholarship_id) =>{
        Swal.fire({
            icon:'warning',
            title:'Confirm Delete ?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                proceedDelete(scholarship_id)
            }
        })
    }
    const proceedDelete = async(scholarship_id) =>{
        try{
            APILoading('info','Deleting data','Please wait...')
            let t_data = {
                id:scholarship_id
            }
            const res = await deleteScholarship(t_data);
            if(res.data.status === 200){
                setData(res.data.data)
                Swal.close();
                toast.success(res.data.message)
            }else{
                Swal.close();
                toast.error(res.data.message)

            }
        }catch(err){
            toast.success(err)
            Swal.close();

        }
        // const id = toast.loading('Deleting data')
        // try{
        //     let t_data = {
        //         id:scholarship_id
        //     }
        //     const res = await deleteScholarship(t_data);
        //     if(res.data.status === 200){
        //         setData(res.data.data)
        //         toast.update(id,{
        //             render:res.data.message,
        //             type:'success',
        //             isLoading:false,
        //             autoClose:true
                    
        //         })
        //     }else{
        //         toast.update(id,{
        //             render:res.data.message,
        //             type:'success',
        //             isLoading:false,
        //             autoClose:true
                    
        //         })
        //     }
        // }catch(err){
        //     toast.update(id,{
        //         render:err,
        //         type:'error',
        //         isLoading:false,
        //         autoClose:true
                
        //     })
        // }
    }
    return (
        <React.Fragment>
        {
                isLoading
                ?
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                <DashboardLoading actionButtons={1}/>
                </Box>
                :
                <Box sx={{margin:'5px 10px 10px 10px'}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{margin:'0 0 10px 0'}}>
                                <ModuleHeaderText title = 'Scholarship'/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                                <Button variant="contained" className="custom-roundbutton" startIcon={<AddIcon/>} onClick={()=>setOpenAddModal(true)}>Add</Button>
                            </Box>
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
                                                    Sponsor
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    File
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    Link
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    Posted Until
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    Action
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.length>0
                                                ?
                                                    data.map((item,key)=>
                                                        <TableRow key = {key}>
                                                            <TableCell>
                                                                {item?.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item?.sponsor}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Tooltip title='View File'><IconButton className="custom-iconbutton" color="primary" onClick={()=>viewFileAPI(item.file_id)}><AttachmentIcon/></IconButton></Tooltip>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {item?.link&&<Tooltip title='Visit Link'><IconButton className="custom-iconbutton" color="info" href={item.link} target="_BLANK"><LinkIcon/></IconButton></Tooltip>}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.post_end_date).format('MMMM DD, YYYY')}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                                                <Tooltip title='Update'><Button color='success' variant="contained" className="custom-roundbutton" startIcon={<EditIcon/>} onClick={()=>handleUpdate(item)}>Update</Button></Tooltip>
                                                                <Tooltip title='Update'><Button color='error' variant="contained" className="custom-roundbutton" startIcon={<DeleteIcon/>} onClick={()=>handleDelete(item.scholarship_id)}>Delete</Button></Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">
                                                        No Data
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                    <MediumModal open = {openAddModal} close={()=>setOpenAddModal(false)} title='Adding new scholarship'>
                        <AddScholarshipModal setData={setData} close = {()=>setOpenAddModal(false)}/>
                    </MediumModal>
                    <MediumModal open = {openUpdateModal} close = {()=>setOpenUpdateModal(false)} title='Updating Info'>
                        <UpdateScholarshipModal data = {selectedData} setData = {setData} close = {()=>setOpenUpdateModal(false)}/>
                    </MediumModal>
                </Box>
        }
        </React.Fragment>
    )
}