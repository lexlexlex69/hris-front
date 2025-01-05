import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,Paper,CircularProgress, Tooltip, IconButton, Button, TextField, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllReservedTrainee, postTraineeReplacement } from "../TraineeApprovalRequest";
import { formatMiddlename } from "../../customstring/CustomString";
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { blue, grey } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import SmallestModal from "../../custommodal/SmallestModal";
import Swal from "sweetalert2";
import { APILoading, APIresult } from "../../apiresponse/APIResponse";
const Input = styled('input')({
    display: 'none',
});
export default function RequestReplacement(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[800],
        color: theme.palette.common.white,
        fontSize: matches?12:15,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: matches?10:13,
        },
    }));
    const [data,setData] = useState([])
    const [loadingData,setLoadingData] = useState([])
    const [openAttachmentModal,setOpenAttachmentModal] = useState(false)
    const closeAttachmentModal = () => setOpenAttachmentModal(false)
    useEffect(()=>{
        // console.log(props)
        /**
        Get all unapproved reserved trainee 
         */
        var t_data = {
            training_details_id:props.data.training_details[0].training_details_id,
            approved:false,
            dept_code:props.data.dept_code
        }
        getAllReservedTrainee(t_data)
        .then(res=>{
            setData(res.data.data)
            setLoadingData(false)
            // console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleSelect = (id) => {
        setOpenAttachmentModal(true)
        var t_data = {
            replace:props.selected,
            replacement:selected
        }
        console.log(t_data)
    }
    const [fileAttachment,setFileAttachment] = useState('');
    const [fileExtensions,setFileExtensions] = useState(['pdf','jpg','png','jpeg','docx','doc']);

    const handleSetFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(fileExtensions.includes(extension.toLowerCase())){
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setFileAttachment(fileReader.result)
            }
        }else{
            setFileAttachment('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF/Image or Image file.'
            })
        }
    }
    const [selected,setSelected] = useState([]);
    const handleSelectForReplacement = (id) =>{
        var index = selected.indexOf(id)
        if(index === -1){
            /**
            Insert data
             */
            var temp = [...selected];
            temp.push(id)
            setSelected(temp)
        }else{
            var temp = [...selected];
            temp.splice(index,1);
            setSelected(temp)
        }
    }
    const handleSubmit = async ()=>{
        try{
            APILoading('info','Submitting request','Please wait...')
            var t_data = {
                training_details_id:props.data.training_details[0].training_details_id,
                replace:props.selected,
                replacement:selected,
                file:fileAttachment,
                dept_code:props.data.dept_code
            }
            const res = await postTraineeReplacement(t_data)
            if(res.data.status === 200){
                closeAttachmentModal()
                props.close()
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
            console.log(res.data)
        }catch(err){
            console.log(err)
            Swal.fire({
                icon:'error',
                title:err
            })
        }
        
    }
    return(
        <Box>
            {
                loadingData
                ?
                <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
                    <CircularProgress/>
                    <Typography>Loading data...</Typography>
                </Box>
                :
                <Grid container>
                <Grid item xs={12} sx={{mt:1}}>
                    <Typography sx={{color:grey[600],fontStyle:'italic',fontSize:'.9rem',textAlign:'right'}}>* List of Reserved trainee</Typography>
                    {
                        data.length>0
                        ?
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>
                                                    Name
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Rate
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    Select
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                 data.map((item,key)=>
                                                    <TableRow key={key}>
                                                            <StyledTableCell>
                                                                {item.fname} {formatMiddlename(item.mname)} {item.lname}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.rate}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Checkbox checked={selected.includes(item.training_shortlist_id)} onChange = {()=>handleSelectForReplacement(item.training_shortlist_id)} disabled={selected.includes(item.training_shortlist_id) || selected.length < props.selected.length ?false:true}
                                                                />
                                                                {/* <Tooltip title='Select trainee'><Button startIcon={<CheckIcon/>} variant="contained" color='success' onClick={()=>handleSelect(item.training_shortlist_id)}> select</Button></Tooltip> */}
                                                            </StyledTableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{display:'flex',justifyContent:'flex-end',p:1}}>
                                    <Button variant="contained" onClick = {handleSelect} disabled={selected.length === 0 ? true:false} endIcon={<ArrowForwardIosIcon/>}>Proceed</Button>
                                </Box>
                                

                                <SmallestModal open={openAttachmentModal} close = {closeAttachmentModal} title='Uploading attachment'>
                                    <Box sx={{p:1}}>
                                        <label htmlFor={"contained-file"} style={{width:'100%'}}>
                                            <Input accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" id={"contained-file"} type="file" onChange ={(value)=>handleSetFile(value)}/>
                                            <Tooltip title='Upload Memorandum Order' component="span"><Button  variant='outlined' startIcon={<AttachFileIcon/> } fullWidth>Upload Request Letter</Button></Tooltip>
                                        </label>
                                        <Box sx={{display:'flex',justifyContent:'flex-end',gap:1,mt:1}}>
                                            <Button variant="contained" color='success' className="custom-roundbutton" size="small" disabled={fileAttachment.length === 0 ? true:false} onClick={handleSubmit}>Submit</Button>
                                            <Button variant="contained" color='error' className="custom-roundbutton" size="small" onClick={closeAttachmentModal}>Cancel</Button>
                                        </Box>
                                    </Box>
                                </SmallestModal>
                           
                            </Paper>
                        :
                        null
                    }
                </Grid>
            </Grid>
            }
            
        </Box>
    )
}