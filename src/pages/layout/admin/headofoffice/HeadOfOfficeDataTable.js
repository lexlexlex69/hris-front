import React, { useEffect } from 'react';
import { Box,Tooltip,Button,Typography,Modal } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import UpdateOfficeHeadModal from './Modal/UpdateOfficeHeadModal';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SmallModal from '../../custommodal/SmallModal';

export default function HeadOfOfficeDataTable(props){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [data,setData] = React.useState([])
    const [updateModal,setUpdateModal] = React.useState(false)
    const [updateInfo,setUpdateInfo] = React.useState([])
    const updateModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?350:500,
        // marginBottom: matches? 20:0,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:3,
        boxShadow: 24,
        // p: 4,
      };

    useEffect(()=>{
        setData(props.data)
    },[props.data])
    const columns = [
        {
            name:'Department/Office',
            selector:row=>row.office_division_name
        },{
            name:'Office Head',
            selector:row=>row.office_division_assign
        },
        {
            name:'Position',
            selector:row=>row.position
        },
        {
            name:'Action',
            selector:row=><Box>
                <Tooltip title='Update'><Button variant='contained' className='custom-roundbutton' color='info' onClick = {()=>updateAction(row)} startIcon={<EditOutlinedIcon/>}>Update</Button></Tooltip>
            </Box>
        }
    ]
    const tableData = {
        columns,
        data
    }
    const updateAction = (row) =>{
        console.log(row)
        setUpdateInfo(row)
        setUpdateModal(true)
    }
    return(
        <Box>
        {/* <Button>Update Data</Button> */}
        <DataTableExtensions
        {...tableData}
        filterPlaceholder = 'Search Office Head Table'
        export = {false}
        print = {false}
        >
        <DataTable
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
        />
        </DataTableExtensions>
        <SmallModal open={updateModal} close={()=> setUpdateModal(false)} title='Updating Office Head info'>
            <Box sx={{m:1}}>
                <UpdateOfficeHeadModal info = {updateInfo} setOfficeHeadData = {props.setOfficeHeadData} close = {()=> setUpdateModal(false)}/>
            </Box>
        </SmallModal>
        {/* <Modal
            open={updateModal}
            onClose={()=> setUpdateModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={updateModalStyle}>
                <CancelOutlinedIcon className='custom-close-icon-btn' onClick = {()=> setUpdateModal(false)}/>
                <Typography id="modal-modal-title" sx={{textAlign:'center',padding:'10px',color:'#fff',background:'#0d6efd',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',margin:'-2px',textTransform:'uppercase'}} variant="h6" component="h2">
                Updating Office Head info
                </Typography>
                <Box sx={{m:4}}>
                    <UpdateOfficeHeadModal info = {updateInfo} setOfficeHeadData = {props.setOfficeHeadData} close = {()=> setUpdateModal(false)}/>
                </Box>

            </Box>
        </Modal> */}
    </Box>
    )
}