import { Grid, Typography,Box,InputLabel ,MenuItem ,FormControl, Button  } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React,{useEffect, useState} from 'react';
import { getLeaveLedger } from '../LeaveApplicationRequest';
import moment from 'moment';
import Swal from 'sweetalert2';
import Table from '../Table/Table';
export default function LeaveLedgerModal2(props){
    const [year,setYear] = useState([])
    const [selectedYear, setSelectedYear] = useState('');
    const [leaveLedgerDataVL, setLeaveLedgerDataVL] = useState([]);
    const [leaveLedgerDataSL, setLeaveLedgerDataSL] = useState([]);
    const [leaveLedgerDataCOC, setLeaveLedgerDataCOC] = useState([]);

    useEffect(()=>{
        var year = moment(new Date()).format('YYYY');
        var fin_year = [];
        for(var i = 0 ; i<5 ; i++){
            fin_year.push(year-i)
        }
        setYear(fin_year)
    },[])
    const handleChange = (event) => {
        setSelectedYear(event.target.value);
      };
    const showLeaveLedger = (event) =>{
        event.preventDefault();
        getLeaveLedger(selectedYear)
        .then(res=>{
            if(res.data.vl.length === 0 && res.data.sl.length === 0 && res.data.coc.length === 0){
                setLeaveLedgerDataVL([])
                setLeaveLedgerDataSL([])
                setLeaveLedgerDataCOC([])
                Swal.fire({
                    icon:'warning',
                    title:'No Data Found !'
                })
            }else{
                setLeaveLedgerDataVL(res.data.vl)
                setLeaveLedgerDataSL(res.data.sl)
                setLeaveLedgerDataCOC(res.data.coc)
            }
            console.log(res.data)

        }).catch(err=>{
            console.log(err.data)
        })
    }
    return(
        <form onSubmit={showLeaveLedger}>
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedYear}
                    label="Year"
                    onChange={handleChange}
                    required
                    >
                    {year.map((data,key)=>
                        <MenuItem key = {key} value={data}>{data}</MenuItem>

                    )}
                    </Select>
                </FormControl> &nbsp;
                <Button variant='outlined' type='submit'>Submit</Button>

            </Grid>
            {
                leaveLedgerDataVL.length !==0
                ?
                <Table data = {leaveLedgerDataVL} name = 'Vacation Leave' bal={props.vl} applied_header = 'Days'/>
                :
                ''
            }
            {
                leaveLedgerDataSL.length !==0
                ?
                <Table data = {leaveLedgerDataSL} name = 'Sick Leave' bal={props.sl} applied_header = 'Days'/>
                :
                ''
            }
            {
                leaveLedgerDataCOC.length !==0
                ?
                <Table data = {leaveLedgerDataCOC} name = 'Compensatory Time Off' bal={props.coc} applied_header = 'Hours'/>
                :
                ''
            }
            


        </Grid>
        </form>
    )
}