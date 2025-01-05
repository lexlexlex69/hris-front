import React, { useEffect, useState } from 'react';
import { Button,Paper,Tooltip,Typography,IconButton,Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue} from '@mui/material/colors';
import moment from 'moment';
import axios from 'axios'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';

import Swal from 'sweetalert2';
import { viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
export default function RectificationHistoryTable(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(5);

	const fetchData = async page => {
		setLoading(true);

		const response = await axios.get(`/api/DTR/rectHistoryPagination?type=${props.type}&page=${page}&per_page=${perPage}`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchData(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setLoading(true);

		const response = await axios.get(`/api/DTR/rectHistoryPagination?type=${props.type}&page=${page}&per_page=${newPerPage}`);

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
            selector:row=>row.emp_lname+', '+row.emp_fname+' '+(row.emp_mname?row.emp_mname.charAt(0):' ')+'.'
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
            name:'Attachment',
            selector:row=>formatAttachment(row)
        },
        {
            name:'Rectified By',
            selector:row=>row.rectified_by
        }
    ]
    const formatAttachment = (row) => {
        var arr = JSON.parse(row.file_id);
        return (
            <Box sx={{p:1}}>
                {
                    arr.map((item,key)=>
                        <Tooltip title='View file'><IconButton key={key} className='custom-iconbutton' size='small' onClick={()=>handleViewFile(item)}><AttachmentIcon/></IconButton></Tooltip>
                    )
                }
            </Box>
        )
    }
    const handleViewFile = (id) => {
        console.log(id)
        viewFileAPI(id)
    }
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
                // fontSize: matches?'10px':'0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    
    
            },
        },
        headCells: {
            style: {
                padding:'15px 0 15px 15px',
                background:'#28a0ff',
                color:'#fff',
                // fontSize:matches?'12px':'13px',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                fontWeight: '500'
                // textAlign:'center',
    
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                textAlign:'left',
                fontSize: '0.7rem',
    
            },
        }
    }
    const refresh = async ()=>{
        Swal.fire({
            icon:'info',
            title:'Reloading data'
        })
        Swal.showLoading()
        await axios.get(`/api/DTR/rectHistoryPagination?type=${props.type}&page=${1}&per_page=${perPage}`)
        .then(res=>{
            setData(res.data.data);
            setTotalRows(res.data.total);
            Swal.close();
        })

		
    }
    return(
        <>
       <Box sx={{display:'flex',justifyContent:'space-between'}}>
        <Typography sx={{fontSize:'.9rem'}}><em style={{color:'#fff',background:blue[700],padding:'10px 15px 10px 10px',borderTopRightRadius:'20px',borderBottomRightRadius:'20px'}}>Rectification Request History</em></Typography>
        <Tooltip title='Reload history data'><IconButton color='primary' className='custom-iconbutton' onClick={refresh}sx={{'&:hover':{background:blue[800],color:'#ffff'}}}><CachedOutlinedIcon/></IconButton></Tooltip>
        </Box>
            <Paper>
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
            </Paper>
        </>
    )
}