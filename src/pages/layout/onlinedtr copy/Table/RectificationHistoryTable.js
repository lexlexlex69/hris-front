import React, { useEffect, useState } from 'react';
import { Button,Tooltip,Typography } from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import moment from 'moment';
import axios from 'axios'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
export default function RectificationHistoryTable(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(5);

	const fetchData = async page => {
		setLoading(true);

		const response = await axios.get(`/api/DTR/rectHistoryPagination?page=${page}&per_page=${perPage}`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchData(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);

		const response = await axios.get(`/api/DTR/rectHistoryPagination?page=${page}&per_page=${newPerPage}`);

		setData(response.data.data);
		setPerPage(newPerPage);
		setLoading(false);
	};

	useEffect(() => {
		fetchData(1); // fetch page 1 of users
		
	}, []);

    // useEffect(()=>{
    //     setData(props.data)
    // },[])
    const columns = [
        {
            name:'Name',
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+row.emp_mname.charAt(0)+'.'
        },
        {
            name:'Department',
            selector:row=>row.short_name
        },
        {
            name:'Date of Request',
            selector:row=>moment(row.created_at).format('MMMM DD, YYYY h:mm:ss A')
        },
        {
            name:'Rectified Date',
            selector:row=>moment(row.date).format('MMMM DD, YYYY')
        },
        {
            name:'Nature',
            selector:row=>row.nature
        },
        {
            name:'Time',
            selector:row=>formatTime(row)
        },
        {
            name:'Reason',
            selector:row=>row.reason
        },
        {
            name:'Rectified By',
            selector:row=>row.rectified_by
        }
    ]
    const formatTime = (row) => {
        var date = moment(row.date+' '+row.rectified_time).format('h:mm:ss A')
        return date;
    }
    const tableData = {
        columns,
        data,
      };
      const historyTableStyle = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                // background:'#f4f4f4',
                fontSize: matches?'10px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
    
            },
        },
        headCells: {
            style: {
                padding:'15px 0 15px 15px',
                background:'#28a0ff',
                color:'#fff',
                fontSize:matches?'12px':'17px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                fontWeight: '500'
                // textAlign:'center',
    
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                textAlign:'left'
    
            },
        }
    }
    
    return(
        <>
        <Typography sx={{borderLeft:'solid 5px',paddingLeft:'10px',marginBottom:'10px',color:'#28a0ff',fontWeight:'bold'}}><em>Rectification Request History</em></Typography>
        <Button sx={{float:'right'}}><CachedOutlinedIcon/></Button>
            <DataTableExtensions
                {...tableData}
                export={false}
                print={false}
                filterPlaceholder = 'Search ...'
            >
            <DataTable
                data = {data}
                columns = {columns}
                customStyles={historyTableStyle}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                }}
                pagination
                progressPending={loading}
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
            </DataTableExtensions>
        </>
    )
}