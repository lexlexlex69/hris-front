import React,{useEffect, useState} from 'react';
import {TableContainer,Table,TableRow,TableHead,TableBody,Fade,Paper,IconButton,Tooltip,Box,Typography, Checkbox, Button} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Swal from 'sweetalert2';
import {green,blue,red} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { deleteSpecificTraineeAttendance, getTrainingParticipants, insertAttendance } from '../TrainingAttendanceRequest';
import ReactExport from "react-export-excel";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from 'react-toastify';
import SmallModal from '../../../custommodal/SmallModal';
import { APILoading } from '../../../apiresponse/APIResponse';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ViewAttendanceList(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: matches?11:'auto',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: matches?10:14,
    },
    }));
    const ResponsiveTheme = createTheme({
        components: {
            MuiIconButton: {
                defaultProps: {
                    size: matches?'small':'auto',
                },
            },
            MuiTypography:{
                defaultProps: {
                    fontSize: matches?'.9rem':'auto',
                },
            }
        }
    })
    const [data,setData] = useState([]);
    const [traineeListData,setTraineeListData] = useState([]);
    useEffect(()=>{
        var data2 = {
            id:props.trainingDetails.training_details_id
        }
        getTrainingParticipants(data2)
        .then(res=>{
            setTraineeListData(res.data)
        }).catch(err=>{
            console.log(err)
            toast.error(err.message)
        })
        var temp = JSON.parse(props.data.emp_info)
        temp.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
        // console.log(temp)
        setData(temp)
        // console.log(props.data)
    },[props.data])
    const handleDelete = (row)=>{
        Swal.fire({
            icon:'warning',
            title: 'Confirm delete ?',
            showCancelButton:true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon:'info',
                    title:'Deleting data',
                    html:'Please wait...'
                })
                Swal.showLoading()
                var data2 = {
                    emp_id:row.emp_id,
                    date:props.data.date,
                    period:props.data.period,
                    training_details_id:props.data.training_details_id
                }
                deleteSpecificTraineeAttendance(data2)
                .then(res=>{
                    if(res.data.status === 200){
                        props.handleUpdateOnDelete()
                        if(res.data.data.length !==0){
                            // setData(JSON.parse(res.data.data[0].emp_info))
                            var temp = JSON.parse(res.data.data[0].emp_info)
                            temp.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
                            setData(temp)
                        }else{
                            setData([])
                        }
                        Swal.fire({
                            icon:'success',
                            title:res.data.message,
                            timer:1500,
                            showConfirmButton:false
                        })
                    }else{
                        Swal.fire({
                            icon:'success',
                            title:res.data.message
                        })
                    }
                    // console.log(res.data)
                }).catch(err=>{
                    Swal.close()
                    console.log(err)
                })
            }
          })
        
    }
    const [availableToAddData,setAvailableToAddData] = useState([]);
    const [selectedToAdd,setSelectedToAdd] = useState([]);
    const [openAdd,setOpenAdd] = useState(false);
    const handleCloseAdd = () =>{
        setOpenAdd(false)
    }
    const handleAdd = () => {
        // console.log(data)
        // console.log(traineeListData)
        // var uniqueResultOne = traineeListData.filter(function(obj) {
        //     return !JSON.parse(props.data.emp_info).some(function(obj2) {
        //         return obj.emp_id == obj2.emp_id;
        //     });
        // });
        const temp = traineeListData.filter(el=>{
            return !data.some(el2=> {
                return parseInt(el.emp_id) === parseInt(el2.emp_id)
            })
        })
        // console.log(temp)
        setAvailableToAddData(temp)
        setOpenAdd(true)
        // console.log(temp)
    }
    const handleSave = async () => {
        if(selectedToAdd.length === 0){
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please select atleast 1 trainee'
            })
        }else{
            try{
                APILoading('info','Adding attendance','Please wait...')
                var t_data = {
                    ids:selectedToAdd,
                    data:props.data
                }
                const res = await insertAttendance(t_data);
                // console.log(res.data)
                if(res.data.status===200){
                    props.setData(res.data.data)
                    var temp = JSON.parse(res.data.data[0].emp_info)
                    temp.sort((a,b) => (a.lname > b.lname) ? 1 : ((b.lname > a.lname) ? -1 : 0))
                    // console.log(temp)

                    setData(temp)
                    handleCloseAdd()
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
            }catch(err){
                Swal.fire({
                    icon:'error',
                    title:err
                })
            }
            
        }
    }
    const handleSelect = (id) =>{
        var index = selectedToAdd.indexOf(id);

        if(index === -1){
            var temp = [...selectedToAdd];
            temp.push(id);
            setSelectedToAdd(temp)
        }else{
            var temp = [...selectedToAdd];
            temp.splice(index,1);
            setSelectedToAdd(temp)
        }
    }
    return(
        <Fade in>
            <Box>
            <ThemeProvider theme={ResponsiveTheme}>
                <Box sx={{display:'flex',justifyContent:'space-between',mb:1}}>
                    <Box>
                    <Typography><strong>Date:</strong> {moment(props.data.date,'YYYY-MM-DD').format('MMMM DD, YYYY')}</Typography>
                    <Typography><strong>Period:</strong> {props.data.period} </Typography>
                    </Box>
                    <Box sx={{mb:1,display:'flex',gap:1}} className='flex-row-flex-end'>
                        {/* <Tooltip title='Add'><IconButton color='success' className='custom-iconbutton'><AddOutlinedIcon/></IconButton></Tooltip>
                        &nbsp; */}
                        <ExcelFile element={<Tooltip title='Download attendance list'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}}><DownloadIcon/></IconButton></Tooltip>} filename={props.data.date+' ('+props.data.period+')'}>
                                <ExcelSheet data={data} name="Attendance">
                                    <ExcelColumn label="Name" value={(col)=> col.lname+', '+col.fname}/>
                                    <ExcelColumn label="Dept Name" value='dept_name'/>
                                </ExcelSheet>
                        </ExcelFile>
                        <Tooltip title='Add trainee attendance'>
                            <IconButton color = 'success' className='custom-iconbutton' onClick={handleAdd}><AddIcon/></IconButton>
                        </Tooltip>
                    
                    </Box>
                </Box>
            <Paper>
            <TableContainer sx={{maxHeight:matches?300:400}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((row,key)=>
                                <TableRow key ={key} hover>
                                    <StyledTableCell>{row.lname}, {row.fname}</StyledTableCell>
                                    <StyledTableCell>{row.dept_name}</StyledTableCell>
                                    <StyledTableCell><Tooltip title='Delete from attendance'><IconButton color='error' onClick={()=>handleDelete(row)} className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:red[800]}}}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip></StyledTableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
            </ThemeProvider>
            <SmallModal open = {openAdd} close = {handleCloseAdd} title='Adding attendance'>
                <Box sx={{p:1}}>
                    <Paper>
                        <TableContainer sx={{maxHeight:matches?300:400}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Department</StyledTableCell>
                                        <StyledTableCell>Select</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        availableToAddData.map((row,key)=>
                                            <TableRow key ={key} hover>
                                                <StyledTableCell>{row.lname}, {row.fname}</StyledTableCell>
                                                <StyledTableCell>{row.short_name}</StyledTableCell>
                                                <StyledTableCell>
                                                    <Checkbox checked = {selectedToAdd.includes(row.emp_id)?true:false} onChange={()=>handleSelect(row.emp_id)}/>
                                                </StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Paper>
                        <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                            <Button color='success' variant='contained' className='custom-roundbutton' size='small' onClick={handleSave} disabled ={selectedToAdd.length === 0?true:false}>Save</Button>
                        </Box>
                    </Box>
            </SmallModal>
            </Box>
        </Fade>
    )
}