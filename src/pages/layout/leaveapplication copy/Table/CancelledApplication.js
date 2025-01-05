import React,{useEffect, useState} from 'react';
import {Typography} from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import {red} from '@mui/material/colors'
export default function CancelledApplication(props){
    const [data,setData] = useState([])
    useEffect(()=>{
        setData(props.data)
    },[props.data])
    const columns = [
        {
            name:'Employee Name',
            selector:row=>row.fullname
        },
        {
            name:'Leave Name',
            selector:row=>row.leave_type_name
        },
        {
            name:'Inclusive Dates',
            selector:row=>row.inclusive_dates_text
        },
        {
            name:'Days Applied',
            selector:row=>row.days_hours_applied
        },
        {
            name:'Cancelled By',
            selector:row=>row.cancelled_by
        },
        {
            name:'Cancel Reason',
            selector:row=>row.cancel_reason
        },
            
    ];
    const tableData = {
        columns,
        data,
      };
    return(
        <DataTableExtensions
            {...tableData}
            export={false}
            print={false}
            filterPlaceholder='Filter Cancelled Table'

        >

        <DataTable
            title ={<Typography sx={{background:red[800],color:'#fff',padding:'10px'}}>Cancelled Leave Application</Typography>}
            data={data}
            columns={columns}
        />
        </DataTableExtensions>

    )
}