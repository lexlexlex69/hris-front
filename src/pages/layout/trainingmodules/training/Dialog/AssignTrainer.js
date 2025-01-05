import React,{useEffect, useState} from 'react';
import {Grid,Box,Typography,Button,TextField,IconButton,Paper,InputLabel,MenuItem,FormControl,Select,Tooltip,Fade,Slide } from '@mui/material';
import moment from 'moment';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,orange,green} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
export default function AssignTrainer(props){
    const [dateData,setDateData] = useState([])
    const [trainerData,setTrainerData] = useState([])
    const [periodData,setPeriodData] = useState(['AM','PM','AM-PM']);
    useEffect(()=>{
        // console.log(props.trainer.trainer)
        console.log(props.trainerScheduleData)
        setTrainerData(props.trainer.trainer)

        if(props.trainerScheduleData.length !==0){
            setDateData(props.trainerScheduleData)
        }else{
            var from = new Date(props.from);
            var to = new Date(props.to);
            // var days = to.diff(from, 'days')+1;
            var arr = [];
            /**
             * get dates from date range
             */
            while(moment(from).format('YYYY-MM-DD') <= moment(to).format('YYYY-MM-DD')){
                arr.push({
                    date:moment(from).format('YYYY-MM-DD'),
                    details:[{
                        period:'',
                        trainer_id:'',
                        trainer_name:'',
                        topic:'',
                    }]
                })
                from.setDate(from.getDate()+1)
            }
            setDateData(arr)
        }
        

    },[props.trainerScheduleData])
    const addDetails = (index) =>{
        var temp = [...dateData];
        temp[index].details.push({
            period:'',
            trainer_id:'',
            trainer_name:'',
            topic:'',
        })
        setDateData(temp)
    }
    const removeDetails = (index,index2) => {
        var temp = [...dateData];
        temp[index].details.splice(index2,1);
        setDateData(temp)
    }
    const handleSetDetails = (value,index,index2,type)=>{
        var temp = [...dateData];
        temp[index].details[index2][type] = value.target.value;
        setDateData(temp)
    }
    const handleSetTrainerDetails = (value,index,index2)=>{
        var temp = [...dateData];
        var name = '';
        for(var i=0;i<trainerData.length;i++){
            if(value.target.value === trainerData[i].trainer_id){
                name = trainerData[i].lname+', '+trainerData[i].fname
            }
        }
        temp[index].details[index2].trainer_name = name;   
        temp[index].details[index2].trainer_id = value.target.value;
        setDateData(temp)
    }
    const handleSaveData = ()=>{
        props.setTrainerScheduleData(dateData);
        props.close();
    }
    const resetInfo = ()=>{
        var from = new Date(props.from);
        var to = new Date(props.to);
        // var days = to.diff(from, 'days')+1;
        var arr = [];
        /**
         * get dates from date range
         */
        while(moment(from).format('YYYY-MM-DD') <= moment(to).format('YYYY-MM-DD')){
            arr.push({
                date:moment(from).format('YYYY-MM-DD'),
                details:[{
                    period:'',
                    trainer_id:'',
                    trainer_name:'',
                    topic:'',
                }]
            })
            from.setDate(from.getDate()+1)
        }
        setDateData(arr)
    }
    return( 
        <Grid container spacing={2} >
            <Grid item xs={12}>
                <Tooltip title='Reset info'><IconButton sx={{float:'right','&:hover':{color:'#fff',background:blue[800]}}} color='primary' className='custom-iconbutton' onClick={resetInfo}><RestartAltOutlinedIcon/></IconButton></Tooltip>
            </Grid>
            {
                dateData.map((data,key)=>
                <Grid key={key} item xs={12} sx={{border:'solid 1px #fff',m:2,borderRadius:'5px',position:'relative'}}>
                    <Typography sx={{background: green[700],position: 'absolute',color: '#fff',top: 0,left: 0,padding: '5px 20px 5px 5px',borderTopRightRadius: '20px',borderBottomRightRadius: '20px',fontWeight:'bold',fontSize:'.8rem',verticalAlign:'center'}}>Day {key+1}</Typography>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',pt:3}}>
                        <Typography sx={{background:orange[800],width:'100%',p:1,color:'#fff',borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px',display:'flex',alignItems:'center'}}><CalendarMonthIcon sx={{mr:1}}/> {moment(data.date,'YYYY-MM-DD').format('MMMM DD,YYYY')} </Typography>
                        {/* <Tooltip title='Add'><IconButton color='success' sx={{mr:1,'&:hover':{background:green[800],color:'#fff'}}} className='custom-iconbutton' onClick ={()=>addDetails(key)}><AddOutlinedIcon/></IconButton></Tooltip> */}
                    </Box>
                    <Grid item container spacing={1}>
                    {data.details.map((data2,key2)=>
                        <Slide direction='down' in key = {key2}  mountOnEnter unmountOnExit>
                        <Grid item xs={12} sx={{p:1,ml:2,mr:2}} >
                        {
                            <React.Fragment>
                            <Grid itemx xs={12} sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mt:1}}>
                                <Typography sx={{fontSize:'.9rem',fontStyle:'italic'}}>Session {key2+1}</Typography>
                                {/* <IconButton color = 'error'> <CloseIcon/></IconButton> */}
                                {
                                    data.details.length === 1
                                    ?
                                    ''
                                    :
                                    <Tooltip title={'Remove Session '+(key2+1)}><IconButton variant='outlined' size='small' color='error' onClick = {()=>removeDetails(key,key2)}><CloseIcon/></IconButton></Tooltip>
                                }
                            </Grid>
                            <Grid item container component={Paper} sx={{p:1}}>
                                
                                <Grid item xs={12} sx={{mb:1}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Trainer *</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={data2.trainer_id}
                                        label="Trainer *"
                                        onChange={(value)=>handleSetTrainerDetails(value,key,key2)}
                                        >
                                        {
                                            trainerData.map((data3,key3)=>
                                            <MenuItem key = {key3} value={data3.trainer_id}>{data3.lname}, {data3.fname}</MenuItem>

                                            )
                                        }
                                        </Select>
                                    </FormControl>
                                    {/* <TextField key = {key2} value = {data2.trainer_name} label = 'Trainer Name' fullWidth onChange= {(value)=>handleSetDetails(value,key,key2,'trainer_name')}/> */}
                                </Grid>
                                <Grid item xs={12} sx={{mb:1}}>
                                <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Period *</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={data2.period}
                                        label="Period *"
                                        onChange={(value)=>handleSetDetails(value,key,key2,'period')}
                                        >
                                        {
                                            periodData.map((data3,key3)=>
                                            <MenuItem key={key3} value={data3}>{data3}</MenuItem>

                                            )
                                        }
                                        </Select>
                                    </FormControl>
                                    {/* <TextField key = {key2} value = {data2.period} label = 'Period' fullWidth onChange= {(value)=>handleSetDetails(value,key,key2,'period')}/> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label ='Topic' fullWidth value={data2.topic} onChange={(value)=>handleSetDetails(value,key,key2,'topic')}/>
                                </Grid>
                            </Grid>
                            </React.Fragment>
                        }
                        {/* {
                            data.details.length === 1
                            ?
                            ''
                            :
                            <Tooltip title='Remove'><IconButton variant='outlined' color='error' sx={{'&:hover':{background:red[800],color:'#fff'},float:'right',mt:1}} className='custom-iconbutton' onClick = {()=>removeDetails(key,key2)}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                        } */}
                        
                        </Grid>
                        </Slide>

                    )}
                        <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',mb:1}}>
                        {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}> */}
                            {/* <Typography key= {key}>{moment(data.date,'YYYY-MM-DD').format('MMMM DD,YYYY')}</Typography> */}
                            <Tooltip title='Add new session'><IconButton color='success' sx={{mr:1,'&:hover':{background:green[800],color:'#fff'}}} className='custom-iconbutton' onClick ={()=>addDetails(key)}><AddOutlinedIcon/></IconButton></Tooltip>
                        {/* </Box> */}
                        </Grid>
                    </Grid>
                    <hr/>
                </Grid>
                )
            }
            <Grid item xs={12}>
                <Button variant='contained' color='success' sx={{float:'right'}} onClick = {handleSaveData} className='custom-roundbutton'>Save</Button>
            </Grid>
        </Grid>
    )
}