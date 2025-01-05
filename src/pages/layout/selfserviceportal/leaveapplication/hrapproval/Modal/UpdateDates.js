import { Grid, Typography,Box,InputLabel , MenuItem ,FormControl ,Select, Tooltip, IconButton, Button, Divider } from '@mui/material';
import React,{useEffect, useState} from 'react';
//icons
import DeleteIcon from '@mui/icons-material/Delete';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function UpdateDates (props){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [dates,setDates] = useState([])
    useEffect(()=>{
        // console.log(props.info)
        if(JSON.parse(props.info.inclusive_dates).length >0){
            if(props.updateType === 'dwopay'){
                var temp = JSON.parse(props.info.inclusive_dates);

                temp.forEach(el=>{
                    el.late_filing=true
                })
                console.log(temp)
                setDates(temp)
            }else{
                var temp = JSON.parse(props.info.inclusive_dates)
                setDates(temp)
                console.log(temp)

            }
        }else{
            if(props.info.inclusive_dates_without_pay || props.info.inclusive_dates_without_pay!=='null'){
                if(props.updateType === 'dwopay'){
                    var temp = JSON.parse(props.info.inclusive_dates_without_pay);

                    temp.forEach(el=>{
                        el.late_filing=true
                    })
                    setDates(temp)
                    console.log(temp)
                }else{
                    var temp = JSON.parse(props.info.inclusive_dates_without_pay);

                    temp.forEach(el=>{
                        el.late_filing=false
                    })
                    console.log(temp)
                    setDates(temp)
                }
                // setDates(JSON.parse(props.info.inclusive_dates_without_pay))
            }
        }
    },[])
    const handleChange= (index,val)=>{
        var temp = [...dates];
        temp[index].period = val.target.value
        setDates(temp)
    }
    const handleRemove = (index) =>{
        var temp = [...dates];
        temp.splice(index,1);
        setDates(temp)
    }
    const handleSave = ()=>{
        props.save(dates)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sx={{mt:2,display:'flex',flexDirection:'column',gap:2}}>
                {
                    dates.map((item,key)=>
                        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',gap:1}} key={key}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{item.date}</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={item.period}
                                    label={item.date}
                                    onChange={(val)=>handleChange(key,val)}
                                    >
                                    <MenuItem value='AM'>AM</MenuItem>
                                    <MenuItem value='PM'>PM</MenuItem>
                                    <MenuItem value='NONE'>NONE</MenuItem>
                                </Select>
                            </FormControl>
                            <Tooltip title='Remove'>
                                <Button color ='error' variant='outlined'sx={{height:'100%'}} onClick={()=>handleRemove(key)}>
                                    <DeleteIcon/>
                                </Button>
                            </Tooltip>
                        </Box>
                    )
                }
            
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                <Button variant='contained' size='small' color='success' className='custom-roundbutton'onClick={handleSave}>Save</Button>
                <Button variant='contained' size='small' color='error' className='custom-roundbutton' onClick = {props.close}>Cancel</Button>
            </Grid>
        
        </Grid>
    )
}