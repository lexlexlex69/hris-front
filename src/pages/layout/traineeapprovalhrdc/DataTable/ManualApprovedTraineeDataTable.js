import React, { useCallback, useEffect, useState } from 'react';
import { Grid,Box,Checkbox ,Typography,TableContainer,Table,TableHead,TableBody,TableRow,Button,TablePagination,TextField,IconButton,Tooltip,Chip,Paper,Stack,Skeleton,Modal   } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';

//icons
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllShortlistTraineeHRDC, updateApprovedTraineeHRDC } from '../TraineeApprovalHRDCRequest';
import Swal from 'sweetalert2';
import AddingNewTrainees from '../Modal/AddingNewTrainees';
import EmployeeList from '../Modal/EmployeeList';
import { toast } from 'react-toastify';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
export default function ManualApprovedTraineeDataTable(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'100%':'50vw',
        marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    const [preselect,setPreselect] = useState([]);
    const [oldselect,setOldselect] = useState([]);
    const [slot,setSlot] = useState(0)
    const [reachMaxSlot,setReachMaxSlot] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data,setData] = useState([]);
    const [data2,setData2] = useState([]);
    const [deptInfo,setDeptInfo] = useState([{
        shortlist_details:[]
    }]);
    const [currUpdateTraineeData,setCurrUpdateTraineeData] = useState([])
    const [isLoadingData,setIsLoadingData] = useState(true)
    const [openAddModal,setOpenAddModal] = useState(false)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>{
        console.log(props.selectedTraining)
        // setSlot(props.selectedTraining.slot)
        // setData(props.data)
        var temp = [];
        var temp2 = [];

        var data2 = {
            id:props.selectedTraining.training_details_id,
            manual:true,
        }
        getAllShortlistTraineeHRDC(data2)
        .then(res=>{
            console.log(res.data)
            if(res.data.length === 0){
                Swal.fire({
                    icon:'error',
                    title:'Notice !',
                    html:'As of the moment, none of the trainees were approved by the department head/incharge. Please try again later.'
                })
            }else{
                setData(res.data.data)
                setData2(res.data.data)
                setDeptInfo(res.data.dept_info)
                res.data.data.forEach(element => {
                    if(element.hrdc_approved){
                        temp.push(element.training_shortlist_id)
                        temp2.push(element)
                    }
                });
                setPreselect(temp)
                setOldselect(temp)
                setCurrUpdateTraineeData(temp2)
                setIsLoadingData(false)
            }
            
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const handleSelectTrainee = (row)=>{
        console.log(row)
        var id = row.training_shortlist_id

        var t_info = JSON.parse(deptInfo[0].shortlist_details);
        var t_dept_info = t_info.filter((el)=>{
            return row.short_name === el.dept_name
        })
        var t_total_count = 0;
        var t_total_slot = parseInt(t_dept_info[0].slot);
        data.forEach(el=>{
            if(el.short_name === row.short_name && preselect.includes(el.training_shortlist_id)){
                t_total_count++
            }
        })
        
        if(preselect.includes(id)){
            var temp = [...preselect]
            var temp2 = [...currUpdateTraineeData]
            var index = temp.indexOf(id)
            if(index>-1){
                temp.splice(index,1);
                temp2.splice(index,1);
                setPreselect(temp)
                setCurrUpdateTraineeData(temp2)
            }
        }else{
            if(t_total_count === t_total_slot){
                toast.warning('No more slot available for '+t_dept_info[0].dept_name)
            }else{
                var temp = [...preselect]
                var temp2 = [...currUpdateTraineeData]
                temp.push(id);
                temp2.push(row);
                setPreselect(temp)
                setCurrUpdateTraineeData(temp2)
            }
        }
        
        
    }
    useEffect(()=>{
        if(preselect.length !==0){
            if(parseInt(slot)===preselect.length){
                setReachMaxSlot(true)
            }
        }

    },[preselect])
    const save = ()=>{
        var removed = [];
        var added = [];
        var data2 = {
            removed:removed,
            added:added
        }
        oldselect.forEach(el=>{
            if(!preselect.includes(el)){
                removed.push(el)
            }
        })
        preselect.forEach(el=>{
            if(!oldselect.includes(el)){
                added.push(el)
            }
        })
        Swal.fire({
            icon:'warning',
            title: 'Do you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
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
                training_details_id:props.selectedTraining.training_details_id,
                removed:removed,
                added:added,
            }
            updateApprovedTraineeHRDC(data2)
            .then(res=>{
                // console.log(res.data)
                // Swal.close();
                if(res.data.status === 200){
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                    // handleCloseShowUpdateTrainee()
                    props.close()
                    // setData(res.data.data)
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
            })
        }
        })
        // console.log(data2)
        // props.saveUpdateTrainee(data2)
    }
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname','short_name']
        var temp = searchValueFunction(data2,item,value.target.value);
        setData(temp)
        // const filteredRows = props.data.filter((row) => {
        //     return row.fname.toLowerCase().includes(value.target.value.toLowerCase()) || row.lname.toLowerCase().includes(value.target.value.toLowerCase());
        //   });
        //   setData(filteredRows)
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(data2)
    }
    const clearPreselect = ()=>{
        var temp = [];
        // data2.forEach(element => {
        //     if(element.hrdc_approved){
        //         temp.push(element.training_shortlist_id)
        //     }
        // });
        setPreselect(temp)
        console.log(temp)
        // setPreselect([])
    }
    const getTotalSelected = useCallback((dept)=>{
        var t_count = 0;
        var t_check = data.filter((el)=>{
            return el.short_name === dept && preselect.includes(el.training_shortlist_id)
        })
        return t_check.length
        t_check.forEach(el=>{
            t_count++;
        })
        console.log(t_check)
        console.log(data)
       
    },[preselect])
    // const filterList = data.filter(el=>el.fname.toUpperCase().includes(searchValue.toUpperCase()) || el.lname.toUpperCase().includes(searchValue.toUpperCase()))
    return(
        <>
        <Paper>
        <Grid container>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row',m:1}}>
                {
                    deptInfo[0].shortlist_details.length >0
                    ?
                    JSON.parse(deptInfo[0].shortlist_details).map((row,key)=>
                        <Box key={key}>
                            <Typography sx={{textAlign:'center'}}>{row.dept_name}</Typography>
                            <Tooltip title={row.dept_name+"'s Slot"}><span><IconButton color='success'><PeopleIcon/></IconButton><small style={{color:'#898989'}}>{row.slot}</small></span></Tooltip>
                            <Tooltip title={row.dept_name+"'s Selected trainee"}><span><IconButton  color='primary'><GroupAddIcon/></IconButton><small style={{color:'#898989'}}>{getTotalSelected(row.dept_name)}</small></span></Tooltip>
                        </Box>
                    )
                    :
                    null
                }
            
            </Grid>
        </Grid>
        <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',alignItems:'center'}}>
            <Grid container sx={{display:'flex',flexDirection:'row', alignItems:'center'}}>
                <Grid item xs={12} md={6} lg={6}>
                        <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
                    }}/>
                </Grid>

            </Grid>
            <Box sx={{display:'flex',justifyContent:'flex-end',alignItems:'center',width:'100%',mb:matches?1:0}}>
            
            <Typography sx={{background:blue[900],color:'#fff',p:2,borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px'}}><em>Total Selected: {preselect.length}</em><Tooltip title='Clear Selected'><IconButton sx={{color:blue[900],background:'#fff',p:0,ml:1,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></Typography>

            </Box>

        </Box>
        <TableContainer>
            
            <Table>
            <TableHead>
                <TableRow>
                    <StyledTableCell>
                        Name
                    </StyledTableCell>
                    <StyledTableCell>
                        Position
                    </StyledTableCell>
                    <StyledTableCell>
                        Department/Office
                    </StyledTableCell>
                    <StyledTableCell>
                        Employment Status
                    </StyledTableCell>
                    <StyledTableCell>
                        Select
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    isLoadingData
                    ?
                    <React.Fragment>
                    <TableRow>
                        <StyledTableCell colSpan={5}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={5}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={5}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={5}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                     <TableRow>
                        <StyledTableCell colSpan={5}><Skeleton variant = 'rounded' height={30} animation='wave' /></StyledTableCell>
                    </TableRow>
                    </React.Fragment>
                    :
                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                    <TableRow key={key} hover>
                        <StyledTableCell>
                            {data.lname}, {data.fname}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.position_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.short_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.description}
                        </StyledTableCell>
                        <StyledTableCell>
                            <Checkbox checked ={preselect.includes(data.training_shortlist_id)?true:false}  onChange={()=>handleSelectTrainee(data)} disabled={preselect.includes(data.training_shortlist_id)?false:preselect.length>=parseInt(props.selectedTraining.participants)?true:false}/>
                        </StyledTableCell>
                    </TableRow>
                )
                }
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
        <Button variant='contained' sx={{m:2}} color='success' onClick = {save} className='custom-roundbutton'>Save</Button>
        </Box>
        </>
    )
}