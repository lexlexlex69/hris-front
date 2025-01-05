import React from 'react';
import {FormControl,InputLabel,Select,MenuItem,Box,Button,Tooltip,Container,Typography,Modal,Grid,TextField} from "@mui/material";
import { getJobList,postJobVacancies} from "./JobPostingRequest";
//data table
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import moment from 'moment';

//mui icons
import PostAddIcon from '@mui/icons-material/PostAdd';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckIcon from '@mui/icons-material/Check'
import CancelIcon from '@mui/icons-material/Cancel'
import { toast } from 'react-toastify';

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
        },
    },
};
export default function AddJobVacancies(){
    const [employmentStatus, setEmploymentStatus] = React.useState('');
    const [data,setData] = React.useState([]);

    //colums for viewing job list table
    const columns = [
        // {
        //     name: 'ID',
        //     sortable:true,
        //     selector: row => row.id,
        // },
        {
            name: 'Position Title',
            sortable:true,
            selector: row => row.PositionTitle,
        },
        {
            name: 'Office Name',
            sortable:true,
            selector: row => row.Office,
        },
        {
            name: 'Plantilla Item No.',
            selector: row => row.plantilla_no,
        },
        {
            name: 'Action',
            selector: row => <Box>
            <Tooltip title="Post Job" placement="top"><Button variant="contained" startIcon={<PostAddIcon/>} onClick = {() => handlePostOpen(row) }>Post</Button></Tooltip>
          </Box>
        },
    ];
    const handleChange = (event) => {
        setEmploymentStatus(event.target.value);
        getJobList(event.target.value)
        .then((response)=>{
            setData(response.data)
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    };
    // react data table extension
    const tableData = {
        columns,
        data,
    };
    const [postOpen,setPostOpen] = React.useState(false)
    const [selectedJob,setSelectedJob] = React.useState({})
     // open update modal
    const handlePostOpen = (row) =>{
        setSelectedJob(row);
        setPostOpen(true)
    }
    const handleUpdateData = (event) => {
        setSelectedJob({...selectedJob,[event.target.name]:event.target.value})
    }
    const [closingdate,setClosingDate] = React.useState('');
    const handleConfirmPost = () => {
        var data2 = {
            value:selectedJob,
            closing_date:closingdate,
            emp_status:employmentStatus
        }
        postJobVacancies(data2)
        .then((response)=>{
            if(response.data.status === 'success'){
                toast.success('Successfully Posted')
                setData(response.data.data)
                setPostOpen(false)
            }else{
                toast.error('Something went wrong !, Please try again')
            }
        }).catch((error)=>{
            toast.error(error)
        })
    }
    return(
        <Box sx={{'margin':'10px'}}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Employment Status</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={employmentStatus}
                label="Employment Status"
                onChange={handleChange}
            >
                <MenuItem value="PERMANENT">Permanent</MenuItem>
                <MenuItem value="CASUAL">Casual</MenuItem>
            </Select>
        </FormControl>
        <DataTableExtensions
            {...tableData}
            >
            <DataTable
                title = {'List of '+employmentStatus+' Job Position'}
                data = {data}
                columns = {columns}
                pagination
                customStyles={customStyles}

            />
        </DataTableExtensions>
        <Modal
                open={postOpen}
                onClose={() => setPostOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" sx={{'textAlign':'center','paddingBottom':'20px','color':'#2196F3'}} variant="h6" component="h2">
                    Posting Vacant Position
                </Typography>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <TextField
                            variant="outlined"
                            fullWidth 
                            value = {selectedJob.PositionTitle}
                            disabled
                            label="Position Title"/>
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                            variant="outlined"
                            fullWidth
                            value = {selectedJob.plantilla_no}
                            disabled label="Plantilla Number"/>
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                            variant="outlined"
                            type="date"
                            fullWidth
                            name ="closing_date"
                            value = {closingdate}
                            onChange = {(val) => setClosingDate(val.target.value)}
                            label="Closing Date"
                            InputLabelProps={{
                                shrink: true,}}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                            variant="outlined"
                            multiline
                            fullWidth
                            name ="closing_date"
                            label="Posting Details"
                            InputLabelProps={{
                                shrink: true,}}
                            />
                        </Grid>
                        
                    </Grid>

                    
                <Typography id="modal-modal-description" sx={{ mt: 2}}>
                
                </Typography>
               
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                <Button variant="contained" sx={{mt:2}} onClick = {handleConfirmPost}><CheckIcon/> &nbsp; Confirm Post</Button>
                <Button variant="contained" color="error" sx={{mt:2}} onClick = {()=>setPostOpen(false)}><CancelIcon/> &nbsp;Cancel</Button>
                </Box>

                </Box>
                {/* <ToastContainer /> */}

            </Modal>
        </Box>
    )
}