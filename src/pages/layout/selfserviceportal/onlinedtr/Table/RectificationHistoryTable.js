import React, { useEffect, useRef, useState } from 'react';
import { Button,Paper,Tooltip,Typography,IconButton,Box, TextField, Grid } from '@mui/material';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {blue, grey} from '@mui/material/colors';
import moment from 'moment';
import axios from 'axios'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DownloadIcon from '@mui/icons-material/Download';


import Swal from 'sweetalert2';
import { newPreViewFileAPI, preViewFileAPI, viewFileAPI } from '../../../../../viewfile/ViewFileRequest';
import { getAllRectificationRequestHistory } from '../DTRRequest';
import { formatExtName, formatMiddlename } from '../../../customstring/CustomString';
import { APILoading } from '../../../apiresponse/APIResponse';

import ReactExport from "react-export-excel";
import MediumModal from '../../../custommodal/MediumModal';
import SmallModal from '../../../custommodal/SmallModal';
import PreviewFileModal from '../../../custommodal/PreviewFileModal';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function RectificationHistoryTable(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(5);

    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    
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
            selector:row=>moment(row.created_at).format('MMMM DD, YYYY hh:mm:ss A')
        },
        {
            name:'Date Rectified',
            selector:row=>moment(row.rectified_at).format('MMMM DD, YYYY hh:mm:ss A')
        },
        {
            name:'Inclusive Date',
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
            name:'Reviewed By',
            selector:row=>row.review_by
        },
        {
            name:'Approved By',
            selector:row=>row.approved_by
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
    const [previewFile,setPreviewFile] = useState(false)
    const [previewFileData,setPreviewFileData] = useState('');
    const [fileType,setFileType] = useState('')
    const handleClosePreviewFile = () =>{
        setPreviewFile(false)
    }
    const handleViewFile = async (id) => {
        // console.log(id)
        // viewFileAPI(id)
        const file = await newPreViewFileAPI(id)
        console.log(file)
        if(file.type.includes('pdf')){
            setFileType('pdf')
        }else{
            setFileType('img')
        }
        setPreviewFileData(file.url)
        setPreviewFile(true)
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
    const [reportsData,setReportsData] = useState([])

    const buttonRef = useRef();

    const handleDownload = async () =>{
        setOpenDownloadRep(true)
        // APILoading('info','Processing data','Please wait...')
        
        // const res = await getAllRectificationRequestHistory()
        // setReportsData(res.data.data)
        // Swal.close();
        // if(buttonRef.current !== null) {
        //     buttonRef.current.click();
        // }
    }
    const handleProceedDownload = async (e)=>{
        e.preventDefault();
        APILoading('info','Processing data','Please wait...')
        
        const res = await getAllRectificationRequestHistory({from:periodFrom,to:periodTo})
        setReportsData(res.data.data)
        Swal.close();
        if(buttonRef.current !== null) {
            buttonRef.current.click();
        }
    }
    const [periodFrom,setPeriodFrom] = useState('');
    const [periodTo,setPeriodTo] = useState('');
    const [openDownloadRep,setOpenDownloadRep] = useState(false);
    return(
        <>
       <Box sx={{display:'flex',justifyContent:'flex-end'}}>
        {/* <Typography sx={{fontSize:'.9rem'}}><em style={{color:'#fff',background:blue[700],padding:'10px 15px 10px 10px',borderTopRightRadius:'20px',borderBottomRightRadius:'20px'}}>Rectified Request History</em></Typography> */}

        <Box sx={{display:'flex',gap:1}}>
            <Box>
            <Tooltip title='Download reports'><IconButton className='custom-iconbutton' onClick={handleDownload}sx={{'&:hover':{background:blue[900],color:'#ffff'},color:blue[900]}}><DownloadIcon/></IconButton></Tooltip>
            <div style={{display:'none'}}>
                <ExcelFile element={<IconButton ref={buttonRef}></IconButton>} filename={`Rectification Reports from ${moment(periodFrom).format('MM-DD-YYYY')} to ${moment(periodTo).format('MM-DD-YYYY')}`}>
                    <ExcelSheet data={reportsData} name="Rectification Reports">
                            <ExcelColumn label="Name" value={(el)=>`${el.lname}, ${el.fname} ${formatMiddlename(el.mname)} ${formatExtName(el.extname)}`}/>
                            <ExcelColumn label="Department" value={(el)=>`${el.short_name}`}/>
                            <ExcelColumn label="Date of Requested" value={(el)=>`${moment(el.created_at).format('MMMM DD, YYYY hh:mma')}`}/>
                            {/* <ExcelColumn label="Date of Reviewed" value={(el)=>`${moment(el.review_at).format('MMMM DD, YYYY hh:mma')}`}/>
                            <ExcelColumn label="Interval" value={(el)=>`${moment(el.review_at).diff(el.created_at,'days')} day/s`}/>
                            <ExcelColumn label="Date Approved by Dept. Head" value={(el)=>`${moment(el.approved_at).format('MMMM DD, YYYY hh:mma')}`}/>
                            <ExcelColumn label="Interval" value={(el)=>`${moment(el.approved_at).diff(el.review_at,'days')} day/s`}/> */}
                            <ExcelColumn label="Date Rectified" value={(el)=>`${el.rectified_at?moment(el.rectified_at).format('MMMM DD, YYYY hh:mma'):''}`}/>
                            <ExcelColumn label="Interval" value={(el)=>`${moment(el.rectified_at).diff(el.created_at,'days')} day/s`}/>

                            <ExcelColumn label="Inclusive Date/s" value={(el)=>`${moment(el.date).format('MMMM DD, YYYY')}`}/>
                            <ExcelColumn label="Nature" value={(el)=>`${el.nature}`}/>
                            <ExcelColumn label="Time" value={(el)=>`${formatTime(el)}`}/>
                            <ExcelColumn label="Reason" value={(el)=>`${el.reason}`}/>
                            {/* <ExcelColumn label="Reviewed By" value={(el)=>`${el.review_by?el.review_by:''}`}/>
                            <ExcelColumn label="Approved By" value={(el)=>`${el.approved_by?el.approved_by:''}`}/> */}
                            <ExcelColumn label="Rectified By" value={(el)=>`${el.rectified_by?el.rectified_by:''}`}/>
                        </ExcelSheet>
                </ExcelFile>
            </div>
            </Box>
            <Tooltip title='Reload history data'><IconButton color='primary' className='custom-iconbutton' onClick={refresh}sx={{'&:hover':{background:blue[800],color:'#ffff'}}}><CachedOutlinedIcon/></IconButton></Tooltip>
        </Box>

        
        </Box>
            <Paper>
            <DataTableExtensions
                {...tableData}
                export={false}
                print={false}
                filterPlaceholder = 'Filter Table'
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
                highlightOnHover
            />
            </DataTableExtensions>
            </Paper>
            <PreviewFileModal open = {previewFile} close = {handleClosePreviewFile} file={previewFileData} fileType={fileType}>
            </PreviewFileModal>
            {/* <MediumModal open = {previewFile} close = {handleClosePreviewFile} title='Preview File'>
                {
                    fileType === 'pdf'
                    ?
                    <iframe src={previewFileData} width='100%' height='300px'/>
                    :
                    <Box sx={{display:'flex',justifyContent:'center',overflowY:'scroll',maxHeight:'70vh',position:'relative'}}>
                        <Box sx={{position:'fixed',right:'15px',zIndex:1,background:grey[400],borderRadius:'20px','&:hover':{background:grey[500]}}}>
                            <Tooltip title='Zoom In'><IconButton onClick={()=>handleZoom('in')}><ZoomInIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                            <Tooltip title='Zoom Out'><IconButton onClick={()=>handleZoom('out')}><ZoomOutIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                            <Tooltip title='Rotate'><IconButton onClick={handleRotate}><ReplayIcon sx={{color:'#fff'}}/></IconButton></Tooltip>
                        </Box>
                        <Box>
                            <img src={previewFileData} style={{width:'300px',scale:fileScale.toString(),rotate:fileRotate.toString()+'deg'}}/>
                        </Box>
                    </Box>
                }

            </MediumModal> */}
            <SmallModal open = {openDownloadRep} close = {()=>setOpenDownloadRep(false)} title = 'Downloading Reports'>
                <form onSubmit={handleProceedDownload}>
                <Grid container spacing={2} sx={{p:1}}>
                    <Grid item xs={12}>
                        <TextField type='date' label='Period From' value = {periodFrom} onChange={(val)=>setPeriodFrom(val.target.value)} fullWidth InputLabelProps={{shrink:true}} required/>

                    </Grid>
                    <Grid item xs={12}>
                        <TextField type='date' label='Period To' value = {periodTo} onChange={(val)=>setPeriodTo(val.target.value)} fullWidth InputLabelProps={{shrink:true}} required/>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant='contained' fullWidth type='submit'>Proceed Download</Button>
                    </Grid>
                </Grid>
                </form>
            </SmallModal>
        </>
    )
}