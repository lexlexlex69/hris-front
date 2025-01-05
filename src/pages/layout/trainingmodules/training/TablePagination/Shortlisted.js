import React,{useEffect, useState} from 'react';
import {Box,Typography,FormControl,InputLabel,Select,MenuItem,Button,Grid,TextField, Tooltip,} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {TableHead} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {green,orange,grey,blue} from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LetterHead from '../../../forms/letterhead/LetterHead';
import NominationForm from '../../../forms/nominationform/NominationForm';
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Shortlisted(props){
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[800],
    color: theme.palette.common.white,
    fontSize:matches?13: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize:matches?11:13,
  },
}));
  const [data,setData] = useState([])
  const [data1,setData1] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('All');
  const [filterDeptData, setFilterDeptData] = useState([]);
  const [filterDept, setFilterDept] = useState('All');
  const [filterData,setFilterData] = useState(['All','Approved','Pending','Dept Approved','HRDC Approved']);
  useEffect(()=>{
    /**
      Alternative
    */
    // var data2 = {
    //   training_details_id:props.id
    // }
    // getTrainingsDetailsEmpNames(data2)
    // .then(res=>{
    //   // console.log(res.data)
    //   setData(res.data)
    //   setData1(res.data)
    //   const uniqueDept = [...new Set(props.rows.map(item => item.short_name))];
    //   var tempArr = ['All'];
    //   var temp = tempArr.concat(uniqueDept.sort());
    //   // console.log(temp)
    //   // temp.push(uniqueDept.sort())
    //   setFilterDeptData(temp);
    // }).catch(err=>{
    //   console.log(err)
    // })
    setData(props.rows)
    setData1(props.rows)
    const uniqueDept = [...new Set(props.rows.map(item => item.short_name))];
    var tempArr = ['All'];
    var temp = tempArr.concat(uniqueDept.sort());
    // console.log(temp)
    // temp.push(uniqueDept.sort())
    setFilterDeptData(temp);
  },[props.rows])
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (event) => {
    setPage(0);
    var temp = [];
    switch(event.target.value){
      case 'Approved':
        if(filterDept==='All'){
          let new_arr = data1.filter((el)=>{
            return el.approved === 1
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approved === 1 && el.short_name === filterDept
          })
          setData(new_arr)
        }
        
        break;
      case 'Pending':
        if(filterDept==='All'){
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'PENDING'
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'PENDING' && el.short_name === filterDept
          })
          setData(new_arr)
        }
        break;
      case 'All':
        if(filterDept === 'All'){
          setData(data1)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.short_name === filterDept
          })
          setData(new_arr)
        }
        break;
      case 'Dept Approved':
        if(filterDept==='All'){
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'DEPT APPROVED'
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'DEPT APPROVED' && el.short_name === filterDept
          })
          setData(new_arr)
        }
        break;
        case 'HRDC Approved':
         if(filterDept==='All'){
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'HRDC APPROVED'
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'HRDC APPROVED' && el.short_name === filterDept
          })
          setData(new_arr)
        }
        break;
    }
    setFilter(event.target.value);
    
  };
  const handleFilterDeptChange = (event)=>{
    setPage(0);
    var temp = [];
    switch(filter){
      case 'Approved':
        if(event.target.value === 'All'){
          let new_arr = data1.filter((el)=>{
            return el.approved === 1;
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approved === 1 && el.short_name === event.target.value ;
          })
          setData(new_arr)
        }
        
        break;
      case 'Pending':
        if(event.target.value === 'All'){
          let new_arr = data1.filter((el)=>{
            return el.approved === 0;
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approved === 0 && el.short_name === event.target.value ;
          })
          setData(new_arr)
        }
        break;
      case 'All':
        if(event.target.value === 'All'){
          setData(data1)
        }else{
          data1.forEach(element => {
            if(element.short_name === event.target.value){
              temp.push(element)
            }
          });
          setData(temp)
        }
      case 'Dept Approved':
        if(event.target.value === 'All'){
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'DEPT APPROVED';
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'DEPT APPROVED' && el.short_name === event.target.value ;
          })
          setData(new_arr)
        }
      case 'HRDC Approved':
        if(event.target.value === 'All'){
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'HRDC APPROVED';
          })
          setData(new_arr)
        }else{
          let new_arr = data1.filter((el)=>{
            return el.approval_status === 'HRDC APPROVED' && el.short_name === event.target.value ;
          })
          setData(new_arr)
        }
      break;
    }
    setFilterDept(event.target.value);

  }
    return(
      <React.Fragment>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
            <FormControl sx={{width:matches?'100%':'200px',mb:1,mr:2}}>
              <InputLabel id="demo-simple-select-label">Filter Dept</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterDept}
                label="Filter Dept"
                onChange={handleFilterDeptChange}
              >
                {
                  filterDeptData.map((data,key)=>
                    <MenuItem value={data}>{data}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            <FormControl sx={{width:matches?'100%':'200px',mb:1}}>
              <InputLabel id="demo-simple-select-label">Filter Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filter Status"
                onChange={handleFilterChange}
              >
                {
                  filterData.map((data,key)=>
                    <MenuItem value={data}>{data}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={6} sx={{display:'flex',justifyContent:'flex-end',mb:matches?1:0}}>
            {
              data.length === 0
              ?
              null
              :
              <ExcelFile element={<Tooltip title='Download List'><IconButton className='custom-iconbutton' color='primary'><DownloadIcon/></IconButton></Tooltip>} filename="Shortlisted">
                        <ExcelSheet data={data} name="Participants">
                            <ExcelColumn label="Department" value="short_name"/>
                            <ExcelColumn label="First Name" value="fname"/>
                            <ExcelColumn label="Last Name" value="lname"/>
                            <ExcelColumn label="Position" value="position_name"/>
                            <ExcelColumn label="Status" value={(col)=>col.approved === 1 ? 'APPROVED':'PENDING'}/>
                        </ExcelSheet>
              </ExcelFile>
            }
            
              {/* <IconButton sx={{float:'right'}}><PrintOutlinedIcon/></IconButton> */}
            </Grid>
          </Grid>

          
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Department
                </StyledTableCell>
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
                  Status
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row,key) => (
                <TableRow key={key}>
                  <StyledTableCell component="th" scope="row">
                    {row.short_name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                  {row.lname}, {row.fname}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.position_name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.emp_status}
                  </StyledTableCell>
                  {
                    row.approval_status === 'PENDING'
                    ?
                    <StyledTableCell component="th" scope="row" sx={{color:grey[800]}}>
                      {row.approval_status}
                    </StyledTableCell>
                    :
                    <StyledTableCell component="th" scope="row" sx={{color:green[500]}}>
                      {row.approval_status}
                    </StyledTableCell>
                  } 
                </TableRow>
              ))}
    
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />

              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </React.Fragment>

    )
}
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  