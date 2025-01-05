import React from "react";
import { TableCell, TableRow, Tooltip,Box,IconButton,Typography,Button,ButtonGroup } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { blue, grey, orange, red, yellow } from "@mui/material/colors";

export const StrategicPriority = (props) =>{
    return(
        <>
        {
        props.strategicPriorityData.map((item,key)=>
            <React.Fragment key={key}>
            <TableRow>
                <TableCell align="right" colSpan={3}>
                    <Box sx={{display:'flex',justifyContent:'row',gap:1,alignItems:'center',justifyContent:'flex-end'}}>
                    <Tooltip title='Remove'><IconButton color='error' onClick={()=>props.handleRemoveType(key)}><DeleteIcon/></IconButton></Tooltip>
                    <Typography sx={{textAlign:'left'}}>{item.mfo}</Typography>
                    <IconButton color='primary' onClick={()=>props.handleOpenAddTypeDtl(key)}><AddBoxIcon/></IconButton>
                </Box>
                </TableCell>
            </TableRow>
            {
                item.details.map((item2,key2)=>
                    <TableRow key={key2} hover>
                        <TableCell align="right">
                            <Tooltip title='Remove'><IconButton color='error' onClick={()=>props.handleRemoveTypeDtl(key,key2)} sx={{'&:hover':{color:'#fff',background:red[900]}}}className="custom-iconbutton"><RemoveIcon fontSize="small"/></IconButton></Tooltip>
                        </TableCell>
                        <TableCell>
                            <Typography><strong>{`${key+1}.${key2+1}`}</strong></Typography>
                        </TableCell>
                        <TableCell>
                            <Box sx={{display:'flex',justifyContent:'row',gap:1,justifyContent:'flex-end', alignItems:'center'}}>
                            <Typography>{item2.details_title} </Typography>
                            
                                <ButtonGroup 
                                variant="outlined"
                                orientation="vertical">
                                
                                {
                                    key2 !== 0
                                    ?
                                    <Tooltip title='Move Up'>
                                    <Button onClick={()=>props.handleMove('up',key,key2)} size="small" sx={{'&:hover':{background:blue[900],color:'#fff'}}}>
                                        <ArrowDropUpIcon/>
                                    </Button>
                                    </Tooltip>
                                    :
                                    ''
                                }
                                
                                {
                                    item.details.length-1 !== key2
                                    ?
                                    <Tooltip title='Move Down' >
                                    <Button onClick={()=>props.handleMove('down',key,key2)} size="small" sx={{'&:hover':{background:blue[900],color:'#fff'}}}>
                                        <ArrowDropDownIcon/>
                                    </Button>
                                    </Tooltip>
                                    :
                                    ''
                                }
                                </ButtonGroup>
                                
                            
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            }
            
            </React.Fragment>
        )
        
    }
    </>
    )
}