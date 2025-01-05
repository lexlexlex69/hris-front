import React,{useState} from 'react';
import { searchEmployeePerDept, updateSRATUSignatories } from '../SRATURequest';
import { Grid,TextField,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,Button } from '@mui/material';
import Swal from 'sweetalert2';
//Icons
import SearchIcon from '@mui/icons-material/Search';

export default function SearchEmployee(props){
const [searchVal,setSearchVal] = useState('')
    const [searchData,setSearchData] = useState([])
    const handleSearchEmployee = (e)=>{
        e.preventDefault();
        var t_data = {
            value:searchVal
        }
        searchEmployeePerDept(t_data)
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
        console.log(row)
        row.type = props.infoAction;
        Swal.fire({
            icon:'question',
            title:'Confirm update signatory?',
            confirmButtonText:'Yes',
            showCancelButton:true
        }).then(res=>{
            if(res.isConfirmed){
                Swal.fire({
                    icon:'info',
                    title:'Updating signatory',
                    html:'Please wait...',
                    allowEscapeKey:false,
                    allowOutsideClick:false
                })
                Swal.showLoading()
                /**
                Update signatory based on info action 1 = prepared by , 2 = dept head
                */
                row.emp_name = row.fname+' '+(row.mname?row.mname.charAt(0)+'. ':' ')+row.lname
                updateSRATUSignatories(row)
                .then(res=>{
                    if(res.data.status === 200){
                        props.setOpenSearchEmployee(false)
                        props.setSratuPreparedByName(res.data.data.prepared_by_name);
                        props.setSratuPreparedByPos(res.data.data.prepared_by_pos);
                        props.setSratuDeptHeadName(res.data.data.dept_head_name);
                        props.setSratuDeptHeadPos(res.data.data.dept_head_pos);
                        Swal.fire({
                            icon:'success',
                            title:res.data.message
                        })
                    }else{
                        Swal.fire({
                            icon:'error',
                            title:res.data.message
                        })
                    }
                }).catch(err=>{
                    Swal.fire({
                        icon:'error',
                        title:err
                    })
                })
            }
        })
    }
    return(
        <form onSubmit={handleSearchEmployee}>
            <Grid container spacing={1}>
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