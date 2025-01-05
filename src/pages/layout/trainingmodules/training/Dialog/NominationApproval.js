import React,{useEffect, useState} from 'react';
import {Grid,Button,Paper,TableContainer,Table,TableHead,TableRow,TableBody,TableFooter,TablePagination,Box,TextField,InputAdornment,Tooltip,IconButton,Typography,Checkbox,Chip} from '@mui/material'
import { getAllNominationApproval, getTraineeapprovalByDept, updateApprovedTraineeByDept } from '../TrainingRequest';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { searchValueFunction } from '../../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';
import { getApprovedTrainee } from '../../../traineeapproval/TraineeApprovalRequest';
import PersonIcon from '@mui/icons-material/Person';
import Swal from 'sweetalert2';
// media query
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
export default function NominationApproval(props){
    // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: matches?13:15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize:matches?11:13,
    },
  }));
  const [filterData, setFilterData] = useState([]);
    const [filter, setFilter] = useState('');
    const [data,setData] = useState([]);
    const [tempData,setTempData] = useState([]);
    const [preselect,setPreselect] = useState([]);
    const [slot,setSlot] = useState();
    const [reachMaxSlot,setReachMaxSlot] = useState(false)

    useEffect(()=>{
        console.log(props.id)
        var data2 = {
            id:props.id
        }
        getAllNominationApproval(data2)
        .then(res=>{
            console.log(res.data)
            setFilterData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[props.id])
    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
        setData([])
    };
    const handleSubmit = (event) =>{
        event.preventDefault();
        setSlot(filter.slot)
        Swal.fire({
            icon:'info',
            title:'Loading list of '+filter.dept_name+'',
            html:'Please wait...'
        })
        Swal.showLoading();
        // var data2 = {
        //     dept_name:filter.dept_name,
        //     dept_code:filter.dept_code,
        //     training_details_id:props.id
        // }
        var data2 = {
            id:props.id,
            dept_code:filter.dept_code
        }
        getTraineeapprovalByDept(data2)
        .then(res=>{
            console.log(res.data)
            setData(res.data.all_list)
            setTempData(res.data.all_list)
            var temp = [];
            res.data.approved.forEach(element => {
                temp.push(element.training_shortlist_id)
            });
            setPreselect(temp)
            if(parseInt(filter.slot) === res.data.approved.length){
                setReachMaxSlot(true)
            }else{
                setReachMaxSlot(false)
            }
            Swal.close();
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
        // getApprovedTrainee(data2)
        // .then(res=>{
        //     console.log(res.data)
        // }).catch(err=>{
        //     console.log(err)
        // })
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname']
        var temp = searchValueFunction(tempData,item,value.target.value);
        if(value.target.value === ''){
            setData(tempData)
        }else{
            setData(temp)
        }
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(tempData)
    }
    const handleSelectTrainee = (id)=>{
        if(preselect.includes(id)){
            var temp = [...preselect]
            var index = temp.indexOf(id)
            if(index>-1){
                temp.splice(index,1);
                setPreselect(temp)
                setReachMaxSlot(false)
            }
        }else{
            if(parseInt(slot)>preselect.length){
                var temp = [...preselect]
                temp.push(id);
                setPreselect(temp)
            }
        }
    }
    const save = ()=>{
        console.log(preselect)
        // props.saveUpdateTrainee(preselect)
        Swal.fire({
            icon:'info',
            title:'Saving data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        var data2 = {
            dept_code:filter.dept_code,
            training_details_id:props.id,
            ids:preselect
        }
        updateApprovedTraineeByDept(data2)
        .then(res=>{
            console.log(res.data)
            Swal.close();
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title:res.data.message,
                    timer:1500,
                    showConfirmButton:false
                })
                // handleCloseShowUpdateTrainee()
                // console.log(res.data)
                setData(res.data.data.all_list)
                setTempData(res.data.data.all_list)
                var temp = [];
            res.data.data.approved.forEach(element => {
                temp.push(element.training_shortlist_id)
            });
            setPreselect(temp)
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
    const clearPreselect = ()=>{
        setPreselect([])
        setReachMaxSlot(false)

    }
    useEffect(()=>{
        if(preselect.length !==0){
            if(parseInt(slot)===preselect.length){
                setReachMaxSlot(true)
            }
        }

    },[preselect])
    return(
        <React.Fragment>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
                <Grid item xs={12}  className='flex-row-flex-start'>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filter}
                        label="Department"
                        onChange={handleChangeFilter}
                        required
                        >
                        {
                            filterData.map((row,key)=>
                            <MenuItem value={row} key={key}>{row.dept_name}</MenuItem>
                            )
                        }
                        </Select>
                    </FormControl>
                    &nbsp;
                    <Tooltip title = 'Search Filtered Department'><Button variant='outlined' sx={{height:'100%'}} type='submit'><SearchIcon/></Button></Tooltip>

                </Grid>
        </Grid>
        </form>
        {
            data.length === 0 
            ?
            null
            :
            <Box>
                <hr/>
                <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                <Box sx={{mt:1,mb:1}}>
                        <TextField label='Search Table' value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
                    }}/>
                </Box>
                <Box className='flex-row-flex-end' sx={{mt:1,mb:1}}>
                    <TextField value={slot} inputProps={{readOnly:true}} InputLabelProps={{shrink:true}} label='Slot'/>
                    &nbsp;
                    <TextField label='Total Selected' value = {preselect.length} placeholder='Firstname, Lastname' InputProps={{
                        startAdornment: <InputAdornment position="start"><PersonIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Selected'><IconButton onClick={clearPreselect} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
                    }}/>
                    {/* <Chip label={<><Typography sx={{color:'#fff'}}><em>Total Selected: {preselect.length} <Tooltip title='Clear Selected'><IconButton sx={{color:red[800],background:'#fff',p:0,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></em></Typography></>} sx={{m:1,height:'56px',background:blue[500]}} /> */}
                </Box>
                </Box>
                <TableContainer  sx={{mt:2}}>
                    
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
                                Employment Status
                            </StyledTableCell>
                            <StyledTableCell>
                                Select
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                            <TableRow key={key}>
                                <StyledTableCell>
                                    {row.lname}, {row.fname}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {row.position_name}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {row.description}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Checkbox checked ={preselect.includes(row.training_shortlist_id)?true:false} disabled={preselect.includes(row.training_shortlist_id)?false:reachMaxSlot?true:false} onChange={()=>handleSelectTrainee(row.training_shortlist_id)}/>
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                colSpan={4}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                    </Table>
                </TableContainer>
                
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Button variant='contained' sx={{m:2}} color='success' onClick = {save} className='custom-roundbutton'>Save</Button>
                </Box>
            </Box>
        }
        
        </React.Fragment>
    )
}