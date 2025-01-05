import React,{useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import {blue,red} from '@mui/material/colors';
import axios from 'axios';
export default function TableData(props){
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(5);


    useEffect(()=>{
        fetchData(1)
    },[props.username])
    // useEffect(()=>{
    //     setData(props.data)
    // },[props.data])
    const columns = [
        {
            name:'Date',
            selector:row=>row.created_at,
            sortable:true
        },
        {
            name:'Module Name',
            selector:row=>row.module
        },
        {
            name:'Action',
            selector:row=>row.user_action
        },
        {
            name:'Action Details',
            selector:row=>row.user_action_details
        }

    ];
    const tableData = {
        columns,
        data
    }
    const logCustomStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
                // '&:hover':{
                //     cursor:'pointer',
                // }
                '&:hover':{
                    cursor:'pointer',
                },
            },
        },
        headCells: {
            style: {
                paddingLeft: '10px', // override the cell padding for head cells
                paddingRight: '10px',
                background:blue[ 500],
                color:'white',
                fontSize:'.9rem',
                wordWrap:'break-word'
            },
        },
        cells: {
            style: {
                paddingLeft: '10px', // override the cell padding for data cells
                paddingRight: '10px',
                
            },
        },
    };
    const fetchData = async page => {
		setLoading(true);

		const response = await axios.get(`/api/audittrail/auditTrailLogsPagination?username=${props.username}&page=${page}&per_page=${perPage}`);

        console.log(response.data.data)

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchData(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);

		const response = await axios.get(`/api/audittrail/auditTrailLogsPagination?username=${props.username}&page=${page}&per_page=${newPerPage}`);

		setData(response.data.data);
		setPerPage(newPerPage);
		setLoading(false);
	};
    return(
        <DataTableExtensions
                {...tableData}
                export={false}
                print={false}
            >
            <DataTable
                data = {data}
                columns = {columns}
                customStyles = {logCustomStyles}
                highlightOnHover
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                }}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="300px"
                progressPending={loading}
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}

            />
            </DataTableExtensions>
    )
}