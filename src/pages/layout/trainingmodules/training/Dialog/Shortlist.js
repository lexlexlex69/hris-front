import React , {useEffect, useState} from 'react';
import {Grid,Button,Table,TableBody,TableHead,TableRow,TablePagination,TableContainer,Paper,Collapse,IconButton,Box,Typography,Checkbox,FormControl,InputLabel,Select,MenuItem,Chip,Stack,Tooltip,TableFooter,Dialog,TextField,TableSortLabel,Autocomplete,FormControlLabel, InputAdornment  } from '@mui/material';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {blue,red,orange, grey, yellow,green} from '@mui/material/colors'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import BlockIcon from '@mui/icons-material/Block';
import LensIcon from '@mui/icons-material/Lens';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { visuallyHidden } from '@mui/utils';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getComparator, stableSort } from '../../../sorttable/SortTable';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpIcon from '@mui/icons-material/Help';
import { getShortlistPerDept } from '../TrainingRequest';
import { toast } from 'react-toastify';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Shortlist(props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[400],
      color: theme.palette.common.white,
      // paddingTop:0,
      // paddingBottom:0,
      fontSize: matches?10:13,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: matches?9:11,
    },
    }));

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterDeptData, setFilterDeptData] = useState([]);
    const [totalResults,setTotalResults] = useState([])
    const [data,setData] = useState([])
    const [data1,setData1] = useState([])
    const [data3,setData3] = useState([])
    const [selectedFilterDept, setSelectedFilterDept] = useState(null);
    const [selectedSeeMore,setSelectedSeemore] = useState([]);
    const [selectedShortList,setSelectedShortList] = useState([]);
    const [isSelectAll,setIsSelectAll] = useState(false);
    const [totalSelectedPerDept,setTotalSelectedPerDept] = useState([])
    useEffect(()=>{
      // setData(props.data)
      // setData1(props.data)
      setTotalResults(props.total_results)
      // const uniqueDept = [...new Set(props.data.map(item => item.short_name))];
      //   setFilterDeptData(uniqueDept.sort());
      setFilterDeptData(props.total_results)
    },[props.data])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const formatTraining  = (data) => {
        var temp = JSON.parse(data)

    }
    const [open, setOpen] = useState(false);
    const handleChangeFilter = async (event,val) => {
      // setIsSelectAll(false);
      setSelectedFilterDept(val);
      if(val){
        // let old = data1;
        // let temp = [];
        // old.forEach(element => {
        //     if(element.dept_code === val.dept_code){
        //         temp.push(element)
        //     }
        // });
        // setData(temp)
        // setData1(temp)
        notify();
        const res = await getShortlistPerDept({dept_code:val.dept_code})
        update()
        setData(res.data.data)
        setData1(res.data.data)
        setData3(res.data.data)
        setPage(0)
      }else{
        setData([])
      }
      
    };
    const handleClearFilter = () => {
        setData(data1)
        setSelectedFilterDept('')
        // setIsSelectAll(false);
    }
    const saveSelectedShorlist = ()=>{
      var data2 = {
        selected_shortlist:selectedShortList.map(el=>el.emp_id),
        total_selected_per_dept:totalSelectedPerDept,
        total_search_results:totalResults
      }
      props.handleSaveShortlist(data2)
    }
    const handleSelectedAll = ()=>{
      setIsSelectAll(!isSelectAll);
    }
    useEffect(()=>{
      if(isSelectAll){
        var arr = [];
        if(selectedFilterDept){
          var temp = [...selectedShortList]
          data.forEach(el=>{
            if(el.dept_reassigned === selectedFilterDept.dept_code && !el.is_ban){
              var t_ex = temp.findIndex(obj => obj.emp_id === el.emp_id);

              if(filterNoTrainingData.length >0){
                if(t_ex === -1 && filterNoTrainingData.includes(el.emp_id)){
                  // temp.push(el.emp_id);
                  //check if exists
                  temp.push({
                    emp_id:el.emp_id,
                    dept_code:selectedFilterDept.dept_code
                  });
                }
              }else{
                if(t_ex === -1){
                  temp.push({
                    emp_id:el.emp_id,
                    dept_code:selectedFilterDept.dept_code
                  });
                }
              }
              
            }
          })
          setSelectedShortList(temp);
        }else{
          data.forEach(el=>{
            if(!el.is_ban){
              // arr.push(el.emp_id);
              arr.push({
                emp_id:el.emp_id,
                dept_code:selectedFilterDept.dept_code
              });
            }
          })
          setSelectedShortList(arr);
        }
      }else{
        var arr = [];
        var arr2 = [];
        var temp = [...selectedShortList]
        if(selectedFilterDept){
          /**
           * Get index of emp_id based on filtered dept
           */
          data.forEach(el=>{
            if(el.dept_reassigned === selectedFilterDept.dept_code && !el.is_ban){
              // arr.push(el.emp_id);
              arr.push({
                emp_id:el.emp_id,
                dept_code:selectedFilterDept.dept_code
              });
            }
          })
          /**
           * get index of emp_id from selected shortlist
           */
          arr.forEach(el2=>{
            var index = temp.findIndex(el3=>el3.emp_id === el2.emp_id)
            if(index>-1){
              arr2.push(index);
            }
          })
          // console.log(arr2)
          /**
           * remove emp_id from selected shortlist
           */
          for (var i = arr2.length -1; i >= 0; i--){
            temp.splice(arr2[i],1);
          }
          setSelectedShortList(temp)
        }else{
          setSelectedShortList([]);
        }
      }
      // console.log(selectedShortList)
    },[isSelectAll])
    useEffect(()=>{
      var temp = [];
      filterDeptData.forEach(temp2=>{
        temp.push({dept_code:temp2.dept_code,dept_name:temp2.short_name,total:0})
      });
      temp.forEach(el=>{
        var t_total = selectedShortList.filter(el2=>el2.dept_code === el.dept_code)
        el.total = t_total.length;
      })
      setTotalSelectedPerDept(temp)
    },[selectedShortList])
    const clearSelectedDept = (dept_code) => {
      var arr = [];
        var arr2 = [];
        var temp = [...selectedShortList]

        /**
           * Get index of emp_id based on filtered dept
           */
         temp.forEach(el=>{
          if(el.dept_code === dept_code){
            arr.push(el.emp_id);
          }
        })
        /**
         * get index of emp_id from selected shortlist
         */
        arr.forEach(el2=>{
          var index = temp.findIndex(el=>el.emp_id === el2)
          if(index>-1){
            arr2.push(index);
          }
        })
        // console.log(arr2)
         /**
           * remove emp_id from selected shortlist
           */
        for (var i = arr2.length -1; i >= 0; i--){
          temp.splice(arr2[i],1);
        }
        setSelectedShortList(temp)
          
    }
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('final_total');
    const handleRequestSort = (event, property) => {
      setPage(0)
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
    const toastId = React.useRef(null);
    const notify = () => toastId.current = toast("Retrieving data", {isLoading:true, autoClose: false });

    const update = () => toast.update(toastId.current, {render: 'Successfully loaded',type: 'success', autoClose: 1000,isLoading:false });
    const selectFilter = async (data)=>{
      // var t_dept = [];
      // filterDeptData.forEach(el=>{
      //   if(el === data.short_name){
      //     t_dept = el;
      //   }
      // })
      // console.log(data)
      
      // let old = data1;
      // let temp = [];
      // old.forEach(element => {
      //     if(element.dept_code === data.dept_code){
      //         temp.push(element)
      //     }
      // });
      // setData(temp)
      // setData3(temp)
      notify();
      const res = await getShortlistPerDept({dept_code:data.dept_code})
      setSelectedFilterDept(data);
      update()
      setData(res.data.data)
      setData1(res.data.data)
      setData3(res.data.data)
      setPage(0)
    }
    const [filterYear,setFilterYear] = useState('');
    const [yearData,setYearData] = useState([]);
    useEffect(()=>{
      var temp = [];
      var i=0;
      var len=5;
      var curr_year = parseInt(moment(new Date()).format('YYYY'))
      for(i;i<len;i++){
          temp.push(curr_year.toString());
          curr_year--;
      }
      // console.log(temp)
      setYearData(temp)
    },[])
    const handleChangeFilterYear = (e,value)=>{
      setFilterYear(value)
      if(value){
        var t_arr = [];
        data1.forEach(el=>{
          if(selectedFilterDept){ 
            if(el.short_name === selectedFilterDept){
                var t_arr2 = JSON.parse(el.training_details);
                var i = 0;
                var len = t_arr2.length;
                for(i;i<len;i++){
                  if(t_arr2[i].id){
                    if(moment(t_arr2[i].datefrom).format('YYYY') === value){
                      t_arr.push(el);
                      break;
                    }
                  }
                }
            }
            
          }else{
            var t_arr2 = JSON.parse(el.training_details);
            var i = 0;
            var len = t_arr2.length;
            for(i;i<len;i++){
              if(t_arr2[i].id){
                if(moment(t_arr2[i].datefrom).format('YYYY') === value){
                  t_arr.push(el);
                  break;
                }
              }
            }
          }
          
        })
        setData(t_arr)
      }else{
        if(selectedFilterDept){
          var t_arr = [];
          data1.forEach(el=>{
            if(el.short_name === selectedFilterDept){
              t_arr.push(el);
            }
          })
          setData(t_arr)
        }else{
          setData(data1)
        }
      }
      
      // var newArr = data.filter((el)=>{
      //   return moment(el.datefrom).format('YYYY') === value.target.value
      // })
      // console.log(data)
    }
    const [filterNoTraining,setFilterNoTraining] = useState('')
    const [filterNoTrainingData,setFilterNoTrainingData] = useState([])
    const handleFilterTrainingNumber = (value)=>{
      setFilterNoTraining(value.target.value)
      var t_data = [...data]
      if(value.target.value){
        var temp = [];
        var temp2 = [];
        // t_data.filter((el)=>{
        //   return parseInt(value.target.value)>=parseInt(el.final_total)
        // })
        t_data.forEach(el=>{
          if(parseInt(value.target.value)===parseInt(el.final_total)){
            temp.push(el)
            temp2.push(el.emp_id)
          }
        })
        setData(temp)
        setFilterNoTrainingData(temp2)

      }else{
        if(selectedFilterDept){
          var t_arr = [];
          data1.forEach(el=>{
            if(el.short_name === selectedFilterDept){
              t_arr.push(el);
            }
          })
          setData(t_arr)
          setFilterNoTrainingData([])
        }else{
          setData(data1)
          setFilterNoTrainingData([])
        }
      }
      setPage(0)

      
    }
    const [searchVal,setSearchVal] = useState('');
    const filterData = data.filter(el=>el.fullname?.toUpperCase().includes(searchVal.toUpperCase()))
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{display:'flex',flexDirection:matches?'column-reverse':'row',justifyContent:'space-between',width:'100%'}}>
                <Grid item xs={12}>
                <Box sx={{display:'flex',flexDirection:totalResults.length>5?'column':'row',justifyContent:'space-between'}}>
                      <Box sx={{display:'flex',flexDirection:'column',margin:'5px',padding:'5px'}}>
                      <Typography sx={{color:red[800]}}><em><small>Generated shortlist per Department:</small></em></Typography>
                      <Stack  direction='row' sx={{flexWrap:'wrap',gap:1}}>
                        {
                          totalResults.map((data,key)=>
                          <Tooltip title={'Click to select '+data.short_name+' as filter'}>
                          <Chip
                          key={key}
                          sx={{color:'#1976d2',fontWeight:'bold'}}
                          label={<Box><em>{data.short_name} : {data.total}</em></Box>}
                          onClick={()=>selectFilter(data)}
                          />
                          </Tooltip>

                          )
                        }
                      </Stack>
                      </Box>
                      <Box sx={{display:'flex',flexDirection:'column',margin:'5px',padding:'5px'}}>
                      <Typography sx={{color:red[800]}}><em><small>Selected per Department:</small></em></Typography>
                      <Stack  direction='row' sx={{flexWrap:'wrap',gap:1}}>
                        {
                          totalSelectedPerDept.map((data,key)=>
                          <Chip
                          key={key}
                          sx={{color:'#1976d2',fontWeight:'bold'}}
                          label={<Box><em>{data.dept_name} : {data.total}</em>
                          {
                            data.total >=1
                            ?
                            <Tooltip title='Clear selected'><IconButton sx={{color: red[800],borderRadius: '50%',background: '#fff',padding: 0,marginLeft: '6px','&:hover':{background:'#fbfbfb'}}} onClick = {()=>clearSelectedDept(data.dept_code)}><CloseOutlinedIcon sx={{padding:'3px'}}/></IconButton></Tooltip>
                            :
                            ''
                          }</Box>}
                          />

                          )
                        }
                      </Stack>
                      </Box>
                </Box>
                
                
                </Grid>

              </Box>
                    

            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Box sx={{display:'flex',flexDirection:matches?'column':'row',alignItems:'center',gap:1}}>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-start',gap:1}}>
                  {/* <FormControl> */}
                  <Autocomplete
                        disablePortal
                        id="combo-box-filter-dept"
                        value = {selectedFilterDept}
                        onChange = {handleChangeFilter}
                        options={filterDeptData}
                        getOptionLabel={(option) => option.dept_title}
                        isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code}
                        renderInput={(params) => <TextField {...params} label="Filter Department" />}
                        sx={{width:500}}
                    />
                  {/* <InputLabel id="demo-simple-select-label">Filter Department</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedFilterDept}
                      label="Filter Department"
                      onChange={handleChangeFilter}
                      sx={{ width: 300 }}
                  >
                      {
                          filterDeptData.map((data,key)=>
                              <MenuItem value={data} key = {key}>{data.short_name}</MenuItem>

                          )
                      }
                  </Select> */}
                  {/* </FormControl> */}
                  <Button variant='outlined' color='error' onClick = {handleClearFilter}><BackspaceOutlinedIcon/></Button>

                </Box>
                <Autocomplete
                  disablePortal
                  id="combo-box-year"
                  value={filterYear}
                  options={yearData}
                  sx={{ width: 300 }}
                  onChange={(event,newValue)=>handleChangeFilterYear(event,newValue)}
                  renderInput={(params) => <TextField {...params} label="Filter year of training" />}
                />
                <TextField label='Filter number of training' type='number' value={filterNoTraining} onChange = {handleFilterTrainingNumber} sx={{mt:1,mb:1}}/>

                {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Without training" /> */}
                {/* <Tooltip title='Filter Employee Training by Year'><HelpIcon color='primary'/></Tooltip> */}
              </Box>
              <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
              <small style={{display:'flex',alignContent:'center'}}><LensIcon sx={{color:orange[100]}}/>No trainings</small>
              &nbsp;
              <small style={{display:'flex',alignContent:'center'}}><LensIcon sx={{color:red[500]}}/> Ban</small>
              </Box>
              
                    
            </Grid>
            <Grid item xs={12}>

            <Paper>
                <TextField label ='Search Employee' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)} InputProps={{
                 startAdornment:<InputAdornment position='start'><SearchIcon/></InputAdornment>
                }} size='small' sx={{
                mb:1}} fullWidth/>
                <TableContainer sx={{ maxHeight: 400 }}>
                <Table id = 'example' stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell/>
                            <StyledTableCell rowSpan={2} sortDirection={orderBy === 'final_total' ? order : false} sx={{maxWidth:100}}>
                            <SortableTable handleRequestSort = {(event)=>handleRequestSort(event,'final_total')} order={order}  orderBy = {orderBy} name = 'No. of trainings attended' propertyName ='final_total'/>
                            
                            </StyledTableCell>
                            
                            {/* <StyledTableCell rowSpan={2} sortDirection={orderBy === 'total_year' ? order : false} sx={{maxWidth:100}}>
                            <SortableTable handleRequestSort = {(event)=>handleRequestSort(event,'total_year')} order={order}  orderBy = {orderBy} name = 'Total No. of trainings attended per year' propertyName ='total_year'/>
                            </StyledTableCell> */}

                            <StyledTableCell rowSpan={2}>
                            <SortableTable handleRequestSort = {(event)=>handleRequestSort(event,'short_name')} order={order} orderBy = {orderBy} name = 'Department name' propertyName ='short_name'/>
                            </StyledTableCell>
                            <StyledTableCell rowSpan={2} sx={{minWidth:150}}>
                            <SortableTable handleRequestSort = {(event)=>handleRequestSort(event,'emp_lname')} order={order} orderBy = {orderBy} name = 'Employee name' propertyName ='emp_lname'/>
                            </StyledTableCell>
                            <StyledTableCell rowSpan={2} sx={{minWidth:110}}>Birthdate</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Age</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Position</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Employment status</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Date hired</StyledTableCell>
                            {/* <StyledTableCell rowSpan={2}>No. of years in CGB</StyledTableCell> */}
                            <StyledTableCell rowSpan={2}>Last Training status</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Training sanction date</StyledTableCell>
                            <StyledTableCell rowSpan={2}>On Going Trainings</StyledTableCell>
                            <StyledTableCell rowSpan={2}>SELECT <br/> <Tooltip title={isSelectAll?'Unselect all':'Select all'}><Checkbox checked = {isSelectAll} onChange = {handleSelectedAll} sx={{color:'#fff','&.Mui-checked': {color: '#fff'}}} checkedIcon={<RemoveOutlinedIcon/>}/></Tooltip></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{verticalAlign:'middle'}}>
                        {
                            stableSort(filterData, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key)=>
                            <Row key = {key} row={row} selectedSeeMore = {selectedSeeMore} setSelectedSeemore ={setSelectedSeemore} emp_id = {row.emp_id} selectedShortList = {selectedShortList} setSelectedShortList = {setSelectedShortList} matches = {matches}/>
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
            </Grid>
            
    <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
      <Button variant='contained' color='primary' onClick = {props.close} startIcon={<KeyboardArrowLeftOutlinedIcon/>}>back</Button>
      <Button variant='contained' color='primary' onClick = {saveSelectedShorlist} disabled={selectedShortList.length === 0 ? true:false} endIcon={<KeyboardArrowRightOutlinedIcon/>}>next</Button>
    </Grid>
    </Grid>
    )
}
function Row(props) {
    const { row } = props;
    const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[600],
        color: theme.palette.common.white,
        fontSize:props.matches?11:12,
        paddingBottom:0,
        paddingTop:0,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: props.matches?10:11,
      },
    }));
    const StyledTableCell3 = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[600],
        color: theme.palette.common.white,
        fontSize:props.matches?11:13,
        // paddingBottom:0,
        // paddingTop:0,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: props.matches?10:12,
      },
    }));
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[600],
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: props.matches?10:'auto',
        paddingBottom:0,
        paddingTop:0,
        fontSize:11
      },
    }));
    const [open, setOpen] = useState(false);
    const [openSeeMoreDialog,setOpenSeeMoreDialog] = useState(false)
    const [selectedSeeMoreData,setSelectedSeeMoreData] = useState([]);

    const formatSeeMore = (trainingRow,index) =>{
    if(props.selectedSeeMore.includes(props.emp_id)){
      return (
        <>
        <TableRow key={index} hover>
          <StyledTableCell2 component="th" scope="row">
              {index+1}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.title}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.datefrom}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.dateto}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.nohours}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.typeLD}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              {trainingRow.conducted}
          </StyledTableCell2>
          <StyledTableCell2 component="th" scope="row">
              N/A
          </StyledTableCell2>
        </TableRow>
        {
          JSON.parse(row.training_details).length === index +1
          ?
          <TableRow key={trainingRow.id}>
            <StyledTableCell2 colSpan={8}>
            <Button size='small' variant='outlined' onClick = {()=>seeLess(props.emp_id)} sx={{float:'right',fontSize:'11px'}} startIcon={<ExpandLessOutlinedIcon/>}>see less</Button>
            </StyledTableCell2>
          </TableRow>
          :
          null
        }
        
        </>
        
      )
    }else{
      if(index === 5){
        return (
          <TableRow key={trainingRow.id}>
            <TableCell colSpan={8}>
            {/* <Button size='small' variant='outlined' onClick = {()=>addSeeMore(props.emp_id)} sx={{float:'right',fontSize:'11px'}} startIcon={<ExpandMoreOutlinedIcon/>}>see more</Button> */}
            <Button size='small' variant='outlined' onClick = {()=>handleSeeMore(props.emp_id,row)} sx={{float:'right',fontSize:'11px','&:hover':{color:'#fff',background:blue[700]}}} startIcon={<ExpandMoreOutlinedIcon/>}>see more</Button>
            </TableCell>
          </TableRow>
        );
      }else{
        return null
      }
    }
    }
    
    const handleSeeMore = (emp_id,training_data) =>{
      // var temp = [...props.selectedSeeMore];
      // temp.push(emp_id);
      // props.setSelectedSeemore(temp)
      setSelectedSeeMoreData(training_data)
      setOpenSeeMoreDialog(true)
      setPage(0);

    }
    const seeLess = (emp_id) => {
      var index = props.selectedSeeMore.indexOf(emp_id)
      var temp = [...props.selectedSeeMore];
      if (index > -1) { 
        temp.splice(index, 1);
      }
      props.setSelectedSeemore(temp)
    }
    const handleSelectedShortlist = (emp_id,dept_code,is_ban) =>{
      var temp = [...props.selectedShortList];
      // if(!is_ban){
      //   if(temp.includes(emp_id)){
      //     var index = temp.indexOf(emp_id);
      //     if (index > -1) { 
      //       temp.splice(index, 1);
      //     }
      //     props.setSelectedShortList(temp)
      //   }else{
      //     temp.push(emp_id);
      //     props.setSelectedShortList(temp)
      //   }
      // }
      var index = temp.findIndex(el=>el.emp_id === emp_id);

      if(index>-1){
        // var index = temp.findIndex(el=>el.emp_id === );
        temp.splice(index, 1);
        props.setSelectedShortList(temp)
      }else{
        temp.push({
          emp_id:emp_id,
          dept_code:dept_code
        });
        props.setSelectedShortList(temp)
      }
      
    }
    const handleCloseSeeMoreDialog = () =>{
      setOpenSeeMoreDialog(false)
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
    const selectColor = (data) =>{
      switch(data){
        case 'Fully Implemented':
          return green[800];
          break;
        case 'Partially Implemented':
          return green[500];
          break;
        case 'Not Implemented':
        case 'Manually Ban':
          return '#fff';
          break;
        case 'On Going':
          return blue[600];
          break;

      }
    }
    const [openArray,setOpenArray] = useState([]);
    const addOpenArray = (id)=>{
      if(openArray.includes(id)){
        var temp = [...openArray];

        var index = temp.indexOf(id);
        if(index > -1){
          temp.splice(index,1);
          setOpenArray(temp)
        }
      }else{
        var temp = [...openArray];

        temp.push(id)
        setOpenArray(temp)
      }
    }
    const isSelected = (emp_id)=>{
      var check = props.selectedShortList.filter(el=>el.emp_id === emp_id);
      if(check.length>0){
        return true;
      }else{
        return false;
      }
    }
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset'},background:row.is_ban?red[500]:JSON.parse(row.final_total )=== 0 ? orange[100]:'auto','&:hover':{cursor:'pointer'}}} hover>
          <StyledTableCell sx={{background:'#fff'}}>
            {
              JSON.parse(row.training_details)[0].id !== null
              ?
              <Tooltip title = 'Show training details'><IconButton
              aria-label="expand row"
              size="small"
              onClick={() => addOpenArray(row.emp_id)}
              >
                {openArray.includes(row.emp_id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton></Tooltip>
              :
              <Tooltip title='No Trainings'><BlockIcon color='error'/></Tooltip>
            }
            
          </StyledTableCell>
          <StyledTableCell component="th" scope="row" /*onClick={()=>handleSelectedShortlist(row.emp_id,row.short_name,row.is_ban)}*/>
            {row.final_total}
          </StyledTableCell>
          {/* <StyledTableCell component="th" scope="row">
            {row.total_year}
          </StyledTableCell> */}
          <StyledTableCell component="th" scope="row">
            {row.short_name}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.fullname}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.emp_dob}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {moment().diff(moment(row.emp_dob,'YYYY-MM-DD'), 'years')}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.position_name}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.emp_status}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.date_hired}
          </StyledTableCell>
          {/* <StyledTableCell component="th" scope="row" onClick={()=>handleSelectedShortlist(row.emp_id,row.short_name,row.is_ban)}>
            N/A
          </StyledTableCell> */}
          <StyledTableCell component="th" scope="row">
            <span style={{color:selectColor(row.training_status),fontStyle:'italic',fontWeight:'bold'}}>
            {
              row.training_status && row.total_ongoing>0?row.training_status:''
            }
            <br/><br/>
            {row.training_status !== null?row.training_comments?'Comments: ' +row.training_comments:null:null}
            </span>
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.training_sanction?moment(row.training_sanction).format('MMMM DD,YYYY'):''}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {row.total_ongoing}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
          <Checkbox checked = {isSelected(row.emp_id)} onChange = {()=>handleSelectedShortlist(row.emp_id,row.dept_code,row.is_ban)}
          disabled = {
          row.training_sanction
          ?
            moment(row.training_sanction).format('YYYY-MM-DD')< moment(new Date()).format('YYYY-MM-DD')
            ?
            false
            :
            true
          :
          false
          }/>
          </StyledTableCell>
          
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0,fontSize:'.8rem' }} colSpan={14}>
          <Collapse in={openArray.includes(row.emp_id)} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
            <Typography sx={{color:'#2f98ff',fontWeight:'bold',fontSize:'13px'}} gutterBottom component="div">
                <em>Training Details</em>
            </Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
            <Table size="small">
                {/* <TableHead sx={{position:'sticky',top:0,background:'#fff'}}> */}
                <TableHead sx={{position:'sticky',top:0}}>
                    <TableRow>
                    <StyledTableCell2 rowSpan={2}/>
                    <StyledTableCell2 rowSpan={2}>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS / TRAINING PROGRAMS</StyledTableCell2>
                    <StyledTableCell2 colSpan={2} align='center'>INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)</StyledTableCell2>
                    <StyledTableCell2 rowSpan={2} align='center'>NUMBER OF HOURS</StyledTableCell2>
                    <StyledTableCell2 rowSpan={2} align='center'>TYPE OF I.D (Technical, Foundational, Managerial/Supervisory)</StyledTableCell2>
                    <StyledTableCell2 rowSpan={2} align='center'>CONDUCTED / SPONSORED BY</StyledTableCell2>
                    {/* <StyledTableCell2 rowSpan={2} align='center'>REMARKS</StyledTableCell2> */}
                    </TableRow>
                    <TableRow>
                        {/* <TableCell/> */}
                        <StyledTableCell2>FROM</StyledTableCell2>
                        <StyledTableCell2>TO</StyledTableCell2>
                    </TableRow>

                </TableHead>
                <TableBody>
                {JSON.parse(row.training_details).map((trainingRow,index) => (
                    index >= 5
                    ?
                    formatSeeMore(trainingRow,index)
                    :
                    <>
                    <TableRow key={index} hover>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {index+1}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row">
                        {trainingRow.title}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {trainingRow.datefrom}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {/* {moment(new Date(trainingRow.dateto), "YYYY-MM-DD").fromNow()} */}
                        {trainingRow.dateto}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {trainingRow.nohours}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {trainingRow.typeLD}
                    </StyledTableCell2>
                    <StyledTableCell2 component="th" scope="row" align='center'>
                        {trainingRow.conducted}
                    </StyledTableCell2>
                    {/* <StyledTableCell2 component="th" scope="row" align='center'>
                        N/A
                    </StyledTableCell2> */}
                    </TableRow>
                    </>

                ))}
                </TableBody>
            </Table>
            </TableContainer>
            </Box>
        </Collapse>
          </TableCell>
        </TableRow>
        <Dialog
            fullScreen
            open={openSeeMoreDialog}
            // onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'sticky',top:0 }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseSeeMoreDialog}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Training Details
                </Typography>
                <Button autoFocus color="inherit" onClick={handleCloseSeeMoreDialog}>
                close
                </Button>
            </Toolbar>
            </AppBar>
            <Box sx={{m:2}}>
            <Paper>
            <TextField defaultValue={selectedSeeMoreData.length !==0 ? selectedSeeMoreData.fullname:''} label='Employee Name' fullWidth inputProps={{readOnly:true}}/>
            <TableContainer sx={{mt:1}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                    <StyledTableCell3 rowSpan={2}>TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS / TRAINING PROGRAMS</StyledTableCell3>
                    <StyledTableCell3 colSpan={2} align='center'>INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)</StyledTableCell3>
                    <StyledTableCell3 rowSpan={2} align='center'>NUMBER OF HOURS</StyledTableCell3>
                    <StyledTableCell3 rowSpan={2} align='center'>TYPE OF I.D (Technical, Foundational, Managerial/Supervisory)</StyledTableCell3>
                    <StyledTableCell3 rowSpan={2} align='center'>CONDUCTED / SPONSORED BY</StyledTableCell3>
                    <StyledTableCell3 rowSpan={2} align='center'>REMARKS</StyledTableCell3>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell3 align='center'>FROM</StyledTableCell3>
                        <StyledTableCell3 align='center'>TO</StyledTableCell3>
                    </TableRow>

                </TableHead>
                <TableBody>
                {
                  selectedSeeMoreData.length !==0
                  ?
                  JSON.parse(selectedSeeMoreData.training_details).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trainingRow,index) => (
                    <TableRow key={index} hover>
                    <StyledTableCell3 component="th" scope="row">
                        {trainingRow.title}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        {trainingRow.datefrom}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        {/* {moment(new Date(trainingRow.dateto), "YYYY-MM-DD").fromNow()} */}
                        {trainingRow.dateto}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        {trainingRow.nohours}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        {trainingRow.typeLD}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        {trainingRow.conducted}
                    </StyledTableCell3>
                    <StyledTableCell3 component="th" scope="row" align='center'>
                        N/A
                    </StyledTableCell3>
                    </TableRow>
                  ))
                  :
                  null
                }
                </TableBody>
            </Table>
            </TableContainer>
            
            <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={selectedSeeMoreData.length !==0 ? JSON.parse(selectedSeeMoreData.training_details).length:0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
              </Paper>
            </Box>

        </Dialog>
      </React.Fragment>
    );
  }
function SortableTable(props){
  const {handleRequestSort,order,orderBy,propertyName,name} = props;
  return (
    <TableSortLabel
        active={orderBy === propertyName}
        direction={orderBy === propertyName ? order : 'asc'}
        onClick={handleRequestSort}
        IconComponent={ArrowDropDownIcon}
        sx={{
            '& .MuiTableSortLabel-icon': {
                color: '#fff !important',
            },
        }}
      >
        <span style={{color:'#fff'}}>{name}</span>
        {orderBy === propertyName ? (
          <Box component="span" sx={visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </TableSortLabel>
  )
}