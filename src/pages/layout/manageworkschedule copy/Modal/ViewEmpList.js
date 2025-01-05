import React,{useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { blue, green, red, yellow } from '@mui/material/colors'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { Grid, IconButton, Paper, Tooltip } from '@mui/material';
import '.././ManageWorkSchedule.css';

export default function ViewEmpList(props){
    const [data,setData] = useState([])
    const [selectedIDs,setSelectedIDs] = useState([])
    const [preSelectIDs,setPreSelectIDs] = useState([])
    useEffect(()=>{
        // console.log(props.data)
        setData(props.data)
        var t_ids = [...preSelectIDs]
        props.data.forEach(el=>{
            console.log(el.is_locked)
            if(el.is_locked){
                t_ids.push(el.emp_no)
            }
        })
        console.log(t_ids)
        setPreSelectIDs(t_ids)
    },[props.data])
    const columns = [
        {
            name:'Name',
            selector:row=>row.fullname,
            sortable:true
        },
        {
            name:'Employment Status',
            selector:row=>row.description,
            sortable:true
        },
        {
            name:'Department',
            selector:row=>row.short_name,
            sortable:true
        },
        {
            name:'Template Name',
            selector:row=>row.template_name,
            sortable:true
        },
        {
            name:'Locked',
            selector:row=><Checkbox checked={preSelectIDs.includes(row.emp_no)?true:false} onChange={()=>handleSelectID(row.emp_no)}/>
        },
    ]
    const handleSelectID = (id)=>{
        var index = preSelectIDs.indexOf(id);
        // console.log(index)
        if(index > -1){
            var t_ids = [...preSelectIDs]
            t_ids.splice(index,1);
            setPreSelectIDs(t_ids)

            var t_ids2 = [...selectedIDs]
            t_ids2.push(id)
            setSelectedIDs(t_ids2)
            // console.log('exist')
        }else{
            var t_ids = [...preSelectIDs]
            t_ids.push(id)
            setPreSelectIDs(t_ids)

            var index2 = selectedIDs.indexOf(id);
            var t_ids2 = [...selectedIDs]
            t_ids2.splice(index2,1)
            setSelectedIDs(t_ids2)
            // console.log('not exist')
        }
    }
    const tableData = {
        data,
        columns
    }
    const customStyles = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
            },
        },
        headCells: {
            style: {
                fontSize:'1rem',
                background:blue[500],
                color:'#fff',
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',

            },
        },
        cells: {
            style: {
                fontSize:'.8rem'

            },
        },
    };
    const handleUnlockWrkSched = ()=>{
        console.log(selectedIDs)
    }
    return(
        <Grid spacing={1} sx={{m:1}}>
            <Grid item xs={12} id='lock-div' sx={{display:'flex',justifyContent:'flex-end',mb:1}}>
                <Tooltip title='Unlock work sched'><IconButton color='primary' className='custom-iconbutton' sx={{'&:hover':{color:'#fff',background:blue[800]}}} onClick={handleUnlockWrkSched}><LockOpenIcon className='icon-unlock'/></IconButton></Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <DataTableExtensions
                    {...tableData}
                    export={false}
                    print={false}
                    filterPlaceholder='Search employee'
                >
                        <DataTable
                        // title ={<Typography>Employee List</Typography>}
                        data = {data}
                        columns = {columns}
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 15, 25, 50]}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Records per page:',
                            rangeSeparatorText: 'out of',
                        }}
                        pagination
                        highlightOnHover
                        customStyles={customStyles}
                        />
                </DataTableExtensions>
                </Paper>
            </Grid>
        </Grid>
        
    )
}