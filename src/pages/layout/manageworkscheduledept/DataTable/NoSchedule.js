import React,{useEffect, useState} from 'react';
import {Typography,Box,Button,} from '@mui/material'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from 'moment';
import { blue, green, red, yellow } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function NoSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    useEffect(()=>{
        setData(props.data)
    })
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        }
    ]
    const tableData = {
        columns,
        data
    }
    return(
        <DataTableExtensions
            {...tableData}
            export={false}
            print={false}
        >
        <DataTable
            title = {
                props.filterYear
                ?
                (
                    matches
                    ?
                    <Typography sx={{background: red[800],
                        textAlign: 'center',
                        color: '#fff',
                        padding: '10px'}}>Without Schedule</Typography>
                    :
                    <Typography sx={{background: red[800],
                    textAlign: 'center',
                    color: '#fff',
                    padding: '10px'}}> Without Schedule</Typography>
                )
                :
                ''
                
            }
            data = {props.data}
            columns = {props.columns}
            onSelectedRowsChange = {props.handleChange}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
                rowsPerPageText: 'Records per page:',
                rangeSeparatorText: 'out of',
            }}
            pagination
            highlightOnHover
            selectableRows
            clearSelectedRows={props.toggledClearNoScheduleRows}
        />
        </DataTableExtensions>
    )
}