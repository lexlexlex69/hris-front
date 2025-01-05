import React,{useEffect, useState} from 'react';
import {Typography,Box,Button, Tooltip,} from '@mui/material'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// media query
import { useTheme } from '@mui/material/styles';
import {green} from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
export default function HasSchedule(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [selectedHasScheduleEmployees,setSelectedHasScheduleEmployees] = useState([])

    useEffect(()=>{
        setData(props.data)
    },[props.data])
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname === null ?'':row.emp_mname.charAt(0)+'.')
        },
        {
            name:'Template Name',
            selector:row=><span style={{color:'#0077dd',fontWeight:'bold'}}><em>{row.template_name}</em></span>
        }
    ]
    const tableData = {
        data,
        columns
    }
    const hasScheduleHandleChange = ({ selectedRows }) => {
        setSelectedHasScheduleEmployees(selectedRows)
    };
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
                    <Typography sx={{background: '#198754',
                    textAlign: 'center',
                    color: '#fff',
                    padding: '10px'}}> With Schedule</Typography>
                    :
                    <Typography sx={{background: '#198754',
                    textAlign: 'center',
                    color: '#fff',
                    padding: '10px'}}> With Schedule</Typography>
                    )
                :
                ''
                
            }
            data = {data}
            columns = {columns}
            onSelectedRowsChange = {hasScheduleHandleChange}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
                rowsPerPageText: 'Records per page:',
                rangeSeparatorText: 'out of',
            }}
            pagination
            highlightOnHover
            selectableRows
            contextActions={
                (
                    <Box>
                        {/* <Button variant='outlined' color='error' size='small' onClick={()=>props.deleteAction(selectedHasScheduleEmployees)}>
                        <DeleteOutlineOutlinedIcon/>
                        </Button>
                        &nbsp; */}
                        <Tooltip title = 'Update selected employee work sched'><Button sx={{'&:hover':{color:'white',background:green[800]}}} variant='outlined' color='success'  size='small' disabled={selectedHasScheduleEmployees.length > 1 ?true:false} onClick={()=>props.updateAction(selectedHasScheduleEmployees)}>
                        <EditOutlinedIcon/>
                        </Button></Tooltip>
                    </Box>
                    )
            }
            // subHeaderComponent={
            //     (<div>
            //         <Button>Test</Button>
            //     </div>)
            // }
            clearSelectedRows={props.toggledClearHasScheduleRows}
        />
        </DataTableExtensions>
    )
}