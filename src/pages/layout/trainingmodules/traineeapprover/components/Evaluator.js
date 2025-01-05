import { Autocomplete, Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,TextField,Tooltip,Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import SmallModal from "../../../custommodal/SmallModal";
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
//Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import SearchEmpModal from "../../../custommodal/SearchEmpModal";
import SearchIcon from '@mui/icons-material/Search';
import { formatExtName, formatMiddlename } from "../../../customstring/CustomString";
import { addTraineeEvaluator, deleteTraineeEvaluator, getAllOfficeList, getAllTraineeEvaluator } from "../TraineeApproverRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[700],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
export const Evaluator = ()=>{
    const [evaluatorData,setEvaluatorData] = useState([])
    const [openAdd,setOpenAdd] = useState(false);
    const [openSearchModal,setOpenSearchModal] = useState(false)
    const [empInfo,setEmpInfo] = useState({
        fname:'',
        mname:'',
        lname:'',
        extname:'',
        emp_id:'',
        dept_code:''
    })
    const [officeListData,setOfficeListData] = useState([])
    const [selectedOffice,setSelectedOffice] = useState(null);
    useEffect(()=>{
        getAllOfficeList()
        .then(res=>{
            // console.log(res.data)
            setOfficeListData(res.data)
        })
        _init();
    },[])
    const _init = async ()=>{
        const res = await getAllTraineeEvaluator();
        setEvaluatorData(res.data)
    }
    const handelOpen = () =>{
        setOpenAdd(true)
    }
    const updateSelect = (row)=>{
        setEmpInfo({
            fname:row.fname,
            mname:row.mname,
            lname:row.lname,
            extname:row.extname,
            emp_id:row.id,
            dept_code:row.dept_code
        })
        console.log(row)
    }
    const handleSave = async ()=>{
        if(!selectedOffice || !empInfo.emp_id){
            Swal.fire({
                icon:'warning',
                title:'Please provide all necessary data'
            })
        }else{
            APILoading('info','Adding new evaluator','Please wait...')
            var t_data = {
                emp_id:empInfo.emp_id,
                dept_code:selectedOffice.dept_code
            }
            const res = await addTraineeEvaluator(t_data);
            if(res.data.status === 200){
                setEvaluatorData(res.data.data)
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1000
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message,
                })
            }
        }
    }
    const [searchVal,setSearchVal] = useState('')
    const filterData = evaluatorData.filter(el=>el.fname.toUpperCase().includes(searchVal.toUpperCase()) || el.lname.toUpperCase().includes(searchVal.toUpperCase()))
    const handleDelete = async(item) =>{
        Swal.fire({
            icon:'question',
            title:'Confirm delete ?',
            showCancelButton:true
        }).then(async res=>{
            if(res.isConfirmed){
                APILoading('info','Deleting evaluator','Please wait...')
                let t_data = {
                    id:item.training_evaluator_id
                }
                const res = await deleteTraineeEvaluator(t_data);
                if(res.data.status === 200){
                    setEvaluatorData(res.data.data)
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1000
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message,
                    })
                }
            }
        })
        console.log(item)
    }
    return (
        <Box>
        <Box sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
            <Button color="success" variant="contained" onClick={handelOpen} startIcon={<AddIcon/>}>Add</Button>
        </Box>
        <Paper>
            <Typography sx={{background:blue[900],color:'#fff',p:1,mb:1}}>Trainee Evaluator</Typography>
            <TextField label='Search' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} fullWidth sx={{mb:1}}/>
            <TableContainer sx={{height:'50vh'}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                Name
                            </StyledTableCell>
                            <StyledTableCell>
                                Office
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filterData.length>0
                            ?
                             filterData.map((item)=>{
                                return (
                                    <TableRow key={item.training_evaluator_id}>
                                        <StyledTableCell>
                                            {`${item.fname} ${formatMiddlename(item.mname)} ${item.lname} ${formatExtName(item.extname)}`}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {item.dept_title}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{display:'flex',gap:1,justifyContent:'center'}}>
                                            <Tooltip title='Update'><IconButton className="custom-iconbutton" color="success"><EditIcon/></IconButton></Tooltip>
                                            <Tooltip title='Delete'><IconButton className="custom-iconbutton" color="error" onClick={()=>handleDelete(item)}><DeleteIcon/></IconButton></Tooltip>
                                        </StyledTableCell>
                                    </TableRow>
                                )
                             })
                            :
                            <TableRow>
                                <StyledTableCell colSpan={3} align="center">No Data</StyledTableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        <SmallModal open ={openAdd} close = {()=>setOpenAdd(false)} title='Adding new trainee evaluator'>
            <Grid container spacing={2} sx={{p:1}}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex'}}>
                        <TextField label='Employee Name' value={`${empInfo.fname} ${formatMiddlename(empInfo.mname)} ${empInfo.lname} ${formatExtName(empInfo.extname)}`} fullWidth InputProps={{readOnly:true}}/>
                        <Button onClick={()=>setOpenSearchModal(true)} variant="outlined"><SearchIcon/></Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-dept"
                        options={officeListData}
                        // sx={{minWidth:300}}
                        value = {selectedOffice}
                        getOptionLabel={(option) => option.dept_title}
                        onChange={(event,newValue) => {
                            setSelectedOffice(newValue);
                            }}
                        renderInput={(params) => <TextField {...params} label="Office/Department" required/>}
                        fullWidth
                        />
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                    <Button variant="contained" color="success" className="custom-roundbutton" onClick={handleSave}>Save</Button>
                    <Button variant="contained" color="error" className="custom-roundbutton">Cancel</Button>
                </Grid>
            </Grid>
            
            <SearchEmpModal open = {openSearchModal} close = {()=>setOpenSearchModal(false)} title = 'Searching Employee' updateSelect = {updateSelect} type={1}>
            </SearchEmpModal>
        </SmallModal>
        </Box>
    )
}