import React from 'react'
import {blue,red,yellow} from '@mui/material/colors'
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import Tooltip from '@mui/material/Tooltip';

const CustomRemove =  React.forwardRef((props,ref) => {
  return (
      <Tooltip title="undo">
    <ReplayIcon fontSize='large'  onClick={props.onClick ? props.onClick : null} sx={{ color: props.color,border:`2px solid ${props.color}`,borderRadius:'.2rem',p:.5,cursor:'pointer','&:hover': {bgcolor:props.color,color:'#fff',transition:`all .2s`} }} />
      </Tooltip>
  )
})

export default CustomRemove