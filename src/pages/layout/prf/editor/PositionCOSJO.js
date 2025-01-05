import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getDept, getPositionList } from "../axios/prfRequest";
import axios from "axios";

import { Box, Grid, FormControl, FormLabel, Backdrop, CircularProgress, Container, CardContent, Card, Button, InputLabel, Select, MenuItem, Stack, } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, } from "@mui/icons-material";

import CustomTabs from "../components/export_components/CustomTabs";
import CustomDisplayDataTable from "../components/export_components/CustomDisplayDataTable";
import CustomFileUpload from "../components/export_components/CustomFileUpload";
import CustomDataTable from "../components/export_components/CustomDataTable";
import { buildTreeNA, } from "../../department_org_structure/api/component";
import { getDeptOrgStruct2 } from "../../department_org_structure/api/departmentRequest";

// const columns = [
//   { field: 'id', headerName: 'ID', width: 60 },
//   { field: 'position_title', headerName: 'POSITION', width: 240 },
//   { field: 'lvl', headerName: 'LEVEL', width: 60 },
//   { field: 'res_no', headerName: 'RES_NO', width: 60 },
//   { field: 'sector', headerName: 'SECTOR', width: 60 },
//   { field: 'sg_jg', headerName: 'SG', width: 60 },
//   { field: 'job_summary', headerName: 'JOB SUMMARY', width: 200 },
//   { field: 'education', headerName: 'EDUCATION', width: 220 },
//   { field: 'eligibility', headerName: 'ELIGIBILITY', width: 220 },
//   { field: 'experience', headerName: 'EXPERIENCE', width: 220 },
//   { field: 'training', headerName: 'TRAINING', width: 220 },
//   { field: 'technical_skills', headerName: 'TECHNICAL SKILLS', width: 220 },
// ]



const positionColumns = [
  { id: 'id', label: 'ID' },
  { id: 'position_title', label: 'Position Name' },
  { id: 'education', label: 'Education' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'experience', label: 'Experience' },
  { id: 'training', label: 'Training' },
  { id: 'technical_skills', label: 'Technical Skills' },
  { id: 'job_summary', label: 'Job summary' },
];

const qsColumns = [
  { id: 'id', label: 'ID' },
  { id: 'category', label: 'Category' },
]

const jobColumns = [
  { id: 'id', label: 'ID' },
  { id: 'job_summ', label: 'Job summary' },
]

const deptColumns = [
  { id: 'id', label: 'ID' },
  { id: 'dept_title', label: 'Department' },
  { id: 'div_name', label: 'Division' },
  { id: 'sec_name', label: 'Section' },
  { id: 'unit_name', label: 'Unit' },
]



const tabs = [
  { value: '1', label: 'Positions' },
  { value: '2', label: 'Education' },
  { value: '3', label: 'Eligibility' },
  { value: '4', label: 'Experience' },
  { value: '5', label: 'Training' },
  { value: '6', label: 'Technical Skills' },
  { value: '7', label: 'Job Summary' },
];


function PositionCOSJO() {
  const controller = new AbortController();
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);

  const [sheetData, setSheetData] = useState([]);
  const [sheetName, setSheetName] = useState('');
  const [editToggler, setEditToggler] = useState(false);

  const [show, setShow] = useState(0)
  const [deptOrgData, setDeptOrgData] = useState([])
  const [deptData, setDeptData] = useState([])
  const [selectedDeptCode, setSelectedDeptCode] = useState(0)
  // let maxChildrenCount = 0;
  const [tempDeptOrg, setTempDeptOrg] = useState([])



  // const [requestQueue, setRequestQueue] = useState([]);
  // const [processingQueue, setProcessingQueue] = useState(false);


  // const [buildPositions, setBuildPositions] = useState({
  //   position_title: null,
  //   job_summ: null,
  //   qs_educ_id: null,
  //   qs_elig_id: null,
  //   qs_expe_id: null,
  //   qs_train_id: null,
  //   qs_tech_skll_id: null,
  // });

  // const processQueue = async () => {
  //   if (processingQueue || requestQueue.length === 0) return;
  //   setProcessingQueue(true);
  //   const currentRequest = requestQueue[0];
  //   try {
  //     await currentRequest();
  //   } catch (error) {
  //     console.error('Error processing request:', error);
  //   } finally {
  //     setRequestQueue(prevQueue => prevQueue.slice(1));
  //     setProcessingQueue(false);
  //   }
  // };
  // useEffect(() => {
  //   if (!processingQueue) {
  //     processQueue();
  //   }
  // }, [requestQueue, processingQueue]);
  // const enqueueRequest = (requestFn) => {
  //   setRequestQueue(prevQueue => [...prevQueue, requestFn]);
  // };

  useEffect(() => {
    setLoading(true)
    fetchData();
    return () => {
      controller.abort();
    };
  }, [])

  const fetchData = async () => {
    try {
      let [res, res2, res3] = await Promise.all([
        axios.get(`api/prf/get-position-list`, {}, { signal: controller.signal }),
        getDept(),
        axios.get(`api/department-organization-structure/get-tabled-dept-org`, {}, { signal: controller.signal }),
      ])

      if (res.data.status === 500 || res2.data.status === 500 || res3.data.status === 500) {
        toast.error(res.data.message);
      }

      setRowData(res.data.data)
      setDeptData(res2.data.data)
      setDeptOrgData(res3.data.data)
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled: ', error.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false)
    }
  }

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const sendDataInChunks = async (data) => {
    const chunkSize = 500;
    const chunks = chunkArray(data, chunkSize);
    let i = 0;
    for (const chunk of chunks) {
      try {
        let res = await axios.post(`api/prf/prf-tracker/add-positions`,
          { data: chunk },
          { signal: controller.signal }
        );
        // console.log('Chunk sent successfully:', chunk);
        i = i + 1;
        console.log(Object.keys(chunks).length, i)
        if (Object.keys(chunks).length === i) {
          fetchData();
          toast.success(res.data.message)
        }
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }
  };

  const sendQSDataInChunks = async (data, tt) => {
    const chunkSize = 500;
    const chunks = chunkArray(data, chunkSize);
    let i = 0;
    for (const chunk of chunks) {
      try {
        let res = await axios.post(`api/prf/personnel-request/add-qualification-standard`,
          { data: chunk, qs: tt },
          { signal: controller.signal }
        );
        // console.log('Chunk sent successfully:', chunk);
        i = i + 1;
        console.log(Object.keys(chunks).length, i)
        if (Object.keys(chunks).length === i) {
          fetchData();
          toast.success(res.data.message)
        }
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }
  };

  const sendDataInChunksPosQS = async (data) => {
    const chunkSize = 500;
    const chunks = chunkArray(data, chunkSize);
    let i = 0;
    for (const chunk of chunks) {
      try {
        let res = await axios.post(`api/prf/prf-tracker/set-positions-qs`, { data: chunk }, { signal: controller.signal });

        i = i + 1;
        console.log(Object.keys(chunks).length, i)
        if (Object.keys(chunks).length === i) {
          fetchData();
          toast.success(res.data.message)
        }
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }
  }

  const handleSubmit = (type) => {
    switch (type) {
      case 'position':
        sendDataInChunks(sheetData);
        break;
      case '2':
        sendQSDataInChunks(sheetData, 'education')
        break;
      case '3':
        sendQSDataInChunks(sheetData, 'eligibility')
        break;
      case '4':
        sendQSDataInChunks(sheetData, 'experience')
        break;
      case '5':
        sendQSDataInChunks(sheetData, 'training')
        break;
      case '6':
        sendQSDataInChunks(sheetData, 'technical_skills')
        break;
      case '7':
        sendQSDataInChunks(sheetData, 'job_summary')
        break;
      case 'set_position_qs':

        sendDataInChunksPosQS(sheetData);
        break;

      default:
        toast.warning('Ops, button not found!')
        break;
    }
  }

  const handleSearchDept = () => {
    let res = deptOrgData.filter((i) => i.dept_code === selectedDeptCode)
    setTempDeptOrg(res)
  }

  const handleSubmitDepartments = () => {
    sendDataInChunksDept(sheetData);
  }

  const sendDataInChunksDept = async (data) => {
    const chunkSize = 500;
    const chunks = chunkArray(data, chunkSize);
    let i = 0;
    for (const chunk of chunks) {
      try {
        let res = await axios.post(`api/department-organization-structure/insert-bulk`, { data: chunk }, { signal: controller.signal });

        i = i + 1;
        console.log(Object.keys(chunks).length, i)
        if (Object.keys(chunks).length === i) {
          fetchData();
          toast.success(res.data.message)
        }
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }
  }

  useEffect(() => {
    console.log(tempDeptOrg)
  }, [tempDeptOrg])

  return (
    loading ?
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} >
        Fetching data, please wait...&nbsp; <CircularProgress color="inherit" />
      </Backdrop>
      :
      <Box sx={{ margin: "0 10px 10px 10px" }}>
        <Box>
          <Button variant="contained" onClick={() => { setShow(1); sheetData([]); }} > Set Positions </Button>
          &nbsp;
          <Button variant="contained" onClick={() => { setShow(2); sheetData([]); }} > Set Department Organization Structure </Button>
        </Box>

        {show === 1 ?
          <Card>
            <CardContent>
              <CustomTabs tabsArr={tabs} tabsLabel="Tabs Example" height="100%">
                <Box tabValue="1">
                  <CustomDisplayDataTable columns={positionColumns} rows={rowData.position_builder} />
                </Box>
                <Box tabValue="2">
                  <CustomDisplayDataTable columns={qsColumns} rows={rowData.categories.education} />
                </Box>
                <Box tabValue="3">
                  <CustomDisplayDataTable columns={qsColumns} rows={rowData.categories.eligibility} />
                </Box>
                <Box tabValue="4">
                  <CustomDisplayDataTable columns={qsColumns} rows={rowData.categories.experience} />
                </Box>
                <Box tabValue="5">
                  <CustomDisplayDataTable columns={qsColumns} rows={rowData.categories.training} />
                </Box>
                <Box tabValue="6">
                  <CustomDisplayDataTable columns={qsColumns} rows={rowData.categories.technical_skills} />
                </Box>
                <Box tabValue="7">
                  <CustomDisplayDataTable columns={jobColumns} rows={rowData.categories.job_summary} />
                </Box>
              </CustomTabs>
              <br />
              <Button variant="contained" onClick={() => handleSubmit('set_position_qs')}> Submit </Button>
              <CustomFileUpload setData={setSheetData} setSheetNm={setSheetName} />
              {Object.keys(sheetData).length > 0 &&
                <>
                  <CustomDataTable data={sheetData} setData={setSheetData} maxHeight={'250px'} />
                </>
              }
            </CardContent>
          </Card>
          : show === 2 ?
            <Card>
              <CardContent>
                <Button variant="contained" onClick={() => handleSubmitDepartments()} > Submit </Button>
                <br />
                <CustomFileUpload setData={setSheetData} setSheetNm={setSheetName} />
                {Object.keys(sheetData).length > 0 &&
                  <CustomDataTable data={sheetData} setData={setSheetData} maxHeight={'400px'} />
                }
              </CardContent>
            </Card>
            : <></>
        }
      </Box >
  )
}

export default PositionCOSJO


/////////////////////
//   < Stack spacing = { 1} direction = { 'row'} alignItems = { 'center'} >
//                   <Box sx={{ width: '20rem' }}>
//                     <FormControl fullWidth>
//                       <InputLabel id="dept-selector" size="small"> Select a Department </InputLabel>
//                       <Select sx={{ whiteSpace: "nowrap!important", overflow: "hidden", textOverflow: "ellipsis !important", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }} name="dept_selector" labelId="dept-selector" label="Select a Department" variant="outlined" size="small"
//                         value={selectedDeptCode} onChange={(ev) => setSelectedDeptCode(ev.target.value)} >
//                         {deptData.map((item, index) => (
//                           <MenuItem key={"dept-" + item.id + index} value={item.dept_code}>
//                             {item.dept_title}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Box>
//                   <Box>
//                     <Button variant="contained" onClick={handleSearchDept} >
//                       <SearchIcon />
//                     </Button>
//                   </Box>
//                 </ >
// {
//   Object.keys(tempDeptOrg).length > 0 &&
//     <CustomDisplayDataTable columns={deptColumns} rows={tempDeptOrg} />
// }