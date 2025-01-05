import React,{useState} from 'react';
import { Grid,TextField,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,Button,Typography } from '@mui/material';
import Swal from 'sweetalert2';
//Icons
import SearchIcon from '@mui/icons-material/Search';
import { searchEmployee } from './CustomSearchEmployeeRequest';

export default function CustomSearchEmployee(props){
    const [searchVal,setSearchVal] = useState('')
    const [searchData,setSearchData] = useState([])
    const handleSearchEmployee = (e)=>{
        e.preventDefault();
        var t_data = {
            data:searchVal
        }
        searchEmployee(t_data)
        .then(res=>{
            console.log(res.data)
            setSearchData(res.data)
        }).catch(err=>{
            Swal.fire({
                icon:'errpr',
                title:err
            })
        })
    }
    const handleSelectEmp = (row)=>{
        props.handleSelect(row)
        
    }
    return(
        <form onSubmit={handleSearchEmployee}>
            <Grid container spacing={1}>
            {/* <Grid item xs={12} sx={{mb:2}}>
                <Typography>Searching Employee</Typography>
            </Grid> */}
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
            <TextField type='text' fullWidth label='Search Employee' placeholder='Employee firstname | lastname' required value = {searchVal} onChange = {(val)=>setSearchVal(val.target.value)}/>
            <Button variant='outlined' type='submit'><SearchIcon/></Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Position
                                </TableCell>
                                <TableCell>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                searchData.map((row,key)=>
                                    <TableRow hover key={key}>
                                        <TableCell>
                                            {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'. ':''} 
                                        </TableCell>
                                        <TableCell>
                                            {row.position_name}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={()=>handleSelectEmp(row)} variant='contained' size='small'>Select</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
        </form>
    )
}