import React,{useEffect, useState} from 'react';
import {Grid,Box,Typography,Button,TextField,IconButton,Paper,InputLabel,MenuItem,FormControl,Select,Tooltip} from '@mui/material';
import moment from 'moment';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {blue,red,orange,green} from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
var businessDay = require('moment-business-days');
export default function UpdateAssignTrainer(props){
    const [dateData,setDateData] = useState([])
    const [trainerData,setTrainerData] = useState([])
    const [periodData,setPeriodData] = useState(['AM','PM','AM-PM'])
    useEffect(()=>{
        // console.log(props.trainer.trainer)
        // console.log(props.trainerScheduleData)
        // console.log(props.selectedTrainer)
        setTrainerData(props.selectedTrainer)
        // setDateData(props.trainerScheduleData)
        if(!props.updatedAssignTrainer){
            setDateData(props.trainerScheduleData)
        }else{
            /**
            * 
            get all dates assign
            */
            var t_dates = [];
            var t_trainer_ids = [];
            var t_trainer_sched_data = [];
            
            props.selectedTrainer.forEach(el=>{
                t_trainer_ids.push(el.trainer_id)
            })
            props.trainerScheduleData.forEach(el=>{
                el.details.forEach(el2=>{
                    if(t_trainer_ids.includes(el2.trainer_id)){
                        t_trainer_sched_data.push(el2)
                    }
                })
            })
            // console.log(props.trainerScheduleData)
            // console.log(t_trainer_ids)
            // console.log(props.selectedTrainer)
            // console.log(t_trainer_sched_data)

            t_trainer_sched_data.forEach(el=>{
                t_dates.push(el.date)
            })
            let unique = [...new Set(t_dates)];
            // console.log(unique)

            var from = new Date(props.from);
            var to = new Date(props.to);
            // var days = to.diff(from, 'days')+1;
            var arr = [];
            /**
            * get dates from date range
            */
            while(moment(from).format('YYYY-MM-DD') <= moment(to).format('YYYY-MM-DD')){
            if(moment(from).isBusinessDay()){
                if(unique.includes(moment(from).format('YYYY-MM-DD'))){
                    arr.push({
                        date:moment(from).format('YYYY-MM-DD'),
                        details:[]
                    })
                }else{
                    arr.push({
                        date:moment(from).format('YYYY-MM-DD'),
                        details:[{
                            date:'',
                            period:'',
                            trainer_id:'',
                            trainer_name:'',
                            topic:'',
                        }]
                    })
                }
                
            }
            
            from.setDate(from.getDate()+1)
        }
        var arr2 = [];
        arr.forEach(el => {
            t_trainer_sched_data.forEach(el2=>{
                if(el.date === el2.date && t_trainer_ids.includes(el2.trainer_id)){
                    el.details.push({
                        date:el2.date,
                        period:el2.period,
                        trainer_id:el2.trainer_id,
                        trainer_name:el2.lname+', '+el2.fname,
                        topic:el2.topic,
                    })
                }
            })
        });
        console.log(arr)
        setDateData(arr)
        }
        

    },[])
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
        props.setUpdatedAssignTrainer(true);
        // console.log(dateData)
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
                <Grid item xs={12} sx={{border:'solid 1px #c4c4c4',m:2,borderRadius:'5px',position:'relative'}} key={key}>
                    <Typography sx={{background: blue[800],position: 'absolute',color: '#fff',top: 0,width: '99px',left: 0,padding: '5px',borderTopLeftRadius: '4px',borderBottomRightRadius: '100%',fontWeight:'bold'}}>Day {key+1}</Typography>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',pt:3}}>
                        <Typography key= {key}>{moment(data.date,'YYYY-MM-DD').format('MMMM DD,YYYY')}</Typography>
                        <Tooltip title='Add'><IconButton color='success' sx={{mr:1,'&:hover':{background:green[800],color:'#fff'}}} className='custom-iconbutton' onClick ={()=>addDetails(key)}><AddOutlinedIcon/></IconButton></Tooltip>
                    </Box>
                    <Grid item container spacing={1}>
                    {data.details.map((data2,key2)=>
                        <Grid item xs={12} sx={{p:1,m:2}} component={Paper}>
                        {
                            <Grid item container spacing={1}>
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
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
                        }
                        {
                            data.details.length === 1
                            ?
                            ''
                            :
                            <Tooltip title='Remove'><IconButton variant='outlined' color='error' sx={{'&:hover':{background:red[800],color:'#fff'},float:'right',mt:1}} className='custom-iconbutton' onClick = {()=>removeDetails(key,key2)}><DeleteOutlineOutlinedIcon/></IconButton></Tooltip>
                        }
                        
                        </Grid>
                    )}
                    </Grid>
                </Grid>
                )
            }
            <Grid item xs={12}>
                <Button variant='contained' color='success' sx={{float:'right'}} onClick = {handleSaveData} className='custom-roundbutton'>Save</Button>
            </Grid>
        </Grid>
    )
}