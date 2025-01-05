import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {red,yellow} from '@mui/material/colors'
function Warning({title,color}) {
  return (
    <Box sx={{flex:1}}>
        <small style={{backgroundColor:color,padding:'.3rem',borderRadius:'.3rem',textAlign:'center',padding:'.3rem',color:'#fff'}}>{title}</small>
    </Box>
  )
}

export default Warning