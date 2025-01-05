import React, { useEffect, useState } from 'react';
import { Grid,Box,Checkbox ,Typography,TableContainer,Table,TableHead,TableBody,TableRow,Button,TablePagination,TextField,IconButton,Tooltip,Chip,Paper,Dialog,AppBar,Toolbar, TableFooter,Select,MenuItem,InputLabel,FormControl   } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,grey, orange} from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import Swal from 'sweetalert2';
import Slide from '@mui/material/Slide';
import SmallModal from '../../custommodal/SmallModal';
import DraggableList from '../../draggable/DraggableList/DraggableList';

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
const Input = styled('input')({
    display: 'none',
});
const InfoTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
export default function UpdateDataTable(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [preselect,setPreselect] = useState([]);
    const [slot,setSlot] = useState(0)
    const [reachMaxSlot,setReachMaxSlot] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data,setData] = useState([]);
    const [data1,setData1] = useState([]);
    const [memoFile,setMemoFile] = useState('');
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>{
        setSlot(props.selectedTraining.slot)
        setData(props.data)
        setData1(props.data)
        var temp = [];
        var temp2 = [];
        props.data.forEach(element => {
            if(element.dept_approved){
                temp.push(element.training_shortlist_id)
            }
            if(element.is_reserved){
                temp2.push(element.training_shortlist_id)
            }
        });
        setPreselect(temp)
        setSelectedReserve(temp2)
    },[])
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
    useEffect(()=>{
        if(preselect.length !==0){
            if(parseInt(slot)===preselect.length){
                setReachMaxSlot(true)
            }
        }

    },[preselect])
    const save = ()=>{
        var data2 = {
            memo_file:memoFile,
            preselect:preselect,
            reserve:selectedReserve
        }
        // console.log(data2)
        props.saveUpdateTrainee(data2)
    }
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname']
        var temp = searchValueFunction(props.data,item,value.target.value);
        setData(temp)
        // const filteredRows = props.data.filter((row) => {
        //     return row.fname.toLowerCase().includes(value.target.value.toLowerCase()) || row.lname.toLowerCase().includes(value.target.value.toLowerCase());
        //   });
        //   setData(filteredRows)
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(props.data)
    }
    const clearPreselect = ()=>{
        var temp = [];
        props.data.forEach(element => {
            if(element.hrdc_approved || element.approved){
                temp.push(element.training_shortlist_id)
            }
        });
        setPreselect(temp)
        // setPreselect([])
        setReachMaxSlot(false)
    }
    const [fileExtensions,setFileExtensions] = useState(['pdf','jpg','png','jpeg']);
    const handleSetMemoFile = (e) =>{
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(fileExtensions.includes(extension.toLowerCase())){
            
            let fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            
            fileReader.onload = (event) => {
                setMemoFile(fileReader.result)
            }
        }else{
            setMemoFile('');
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'Please upload PDF/Image or Image file.'
            })
        }
    }
    const [selectedReserve,setSelectedReserve] = useState([]);
    const [tempSelectedReserve,setTempSelectedReserve] = useState([]);

    const [reserveDialog,setReserveDialog] = useState(false);
    const [reserveTraineeData,setReserveTraineeData] = useState([]);
    const [reserveTraineeData1,setReserveTraineeData1] = useState([]);
    const handleCloseReserveDialog = ()=>{
        setReserveDialog(false)
    }
    const handleOpenReserveDialog = ()=>{
        // console.log(temp)
        // setSelectedReserve([])
        var t_arr = [];
        var temp = [...data1];
        var new_arr = temp.filter((el)=>{
            return !preselect.includes(el.training_shortlist_id)
        })
        new_arr.forEach(el=>{
            el.sort = 0;
        })
        // console.log(new_arr)
        // temp.forEach(el=>{
        //     if(!preselect.includes(el.training_shortlist_id)){
        //         t_arr.push(el)
        //     }
        // })
        setTempSelectedReserve(selectedReserve)
        setReserveTraineeData(new_arr)
        setReserveTraineeData1(new_arr)
        setReserveDialog(true)
    }
    const handleSelectReserve = (id)=>{
        if(tempSelectedReserve.includes(id)){
            var temp = [...tempSelectedReserve]
            var index = temp.indexOf(id)
            if(index>-1){
                temp.splice(index,1);
                setTempSelectedReserve(temp)
            }
        }else{
            if(5>tempSelectedReserve.length){
                var temp = [...tempSelectedReserve]
                temp.push(id);
                setTempSelectedReserve(temp)
            }
        }
    }
    const handleClearSelectedReserve = ()=>{
        setTempSelectedReserve([])
    }
    const [finalSelectedReserve,setFinalSelectedReserve] = useState([])
    const handleSaveReserve = ()=>{
        var temp = reserveTraineeData.filter(e=>tempSelectedReserve.some(f=>f===e.training_shortlist_id))
        var tempRank = [];

        temp.forEach((el,key)=>{
            el.sort = 0;
            tempRank.push(key+1);

        })
        setRank(tempRank)
        setFinalSelectedReserve(temp)
        setOpenSetRank(true)

        // setSelectedReserve(tempSelectedReserve);
        // setReserveDialog(false)
    }
    const [searchReservedValue,setSearchReservedValue] = useState('');
    const [openSetRank,setOpenSetRank] = useState(false)
    const handleCloseSetRank = () =>{
        setOpenSetRank(false)
    }
    useEffect(()=>{
        if(searchReservedValue){
            var new_arr = reserveTraineeData1.filter((el)=>{
                return el.fname.includes(searchReservedValue.toUpperCase()) || el.lname.includes(searchReservedValue.toUpperCase())
            })
            setReserveTraineeData(new_arr)
        }else{
            setReserveTraineeData(reserveTraineeData1)
        }
        
    },[searchReservedValue])
    const [rank,setRank] = useState([])
    const handleChangeRank = (index,val) => {
        var temp = [...finalSelectedReserve];
        temp[index].sort = val.target.value;
        setFinalSelectedReserve(temp)
    }
    const [selectedRank,setSelectedRank] = useState([]);
    useEffect(()=>{
        var temp = [...selectedRank]
        finalSelectedReserve.forEach(el=>{
            if(el.sort>0){
                temp.push(el.sort)
            }
        })
        setSelectedRank(temp)

    },[finalSelectedReserve])
    const handleResetRank = () => {
        var temp = [...finalSelectedReserve];
        temp.forEach(el=>{
            el.sort = 0;
        })
        setFinalSelectedReserve(temp)

        setSelectedRank([])
    }
    const handleSaveRank = (item) =>{
        item.forEach((el,key)=>{
            el.sort = key+1;
        })
        handleCloseSetRank();
        handleCloseReserveDialog()
        setSelectedReserve(item)
    }
    return(
        <Box>
        <Paper>
        <TableContainer>
            <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',alignItems:'center'}}>
            <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
            }}/>
            {/* <Chip label={<><Typography sx={{color:'#fff'}}><em>Total Selected: {preselect.length} <Tooltip title='Clear Selected'><IconButton sx={{color:red[800],background:'#fff',p:0,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></em></Typography></>} sx={{m:1,height:'56px',background:blue[500]}} /> */}
            <Box sx={{display:'flex',justifyContent:'flex-end',width:'100%',mb:matches?1:0}}>
            <Typography sx={{background:blue[900],color:'#fff',p:2,borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px'}}><em>Total Selected: {preselect.length}</em><Tooltip title='Clear Selected'><IconButton sx={{color:blue[900],background:'#fff',p:0,ml:1,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></Typography>

            </Box>
            </Box>
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
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                    <TableRow key={key} sx={{background:data.hrdc_approved?grey[300]:'auto'}}>
                        <StyledTableCell>
                            {data.lname}, {data.fname}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.position_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.description}
                        </StyledTableCell>
                        <StyledTableCell>
                            <Checkbox checked ={preselect.includes(data.training_shortlist_id)?true:false} disabled={data.hrdc_approved?true:preselect.includes(data.training_shortlist_id)?false:reachMaxSlot?true:selectedReserve.includes(data.training_shortlist_id)?true:false} onChange={()=>handleSelectTrainee(data.training_shortlist_id)}/>
                            
                        </StyledTableCell>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component='div'
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
            </Table>
        </TableContainer>
        
        </Paper>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mt:1}}>
        <Tooltip title = 'Reserve trainee'><Button variant='contained' className='custom-roundbutton' sx={{mr:1,background:orange[900],'&:hover':{background:orange[800]},fontSize:matches?'.6rem':'auto'}} onClick={handleOpenReserveDialog} startIcon={<PersonAddIcon/>} >Reserve Trainee</Button></Tooltip>

        {/* <label htmlFor={"contained-memo-file"} style={{marginRight:'5px'}}>
            <Input accept=".jpg,.jpeg,.png,.pdf" id={"contained-memo-file"} type="file" onChange ={(value)=>handleSetMemoFile(value)}/>
            <Tooltip title='Upload Memorandum Order' component="span"><Button className='custom-roundbutton' variant='contained' startIcon={<AttachFileIcon/>} sx={{fontSize:matches?'.6rem':'auto'}}>Upload Memo</Button></Tooltip>
        </label> */}

        <Button variant='contained' color='success' onClick = {save} className='custom-roundbutton' disabled={preselect.length === 0 || selectedReserve.length===0}>Save</Button>
        </Box>
        <Dialog
            fullScreen
            open={reserveDialog}
            sx={{width:matches?'100%':'50%',height:'100%',right:0,left:'auto'}}

            onClose={handleCloseReserveDialog}
            TransitionComponent={InfoTransition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <PersonAddIcon/>

                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Reserve Trainee
                </Typography>
                <Button autoFocus color="inherit" onClick={handleCloseReserveDialog}>
                close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <small><em>* minimum of 1 and maximum of 5</em></small>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                        <Box>
                            <TextField label='Search' value={searchReservedValue} onChange = {(value)=>setSearchReservedValue(value.target.value)} placeholder='Firstname | Lastname' InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={()=>setSearchReservedValue('')} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
                            }}/>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:matches?'flex-end':'auto',alignItems:'center',mt:matches?1:0}}>
                            <Typography sx={{color:'#fff',background:blue[900],borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px',padding:'10px 15px 10px 15px'}}>Total selected: {tempSelectedReserve.length} <Tooltip title='Clear selected'><IconButton size='small' sx={{color:blue[900],background:'#fff',p:0,ml:1,'&:hover':{background:'#fff',color:red[800]}}} onClick={handleClearSelectedReserve}><ClearOutlinedIcon/></IconButton></Tooltip></Typography>
                        </Box>

                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                        <TableContainer sx={{maxHeight:'60vh'}}>
                            <Table stickyHeader>
                                <TableHead>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell align='center'>Select</StyledTableCell>
                                </TableHead>
                                <TableBody>
                                    {
                                        reserveTraineeData.map((row,key)=>
                                            <TableRow key = {key} hover>
                                                <StyledTableCell>{row.lname}, {row.fname}</StyledTableCell>
                                                <StyledTableCell align='center'><Checkbox checked={tempSelectedReserve.includes(row.training_shortlist_id)?true:false} onChange = {()=>handleSelectReserve(row.training_shortlist_id)} disabled={tempSelectedReserve.includes(row.training_shortlist_id)?false:tempSelectedReserve.length>=5?true:false}/></StyledTableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <Button variant='contained' color='success' className='custom-roundbutton' disabled ={tempSelectedReserve.length===0?true:false} onClick={handleSaveReserve}>Save</Button>
                    </Grid>
                    <SmallModal open = {openSetRank} close = {handleCloseSetRank} title ='Please rank the reserved trainee'>
                        <DraggableList data = {finalSelectedReserve} save = {handleSaveRank}/>
                        
                        {/* <Box sx={{display:'flex',justifyContent:'flex-end',mt:1}}>
                            <Tooltip title='Reset rank'><IconButton color='primary' className='custom-iconbutton' onClick={handleResetRank}><RestartAltIcon/></IconButton></Tooltip>
                        </Box>
                        <Box sx={{p:1,display:'flex',flexDirection:'column',gap:1}}>
                            {
                                finalSelectedReserve.map((item,key)=>
                                    <Box key={key} sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                        <Typography>{item.fname} {item.mname} {item.lname}</Typography>
                                        <FormControl>
                                        <InputLabel id="demo-simple-select-label">Rank</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={item.sort}
                                                label="Rank"
                                                onChange={(val)=>handleChangeRank(key,val)}
                                                sx={{width:'150px'}}
                                            >
                                                {
                                                    rank.map((row,key2)=>
                                                        row === item.sort
                                                        ?
                                                        <MenuItem value={row} key={key2}>{row}</MenuItem>
                                                        :
                                                        selectedRank.includes(row)
                                                        ?
                                                        null
                                                        :
                                                        <MenuItem value={row} key={key2}>{row}</MenuItem>

                                                    )
                                                }
                                            </Select>
                                        </FormControl>

                                    </Box>
                                )
                            }
                            <Typography></Typography>
                        </Box> */}
                    </SmallModal>
                </Grid>
                    
            </Box>

        </Dialog>
        </Box>
    )
}