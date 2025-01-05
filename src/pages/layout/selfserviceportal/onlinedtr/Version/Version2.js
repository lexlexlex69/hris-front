import { Box, Grid, Select,FormControl, InputLabel, MenuItem, Checkbox, FormControlLabel, Button, Fade, TextField  } from "@mui/material";
import moment from "moment";
import React,{useEffect, useState} from "react";
import SendIcon from '@mui/icons-material/Send';
import Swal from "sweetalert2";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoadingButton from '@mui/lab/LoadingButton';
const Version2 = (props) =>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const [monthsData,setMonthsData] = useState(moment.months())
    const [selectedYear,setSelectedYear] = useState(moment().format('YYYY'))
    const [selectedMonth,setSelectedMonth] = useState(moment().format('MMMM'))
    const [selectedPeriod,setSelectedPeriod] = useState('')
    const [datePeriodData,setDatePeriodData] = useState([])
    const [yearData,setYearData] = useState([])
    const [isCustom,setIsCustom] = useState(false)
    const [dateFrom,setDateFrom] = useState('')
    const [dateTo,setDateTo] = useState('');
    useEffect(()=>{
        var i = 0;
        var temp = [];
        for(i;i<5;i++){
            temp.push(moment().subtract(i,'year').format('YYYY'))
        }
        setYearData(temp)
    },[])
    const handleSetYear = (e) => {
        setSelectedYear(e.target.value)
    }
    const handleSetMonth = (e) => {
        setSelectedMonth(e.target.value)
    }
    const handleSetPeriod = (e) => {
        setSelectedPeriod(e.target.value)
    }
    useEffect(()=>{
        var first = '01-15';
        var second = '16-'+moment(selectedMonth+' '+selectedYear,'MMMM YYYY').endOf('month').format('DD')
        var third = '01-'+moment(selectedMonth+' '+selectedYear,'MMMM YYYY').endOf('month').format('DD')
        var temp = [];
        temp.push(first,second,third)
        setDatePeriodData(temp)
    },[selectedMonth,selectedYear])
    const handleViewDTR = () =>{
        if(!selectedPeriod){
            Swal.fire({
                icon:'warning',
                title:'Please select a period'
            })
        }else{
            if(!datePeriodData.includes(selectedPeriod)){
                Swal.fire({
                    icon:'warning',
                    title:'Please select a period'
                })
            }else{
                var temp_period = selectedPeriod.split('-');
                var from = moment(selectedMonth+' '+temp_period[0]+' '+selectedYear,'MMMM DD YYYY').format('YYYY-MM-DD')
                var to = moment(selectedMonth+' '+temp_period[1]+' '+selectedYear,'MMMM DD YYYY').format('YYYY-MM-DD')
                var t_data = {
                    from:from,
                    to:to
                }
                props.displayDTR(t_data)
            }
            
        }
    }
    const handleViewCustomDTR = (e) => {
        e.preventDefault();
        var t_data = {
            from:dateFrom,
            to:dateTo,
        }
        props.displayDTR(t_data)
    }
    return (
        <Box>
            <Grid container>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                    <FormControlLabel control={<Checkbox checked={isCustom} onChange={()=>setIsCustom(!isCustom)}/>} label="Custom Date" />
                </Grid>
                {
                    isCustom
                    ?
                        <Fade in>
                            <form onSubmit={handleViewCustomDTR} style={{width:'100%'}}>
                                <Grid item xs={12} sx={{display:'flex',flexDirection:matches?'column':'row',gap:1,justifyContent:'center'}}>
                                    <TextField label='Date From' value = {dateFrom} onChange={(val)=>setDateFrom(val.target.value)} type="date" InputLabelProps={{shrink:true}} required sx={{width:matches?'10)%':300}}/>
                                    <TextField label='Date To' value = {dateTo} onChange={(val)=>setDateTo(val.target.value)} type="date" InputLabelProps={{shrink:true}} required sx={{width:matches?'100%':300}}/>
                                    <LoadingButton
                                        loading = {props.loadingData}
                                        loadingPosition="start"
                                        startIcon={<SendIcon />}
                                        variant="outlined"
                                        type="submit"
                                    >
                                        Display DTR
                                    </LoadingButton>
                                    {/* <Button variant="contained" endIcon={<SendIcon/>} type="submit">View DTR</Button> */}
                                </Grid>
                            </form>

                        </Fade>
                    :
                    <Fade in>
                        <Grid item xs={12} sx={{display:'flex',gap:1,flexDirection:matches?'column':'row',justifyContent:'center'}}>
                            <FormControl>
                                <InputLabel id="month-label">Month *</InputLabel>
                                <Select
                                labelId="month-label"
                                id="month-select"
                                value={selectedMonth}
                                label="Month *"
                                onChange={handleSetMonth}
                                sx={{width:matches?'100%':matchesMD?200:300}}
                                >
                                {
                                    monthsData.map((item,key)=>
                                        <MenuItem value={item} key={key}>{item}</MenuItem>
                                        
                                    )
                                }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="month-label">Year *</InputLabel>
                                <Select
                                labelId="month-label"
                                id="month-select"
                                value={selectedYear}
                                label="Year *"
                                onChange={handleSetYear}
                                sx={{width:matches?'100%':matchesMD?200:300}}
                                >
                                {
                                    yearData.map((item,key)=>
                                        <MenuItem value={item} key={key}>{item}</MenuItem>
                                        
                                    )
                                }
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="month-label">Period *</InputLabel>
                                <Select
                                labelId="month-label"
                                id="month-select"
                                value={selectedPeriod}
                                label="Period *"
                                onChange={handleSetPeriod}
                                sx={{width:matches?'100%':matchesMD?200:300}}
                                >
                                {
                                    datePeriodData.map((item,key)=>
                                        <MenuItem value={item} key={key}>{item}</MenuItem>
                                        
                                    )
                                }
                                </Select>
                            </FormControl>
                            <LoadingButton
                                loading = {props.loadingData}
                                loadingPosition="start"
                                startIcon={<SendIcon />}
                                variant="outlined"
                                onClick={handleViewDTR}
                            >
                                Display DTR
                            </LoadingButton>
                            {/* <Button variant="outlined" endIcon={<SendIcon/>} onClick={handleViewDTR}>View DTR</Button> */}

                        </Grid>
                    </Fade>
                }
                
            </Grid>
        </Box>
    )
}
export default Version2;