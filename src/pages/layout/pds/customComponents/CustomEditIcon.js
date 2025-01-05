import React from 'react'
import { blue, red, yellow } from '@mui/material/colors'
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

const CustomEditIcon = React.forwardRef((props, ref) => {
  return (
    <Tooltip title="edit row">
      <EditIcon fontSize='large' onClick={props.onClick ? props.onClick : null} sx={{ color: yellow[800], border: `2px solid ${yellow[800]}`, borderRadius: '.2rem', p: .5, cursor: 'pointer', '&:hover': { bgcolor: yellow[800], color: '#fff', transition: `all .2s` } }} />
    </Tooltip>
  )
})

export default CustomEditIcon