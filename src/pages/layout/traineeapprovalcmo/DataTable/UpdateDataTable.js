import React, { useEffect, useState } from 'react';
import { Grid,Box,Checkbox ,Typography,TableContainer,Table,TableHead,TableBody,TableRow,Button,TablePagination,TextField,IconButton,Tooltip,Chip,Paper  } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
export default function UpdateDataTable(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [preselect,setPreselect] = useState([]);
    const [oldselect,setOldselect] = useState([]);
    const [slot,setSlot] = useState(0)
    const [reachMaxSlot,setReachMaxSlot] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data,setData] = useState([]);
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
        var temp = [];
        props.data.forEach(element => {
            if(element.hrdc_approved){
                temp.push(element.training_shortlist_id)
            }
        });
        setPreselect(temp)
        setOldselect(temp)
    },[])
    const handleSelectTrainee = (id)=>{
        if(preselect.includes(id)){
            var temp = [...preselect]
            var index = temp.indexOf(id)
            if(index>-1){
                temp.splice(index,1);
                setPreselect(temp)
            }
        }else{
            var temp = [...preselect]
            temp.push(id);
            setPreselect(temp)
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
        // console.log(data2)
        props.saveUpdateTrainee(data2)
    }
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname','short_name']
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
            if(element.approved){
                temp.push(element.training_shortlist_id)
            }
        });
        setPreselect(temp)
        console.log(temp)
        // setPreselect([])
    }
    return(
        <>
        <Paper>
        <Box sx={{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between',alignItems:'center'}}>
        <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
        startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
    }}/>
        {/* <Chip label={<><Typography sx={{color:'#fff'}}><em>Total Selected: {preselect.length} <Tooltip title='Clear Selected'><IconButton sx={{color:red[800],background:'#fff',p:0,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></em></Typography></>} sx={{m:1,height:'56px',background:blue[500]}} /> */}
        <Box sx={{display:'flex',justifyContent:'flex-end',width:'100%',mb:matches?1:0}}>
        <Typography sx={{background:blue[900],color:'#fff',p:2,borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px'}}><em>Total Selected: {preselect.length}</em><Tooltip title='Clear Selected'><IconButton sx={{color:red[800],background:'#fff',p:0,ml:1,'&:hover':{background:'#fff',color:red[500]}}} onClick={clearPreselect}><ClearOutlinedIcon sx={{fontSize:'22px'}}/></IconButton></Tooltip></Typography>

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
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
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
                            <Checkbox disabled={data.approved?true:preselect.length === slot ?true:false} checked ={preselect.includes(data.training_shortlist_id)?true:false}  onChange={()=>handleSelectTrainee(data.training_shortlist_id)}/>
                        </StyledTableCell>
                    </TableRow>
                )}
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