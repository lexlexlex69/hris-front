import React,{useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import {Box,Typography,FormControl,InputLabel,Select,MenuItem,Button} from '@mui/material';
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
export default function Participants(props){
  const [data,setData] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  useEffect(()=>{
    var temp = [];
    props.rows.forEach(element => {
        if(element.approved === 1){
            temp.push(element)
        }
    });
    setData(temp)
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
    return(
      <>
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
                <StyledTableCell align='center'>
                  Requirement Status
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row,key) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {row.short_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                  {row.lname}, {row.fname}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.position_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.emp_status}
                  </TableCell>
                  {
                    row.approved === 1
                    ?
                    <TableCell component="th" scope="row" sx={{color:green[800]}}>
                      Approved
                    </TableCell>
                    :
                    <TableCell component="th" scope="row" sx={{color:grey[500]}}>
                    Pending
                    </TableCell>
                  } 
                  <TableCell component="th" scope="row" align='center'>
                    test<br/>
                    <IconButton disabled={row.approved === 1 ? false:true}><RateReviewOutlinedIcon color='primary'/></IconButton>
                  </TableCell>
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
      </>

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
  