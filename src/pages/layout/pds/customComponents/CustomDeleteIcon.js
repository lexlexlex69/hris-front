import React from 'react'
import {blue,red} from '@mui/material/colors'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';

const CustomDeleteIcon =  React.forwardRef((props,ref) =>  {
  return (
    <Tooltip title="delete row">
    <DeleteOutlineIcon fontSize='large'  onClick={props.onClick ? props.onClick : null} sx={{ color: red[500],border:`2px solid ${red[500]}`,borderRadius:'.2rem',p:.5,cursor:'pointer','&:hover': {bgcolor:red[500],color:'#fff'},transition:`all .2s` }} />
    </Tooltip>
  )
})

export default CustomDeleteIcon