import React, { useEffect } from 'react'
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Fab, Fade,Tooltip } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// mui components
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// mui icons components
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

//data table
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import {getApplicantPdsEducBackground} from './ApplicantEducBackgroundRequest';
import Swal from 'sweetalert2';
import moment from 'moment';
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
function ApplicantEducBackground() {
  // media query
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading,setLoading] = React.useState(true);
  const [data,setData] = React.useState([]);
  //variable for selected row of job list viewing
  const [selectedRows, setSelectedRows] = React.useState([]);
  //clear job list selectedRows data
  const [toggleCleared, setToggleCleared] = React.useState(false);
  // functions
  useEffect(() => {
    getApplicantPdsEducBackground()
    .then((response)=>{
      setLoading(false)
      console.log(response.data)
    }).catch((error)=>{
      console.log(error)
    })
  }, [])
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
        <Tooltip title="Update Data" placement="top"><Button variant="contained"><EditIcon/>Update</Button></Tooltip>
      </Box>
    },
    ];
    // react data table extension
    const tableData = {
      columns,
      data,
    };
    //action show when row is selected
    const contextActions = React.useMemo(() => {
      //handle action
      const deleteAction = () => {
          
      }
      return (
          <>
          <Tooltip title="Delete Data" placement="top"><Button onClick={deleteAction} color="error" variant="contained" startIcon={<DeleteIcon/>}>
              Delete
          </Button>
          </Tooltip>
          </>
      );
    }, []);
    //set data when job list viewing row is selected
    const handleRowSelected = React.useCallback(state => {
      setSelectedRows(state.selectedRows);
    }, []);
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', gap: 1, flexDirection: 'column', bgcolor: '#fff', p: 1, borderRadius: '.5rem' }} >

        {loading ? (
          <Stack spacing={3}>
            <Skeleton variant="text" width='20%' />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='40%' />
              <Skeleton variant="text" width='60%' />
            </Box>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="text" width='60%' />
              <Skeleton variant="text" width='40%' />
            </Box>
          </Stack>
        ) : (
          <Fade in>
              <Box sx={{ mb: 1 }}>
              <Typography variant="h5" sx={{'textAlign':'center','margin':'20px','color':'#2196F3'}} >Educational Background</Typography>
                <Box sx={{display:'flex',flexDirection:'row'}}>

                </Box>
                <Button variant='contained' color="success"><AddIcon /> Add record</Button>
                  <DataTable
                      columns={columns}
                      data={data}
                      customStyles={customStyles}
                      pagination
                      selectableRows
                      subHeader = {true}
                      contextActions={contextActions}
                      onSelectedRowsChange={handleRowSelected}
                      clearSelectedRows={toggleCleared}
                      // conditionalRowStyles = {conditionalRowStyles}
                  />
              </Box>
          </Fade>
        )}
      </Grid>
    </Grid>
  )
}

export default ApplicantEducBackground