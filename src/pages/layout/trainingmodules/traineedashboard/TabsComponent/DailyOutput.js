import React,{useEffect, useState} from 'react';
import {Grid,Paper,Typography,TableContainer,Table,TableRow,TableHead,TableBody,Button,IconButton,Tooltip,Box,Fade,Skeleton,Stack, Alert} from '@mui/material';
import { getMyDailyOutput, updateMyDailyOutput } from '../TraineeDashboardRequest';
import moment from 'moment';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import DataTableLoader from '../../../loader/DataTableLoader';
import TableLoading from '../../../loader/TableLoading';

const Input = styled('input')({
    display: 'none',
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function DailyOutput(props){
    const [data,setData] = useState([])
    const [isLoadingData,setIsLoadingData] = useState(true)
    useEffect(()=>{
        console.log(props.data)
        var data2= {
            id:props.data.training_shortlist_id
        }
        getMyDailyOutput(data2)
        .then(res=>{
            console.log(res.data)
            setData(res.data)
            setIsLoadingData(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleFile = (index,e)=>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        let data2 = [...data];
        if(extension === 'PDF'|| extension === 'pdf'|| extension === 'PNG'||extension === 'png'||extension === 'JPG'||extension === 'jpg'||extension === 'JPEG'||extension === 'jpeg'){
            // setCOCFile(event.target.files[0])
            // let files = e.target.files;
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                data2[index].file = fileReader.result;
                setData(data2)
                // setsingleFile(fileReader.result)
            }
        }else{
            data2[index].file = '';
            setData(data2)
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF or Image file.'
            })
        }
    }
    const handleSave = (row,index)=>{
        console.log(row)
        Swal.fire({
            icon:'info',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText:`Don't Save` 
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Saving data',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                var data2 = {
                    // index:index,
                    id:row.trainee_daily_output_id,
                    training_shortlist_id:row.training_shortlist_id,
                    filedata:row.file
                }
                updateMyDailyOutput(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        // let data2 = [...data];
                        // data2[index].file = '';
                        // setData(data2)
                        setData(res.data.data)
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
                    console.log(res.data)
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })
            }
          })
        
    }
    const viewFile = (id) => {
        viewFileAPI(id)
    }
    return(
        <>
            {
                isLoadingData
                ?
                <TableLoading/>
                :
                data.length===0
                ?
                <Alert severity="info">Not available!</Alert>
                :
                <Fade in>
                <Paper>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Date
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Speaker
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Period
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Topic
                                    </StyledTableCell>
                                    <StyledTableCell  align='center'>
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.map((row,index)=>
                                        <TableRow key={index} hover>
                                            <StyledTableCell>{moment(row.training_date).format('MMMM DD,YYYY')}</StyledTableCell>
                                            <StyledTableCell>{row.fname} {row.mname?row.mname.charAt(0)+'.':null} {row.lname}</StyledTableCell>
                                            <StyledTableCell>{row.period}</StyledTableCell>
                                            <StyledTableCell>{row.topic}</StyledTableCell>
                                            <StyledTableCell align='center'>
                                            <Box sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                            {
                                                // moment(new Date()).format('MM-DD-YYYY') >= moment(row.training_date,'YYYY-MM-DD').format('MM-DD-YYYY')
                                                moment().isSameOrAfter(moment(row.training_date,'YYYY-MM-DD'))
                                                ?
                                                (
                                                <label htmlFor={"contained-rqmt-file"+index}>
                                                    <Input accept="image/*,.pdf" id={"contained-rqmt-file"+index} type="file" onChange ={(value)=>handleFile(index,value)}/>
                                                    <Tooltip title='Upload File' component="span">
                                                    <Button variant='contained' color='primary' className='custom-roundbutton' startIcon={<FileUploadOutlinedIcon/>}>Upload File</Button></Tooltip>
                                                </label>
                                                )
                                                :
                                                (
                                                <Tooltip title='Training date not started'><span><IconButton disabled className='custom-iconbutton'><FileUploadOutlinedIcon/></IconButton></span></Tooltip>
                                                )

                                            }
                                            {
                                                row.file_id !==null
                                                ?
                                                <Tooltip title='View Uploaded Requirements'><Button variant='contained' onClick ={()=>viewFile(row.file_id)} color='info' className='custom-roundbutton' startIcon={<ContentPasteSearchIcon/>}>Preview</Button></Tooltip>
                                                :
                                                null
                                            }
                                            {
                                                // moment(new Date()).format('MM-DD-YYYY') >= moment(row.training_date,'YYYY-MM-DD').format('MM-DD-YYYY')
                                                moment().isSameOrAfter(moment(row.training_date,'YYYY-MM-DD'))
                                                ?
                                                <Tooltip title='Save'><span><Button variant='contained' className='custom-roundbutton' color='success' disabled={row.file?false:true} onClick={()=>handleSave(row,index)} startIcon={<SaveOutlinedIcon/>}>Save</Button></span></Tooltip>
                                                :
                                                null
                                            }
                                            </Box>
                                            
                                            </StyledTableCell>
                                        </TableRow>
                                    )
                                }
                                {/* {
                                    data.map((row,index)=>
                                        row.details.map((row2,index2)=>
                                            <TableRow key={index2}>
                                            {
                                                index2 === 0
                                                ?
                                                <>
                                                <TableCell rowSpan={row.details.length}>{index+1}</TableCell>
                                                <TableCell rowSpan={row.details.length}>{moment(row.date,'MM-DD-YYYY').format('MMMM DD, YYYY')}</TableCell>
                                                </>
                                                :
                                                ''
                                            }
                                            <TableCell>{row2.trainer_name}</TableCell>
                                            <TableCell>{row2.period}</TableCell>
                                            <TableCell align='center'>
                                            {
                                                moment(new Date()).format('MM-DD-YYYY') >= moment(row.date,'MM-DD-YYYY').format('MM-DD-YYYY')
                                                ?
                                                <label htmlFor={"contained-rqmt-file"+index+index2+row.trainer_name}>
                                                    <Input accept="image/*,.pdf" id={"contained-rqmt-file"+index+index2+row.trainer_name} type="file" onChange ={(value)=>handleFile(index,index2,value)}/>
                                                    <Tooltip title='Upload Activities' component="span"><IconButton color='primary' className='custom-iconbutton'><FileUploadOutlinedIcon/></IconButton></Tooltip>
                                                </label>
                                                :
                                                <IconButton disabled className='custom-iconbutton'><FileUploadOutlinedIcon/></IconButton>

                                            }
                                            
                                            
                                            {
                                                row2.file_id !==null
                                                ?
                                                <Tooltip title='View Uploaded Requirements'><IconButton onClick ={()=>viewFile(row2.file_id)} sx={{color:blue[500]}} className='custom-iconbutton'><VisibilityOutlinedIcon/></IconButton></Tooltip>
                                                :
                                                null
                                            }
                                            &nbsp;
                                            <Tooltip title='Save'><span><IconButton color='success' disabled={row2.file===null?true:false}onClick={()=>handleSave(index,index2,row2.file)} className='custom-iconbutton'><SaveOutlinedIcon/></IconButton></span></Tooltip>
                                            </TableCell>
                                            </TableRow>
                                        )
                                    // <TableRow key={index}>
                                    //     <TableCell>{index+1}</TableCell>
                                    //     <TableCell>{row.date}</TableCell>
                                    //     <TableCell>
                                            
                                    //     </TableCell>
                                    // </TableRow>
                                    )
                                } */}
                            </TableBody>
                        </Table>

                    </TableContainer>
                
                </Paper>
                </Fade>
            }
        </>
        
    )
}