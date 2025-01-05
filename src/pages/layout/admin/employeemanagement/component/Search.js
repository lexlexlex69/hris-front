import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { searchEmployee } from "../EmpManagementRequest";
import Swal from "sweetalert2";
import { APILoading } from "../../../apiresponse/APIResponse";
import { APIError } from "../../../customstring/CustomString";
export const Search = ({setData}) =>{
    const [searchVal,setSearchVal] = useState('');
    const submitSearch = async(e) => {
        e.preventDefault();
        try{
            APILoading('info','Searching Employee','Please wait...')
            var t_data = {
                data:searchVal
            }
            const res = await searchEmployee(t_data)
            if(res.data.length>0){
                setData(res.data)
                // console.log(res.data)
                Swal.close();
            }else{
                setData([])
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    text:'Employee not found !'
                })
            }
        }catch(err){
            APIError(err)
        }
        
    }
    return(
        <form onSubmit={submitSearch}>
        <Box sx={{display:'flex',alignItems:'center',height:'100%',gap:1}}>
            <TextField label ='Search Employee' value={searchVal} onChange={(val)=>setSearchVal(val.target.value)}
            InputProps ={{
                endAdornment:(
                <InputAdornment position="end">
                <SearchIcon />
                </InputAdornment>
                )
            }} required size='small' placeholder="Firstname | Lastname"/>
            <Button variant="contained" color="info" className="custom-roundbutton" sx={{height:'100%'}} type="submit">Submit Search</Button>
        </Box>

        </form>
    )
}