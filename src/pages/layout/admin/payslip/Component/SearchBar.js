import React, { useEffect,memo } from 'react';
import {TextField} from '@mui/material';

const SearchBar = memo(({id,value,onChange}) =>{
    useEffect(()=>{
        console.log('render')
    },[])
    return(
        <TextField label={'Search '+Math.floor(Math.random()*10)} value = {value} onChange={e => onChange(id,e.target.value)}/>
    )
})
export default SearchBar;