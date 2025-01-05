import { Grid, Typography,Box,FormControl,InputLabel,Select,MenuItem, IconButton, Tooltip, Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import moment from "moment";
import React,{useEffect, useState} from "react";
import RemoveIcon from '@mui/icons-material/Remove';
export default function UpdateDates(props){
    const [data,setData] = useState([])
    useEffect(()=>{
        setData(props.data)
    },[])
    const handleChangePeriod = (event,index) => {
        var temp = [...data];
        temp[index].period = event.target.value
        setData(temp)
    };
    const handleRemoveDate = (index) =>{
        var temp = [...data];
        temp.splice(index,1);
        console.log(temp)
        setData(temp)
    }
    const handleSave = () =>{
        console.log(data)
        props.close();
        props.handleSave(data)
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{maxHeight:'50vh',overflowY:'scroll'}}>
                {
                    data.length>0
                    ?
                    data.map((item,key)=>
                    <Box sx={{background:'#ebebeb',mb:1,p:1}}>
                    <Typography key={key} sx={{display:'flex',justifyContent:'space-between',alignItems:'center', mb:1}}>
                        {moment(item.date).format('MMMM DD, YYYY')}
                        <Tooltip title='Remove date from selection'><IconButton color='error' onClick={()=>handleRemoveDate(key)}><RemoveIcon/></IconButton></Tooltip>
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Period</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={item.period}
                        label="Period"
                        onChange={(event)=>handleChangePeriod(event,key)}
                        >
                        <MenuItem value='NONE'>NONE</MenuItem>
                        <MenuItem value='AM'>AM</MenuItem>
                        <MenuItem value='PM'>PM</MenuItem>

                        </Select>
                    </FormControl>
                    </Box>
                    )

                    :
                    null
                }
                </Box>
                
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant="contained" color="success" className="custom-roundbutton" size="small" onClick={handleSave}>Save</Button>
                <Button variant="contained" color="error" className="custom-roundbutton" size="small" onClick={props.close}>Cancel</Button>
            </Grid>
        </Grid>
    )
}