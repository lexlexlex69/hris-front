import React, { useEffect } from 'react';
//data table
import {Button,Typography,Box,Modal,Grid,TextField,Tooltip } from "@mui/material";
// mui icons
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HideSourceIcon from '@mui/icons-material/HideSource';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

//data table
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import {getAllJobPostingList,jobPostingAction } from "./JobPostingRequest";
//sweetalert
import Swal from "sweetalert2";
import moment from "moment";
import { toast } from "react-toastify";
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius:3,
    boxShadow: 24,
    p: 4,
  };
// custom styles for data table
const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height

        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            background:'#2196f3',
            color:'#fff',
            fontSize:'1.2em'

        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
            wordBreak:'break-all'
        },
    },
};

export default function ViewJobVacancies(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [data,setData] = React.useState([]);
    const [selectedJob,setSelectedJob] = React.useState({});
    const [updateOpen,setUpdateOpen] = React.useState(false);


    //colums for viewing job list table
    const columns = [
        {
            name: 'Position Title',
            sortable:true,
            selector: row => row.position_title,
        },
        {
            name: 'Office Name',
            sortable:true,
            selector: row => row.place_of_assignment,
        },
        {
            name: 'Plantilla Item No.',
            selector: row => row.plantilla_no,
        },
        {
            name: 'Qualification',
            sortable:true,
            selector: row => row.education,
        },
        {
            name: 'Posting Date',
            sortable:true,
            selector: row => moment(row.posting_date).format('MMMM DD , YYYY'),
        },
        {
            name: 'Closing Date',
            sortable:true,
            selector: row => moment(row.closing_date).format('MMMM DD , YYYY'),
        },
        {
            name: 'Posted By',
            sortable:true,
            selector: row => row.posted_by,
        },
        {
            name: 'Is Hidden',
            sortable:true,
            selector: row => row.is_hidden ? 'YES': 'NO',
        },
        {
            name: 'Employment Status',
            sortable:true,
            selector: row => row.emp_status,
        },
        {
            name: 'Action',
            selector: row => <Box>
            <Tooltip title="Update Data" placement="top"><Button variant="contained" onClick = {()=>handleUpdateOpen(row)}><EditIcon/>Update</Button></Tooltip>
          </Box>
        },
    ];
     //job list table conditional rows
     const conditionalRowStyles = [
        {
          when: row => row.is_hidden,
          style: {
            backgroundColor: '#ffcca7',
          },
        },
        // You can also pass a callback to style for additional customization
        {
          when: row => row.calories < 300,
          style: row => ({
            backgroundColor: row.isSpecia ? 'pink' : 'inerit',
          }),
        },
      ];
    // react data table extension
    const tableData = {
        columns,
        data,
    };
    const handleUpdateData = (event) => {
        setSelectedJob({...selectedJob,[event.target.name]:event.target.value})
    }
     // open update modal
     const handleUpdateOpen = (row) =>{
        setSelectedJob(row);
        setUpdateOpen(true)
    }
    useEffect(()=>{
        getAllJobPostingList('test')
        .then((response) => {
            setData(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
     //variable for selected row of job list viewing
     const [selectedRows, setSelectedRows] = React.useState([]);

     //clear job list selectedRows data
     const [toggleCleared, setToggleCleared] = React.useState(false);
 
     //set data when job list viewing row is selected
     const handleRowSelected = React.useCallback(state => {
         setSelectedRows(state.selectedRows);
     }, []);
 
     //action variable
     const [selectedAction,setSelectedAction] = React.useState('');
 
     //action confirm modal
     const [actionModal,setActionModal] = React.useState(false)
     
    const handleConfirmAction = (event) => {
        event.preventDefault();
    }
     //action show when row is selected
     const contextActions = React.useMemo(() => {
         //handle action
         const handleAction = (value) => {
             setSelectedAction(value)
             Swal.fire({
                 icon:'info',
                 title:'Confirm '+value+ '?',
                 showCancelButton: true,
                 confirmButtonText: 'Yes',
                 }).then((result) => {

                 /* Read more about isConfirmed below */
                 if (result.isConfirmed) {
                     Swal.fire({
                         title:'Please Wait...',
                         allowEscapeKey:false,
                         allowOutsideClick:false
                     })
                     Swal.showLoading()
                     var ids = [];
                     selectedRows.forEach(element => {
                         ids.push(element.id)
                     });
                     var data2 = {
                         action:value,
                         ids:ids
                     }
                     jobPostingAction(data2)
                     .then((response)=>{
                         if(response.data.status === 'success'){
                             setData(response.data.data)
                             setToggleCleared(!toggleCleared);
                             Swal.fire({
                                 icon:'success',
                                 title:'Successfully '+selectedAction+'!'
                             })
                         }else{
                             Swal.fire({
                                 icon:'error',
                                 title:response
                             })
                         }
                     }).catch((error)=>{
                         toast.error(error)
                     })
                     
                 }
 
             })
         }
         return (
             <>
             <Tooltip title="Delete Data" placement="top"><Button onClick={() => handleAction('Delete')} color="error" variant="contained" startIcon={<DeleteIcon/>}>
                 Delete
             </Button>
             </Tooltip>
             &nbsp;
             <Tooltip title="Hide Data" placement="top"><Button onClick={() => handleAction('Hide')} variant="contained" startIcon={<HideSourceIcon/>}>
                 Hide
             </Button>
             </Tooltip>
             &nbsp;
             <Tooltip title="Hide Data" placement="top"><Button onClick={() => handleAction('Unhide')} variant="contained" startIcon={<VisibilityIcon/>}>
                 Unhide
             </Button>
             </Tooltip>
             </>
         );
     }, []);
    const handleConfirmUpdate = () => {

    }
    return(
        <Box sx = {{'margin':'20px','textAlign':'center'}}>
            <DataTableExtensions
            {...tableData}
            >
                <DataTable
                    title = "List of Job Vacancies"
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    pagination
                    selectableRows
                    subHeader = {true}
                    contextActions={contextActions}
                    onSelectedRowsChange={handleRowSelected}
                    clearSelectedRows={toggleCleared}
                    conditionalRowStyles = {conditionalRowStyles}
                />
            </DataTableExtensions>
            <Modal
                open={actionModal}
                onClose={() => setActionModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                {/* <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                    Confirmation
                </Typography> */}
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <Typography sx={{'textAlign':'center','paddingBottom':'10px','color':'#2196F3'}} variant="h4">Confirm {selectedAction} ?</Typography>
                        </Grid>
                    </Grid>

                    
                <Typography id="modal-modal-description" sx={{ mt: 2}}>
                
                </Typography>
               
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                <Button variant="contained" sx={{mt:2}} onClick = {handleConfirmAction} startIcon = {<CheckIcon/>}>{selectedAction}</Button>
                <Button variant="contained" color="error" sx={{mt:2}} onClick = {()=>setActionModal(false)} startIcon = {<CancelIcon/>}>Cancel</Button>
                </Box>

                </Box>
                {/* <ToastContainer /> */}

            </Modal>
            <Modal
                open={updateOpen}
                onClose={() => setUpdateOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                    Updating Job Post
                </Typography>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <TextField  variant="outlined" fullWidth value = {selectedJob.PositionTitle} disabled label="Position Title"/>
                        </Grid>
                        <Grid item md={12}>
                            <TextField  variant="outlined" fullWidth value = {selectedJob.itemNo} disabled label="Plantilla Number"/>
                        </Grid>
                        <Grid item md={12}>
                            <TextField  variant="outlined" type="date" fullWidth value = {selectedJob.posting_date} disabled label="Posting Date"/>
                        </Grid>
                        <Grid item md={12}>
                            <TextField  variant="outlined" type="date" fullWidth name ="closing_date" value = {selectedJob.closing_date} onChange = {handleUpdateData} label="Closing Date"/>
                        </Grid>
                    </Grid>

                    
                <Typography id="modal-modal-description" sx={{ mt: 2}}>
                
                </Typography>
               
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                <Button variant="contained" sx={{mt:2}} onClick = {handleConfirmUpdate}><CheckIcon/> &nbsp; Confirm Update</Button>
                <Button variant="contained" color="error" sx={{mt:2}} onClick = {()=>setUpdateOpen(false)}><CancelIcon/> &nbsp;Cancel</Button>
                </Box>

                </Box>
                {/* <ToastContainer /> */}

            </Modal>
        </Box>
    )
}