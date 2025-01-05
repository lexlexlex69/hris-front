import React,{useEffect, useState} from 'react'
import {Paper,TableContainer,Table,TableHead,TableRow,TableBody,TablePagination,Box,TextField,InputAdornment,Tooltip,IconButton,Typography} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from 'moment';
import { searchValueFunction } from '../../searchtable/Search';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green} from '@mui/material/colors';
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
export default function ApprovedDatatable(props){
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [data,setData] = useState([]);
    useEffect(()=>{
        setData(props.data)
    },[props.data])
    const [searchValue,setSearchValue] = useState('');
    const handleSearch = (value)=>{
        setPage(0)
        setSearchValue(value.target.value)
        var item = ['fname','lname']
        var temp = searchValueFunction(props.data,item,value.target.value);
        setData(temp)
    }
    const handleClearSearch = () =>{
        setSearchValue('')
        setData(props.data)
    }
    return(
        <>
        <TableContainer>
            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <TextField label='Search Table' sx={{m:1}} value = {searchValue} onChange={handleSearch} placeholder='Firstname, Lastname' InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon/></InputAdornment>,endAdornment:<InputAdornment position="end"><Tooltip title='Clear Search'><IconButton onClick={handleClearSearch} color='error'><ClearOutlinedIcon/></IconButton></Tooltip></InputAdornment>
          }}/>
          
            </Box>
            <Table>
            <TableHead>
                <TableRow>
                    <StyledTableCell>
                        Name
                    </StyledTableCell>
                    <StyledTableCell>
                        Department
                    </StyledTableCell>
                    <StyledTableCell>
                        Position
                    </StyledTableCell>
                    <StyledTableCell>
                        Employment Status
                    </StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data,key)=>
                    <TableRow key={key}>
                        <StyledTableCell>
                            {data.lname}, {data.fname}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.short_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.position_name}
                        </StyledTableCell>
                        <StyledTableCell>
                            {data.description}
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

        </>
    )
}