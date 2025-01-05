import React,{useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { blue, green, red, yellow } from '@mui/material/colors'

export default function ViewEmpList(props){
    const [data,setData] = useState([])
    useEffect(()=>{
        // console.log(props.data)
        setData(props.data)
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
        // {
        //     name:'Department',
        //     selector:row=>row.short_name,
        //     sortable:true
        // },
        // {
        //     name:'Template Name',
        //     selector:row=>row.template_name,
        //     sortable:true
        // },
    ]
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
    return(
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
    )
}