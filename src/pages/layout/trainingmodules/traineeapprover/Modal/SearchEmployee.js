import React from 'react';
import { Box,Grid,Button,TextField } from '@mui/material';
import { searchEmployee } from '../TraineeApproverRequest';
import Swal from 'sweetalert2';
import {red} from '@mui/material/colors';
export default function SearchEmployee (props){
    const [searchData,setSearchData] = React.useState('')
    const [resultData,setResultData] = React.useState('')
    const submitSearch = (event)=> {
        event.preventDefault();
        searchEmployee(searchData)
        .then(respo=>{
            const data = respo.data
            setResultData(data)
            if(data.length ===0){
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    html:'No data found'
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const selectRow = (data) =>{
        var t_id = props.data.filter((el)=>{
            return el.emp_no === data.id
        })
        if(t_id.length === 0){
            props.setEmpID(data.id)
            props.close()
        }else{
            Swal.fire({
                icon:'warning',
                title:'Notice !',
                html:'Employee already assign to other office. Please select other employee.'
            })
        }
        
    }
    const isAlreadyAssign = (id)=>{
        var t_id = props.data.filter((el)=>{
            return el.emp_no === id
        })
        if(t_id.length === 0){
            return false;
        }else{
            return true;
        }
    }
    return(
        <Box sx={{m:4}}>
            <form onSubmit={submitSearch}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField label='e.g. lastname,firstname' fullWidth required value = {searchData} onChange = {(value)=>setSearchData(value.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='outlined' size='small' sx={{float:'right'}}type = 'submit'>Search</Button>
                    </Grid>
                </Grid>
            </form>
            {resultData.length !==0
            ?
            <Box sx={{mt:2}}>
            <small style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',fontSize:'12px'}}><em>* click row to select <strong>Employee ID</strong></em></small>
            <Box sx={{maxHeight:'40vh',overflowY:'scroll'}}>
            <table className='table table-bordered table-hover' style={{marginTop:'5px'}}>
                <thead style={{position:'sticky',top:'-3px',background:'#fff'}}>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {resultData.map((data,key)=>
                        isAlreadyAssign(data.id)
                        ?
                        <tr key = {key} style={{color:red[800]}}>
                            <td>{data.id}</td>
                            <td>{data.fname +' '+data.lname}</td>
                        </tr>
                        :
                        <tr key = {key} onClick = {()=>selectRow(data)} style={{cursor:'pointer'}} disabled>
                            <td>{data.id}</td>
                            <td>{data.fname +' '+data.lname}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </Box>
            </Box>
            :
            ''
            }
            </Box>
    )
}