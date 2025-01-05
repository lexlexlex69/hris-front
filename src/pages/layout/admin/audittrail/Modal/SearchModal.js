import React,{useState} from 'react';
import {Grid,TextField,Button,Table,TableContainer,TableHead,TableRow,TableBody,TableFooter,Paper,IconButton,List,ListItem,Divider,Box,ListItemButton,Typography,Modal} from '@mui/material';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';
import { searchEmployee, searchEmployeeLogs } from '../AuditTrailRequest';
import moment from 'moment';
import { searchValueFunction } from '../../../searchtable/Search';
import InputAdornment from '@mui/material/InputAdornment';
//Icons
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import Swal from 'sweetalert2';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 13,
      padding:10
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 11,
      padding:10
    },
  }));
export default function SearchModal(props){
     // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?300:600,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        borderRadius:1,
        p: 2,
    };
    const [searchValue,setSearchValue] = useState();
    const [searchTableValue,setSearchTableValue] = useState()
    const [data1,setData1] = useState([]);
    const [data,setData] = useState([]);
    const [empListSearchResultData,setEmpListSearchResultData] = useState([]);
    const [selectedEmp,setSelectedEmp] = useState('');
    const handleSetSearchValue = (value)=>{
        setSearchValue(value.target.value)
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        var data2 = {
            data:searchValue
        }
        searchEmployee(data2)
        .then(res=>{
            if(res.data.length>0){
                setEmpListSearchResultData(res.data)
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'No results found ! Try another name'
                })
            }
            console.log(res.data)
            // setData(res.data)
            // setData1(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    const handleSearch =  (value) =>{
        setSearchTableValue(value.target.value)
        var item = ['module','user_action','user_action_details']
        var temp = searchValueFunction(data1,item,value.target.value);
        setData(temp)
    }
    const handleClearSearch = () =>{
        setSearchTableValue('')
        setData(data1)
    }
    const handleShowLogs = (row) =>{
        setSelectedEmp(row.lname)
        Swal.fire({
            icon:'info',
            title:'Retrieving logs',
            html:'Please wait...'
        })
        Swal.showLoading();
        var t_data = {
            id:row.id
        }
        searchEmployeeLogs(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.length>0){
                setData(res.data)
                setData1(res.data)
                setOpen(true)
                Swal.close();
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'No logs found !'
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:'error',
                title:err
            })
        })
    }
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} >
                <form onSubmit={handleSubmit} style={{width:'100%',height:'100%'}} className='flex-row'>
                <TextField label='Search' fullWidth placeholder='Username,Firstname,Lastname' value = {searchValue} onChange={handleSetSearchValue} required/>&nbsp;
                <Button variant='outlined' sx={{height:'100%'}} type='submit'><SearchIcon/></Button>
                </form>

            </Grid>
            <Grid item xs={12}>

            {
                empListSearchResultData.length>0
                ?
                <>
                <Typography sx={{fontSize:'.8rem',color:'#818181',fontStyle:'italic'}}>
                    Search Results:
                </Typography>
                <List sx={{maxHeight:'60vh',overflowY:'scroll'}}>
                    {
                        empListSearchResultData.map((row,key)=>
                        <Box key = {key}>
                        <ListItem>
                            <ListItemButton onClick={()=>handleShowLogs(row)}>
                            {row.fname} {row.lname}
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        </Box>
                    )}
                </List>
                </>

                :
                null

            }
            </Grid>
             <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                        <Grid container spacing={1}>
                                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                                    <Typography sx={{background: blue[900],padding: '5px 10px',color: "#fff",width: 'fit-content',borderTopLeftRadius: '20px',borderBottomLeftRadius: '20px'}}><ReceiptLongIcon/> {`${selectedEmp}'s Logs`}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label = 'Seach Table' value = {searchTableValue} onChange={handleSearch} InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton color='error' onClick = {handleClearSearch}><CloseIcon/></IconButton>
                                        </InputAdornment>
                                    ),
                                    }} fullWidth/>
                                </Grid>
                                <Grid item xs={12} sx={{mt:1}}>
                                    <Typography sx={{fontStyle: "italic",color: '#979494',fontSize: '.8rem'}}>Total logs: {data.length}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper>
                                        <TableContainer sx={{maxHeight:300}}>
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <StyledTableCell>Datetime</StyledTableCell>
                                                    <StyledTableCell>Module Name</StyledTableCell>
                                                    <StyledTableCell>Action</StyledTableCell>
                                                    <StyledTableCell>Action Details</StyledTableCell>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        data.length !==0
                                                        ?
                                                        data.map((data,key)=>
                                                            <TableRow key = {key} hover>
                                                                <StyledTableCell>{moment(data.created_at).format('MMMM DD,YYYY h:mm a')}</StyledTableCell>
                                                                <StyledTableCell>{data.module}</StyledTableCell>
                                                                <StyledTableCell>{data.user_action}</StyledTableCell>
                                                                <StyledTableCell>{data.user_action_details}</StyledTableCell>
                                                            </TableRow>
                                                        )
                                                        :
                                                        <TableRow>
                                                            <StyledTableCell colSpan={4} align='center'>No Data</StyledTableCell>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                </Box>
            </Modal>
            

            
            
        </Grid>
    )
}